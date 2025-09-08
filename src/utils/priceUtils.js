// Utility functions for price calculations and special pricing

/**
 * Get effective price for a given date, considering special prices
 * @param {Object} product - Product object with specialPrices
 * @param {string} priceType - Type of price (adultprice, childprice, etc.)
 * @param {string|Date} date - Date to check for special pricing
 * @returns {number} Effective price for the given date
 */
export const getEffectivePrice = (product, priceType, date) => {
  if (!product || !date) return product?.[priceType] || 0;
  
  const dateStr = typeof date === 'string' ? date : new Date(date).toISOString().split('T')[0];
  const specialPrices = product.specialPrices?.[dateStr];
  
  return specialPrices?.[priceType] || product[priceType] || 0;
};

/**
 * Check if a product has special pricing for a given date
 * @param {Object} product - Product object with specialPrices
 * @param {string|Date} date - Date to check
 * @returns {boolean} True if special pricing exists for the date
 */
export const hasSpecialPricing = (product, date) => {
  if (!product || !date) return false;
  
  const dateStr = typeof date === 'string' ? date : new Date(date).toISOString().split('T')[0];
  return product.specialPrices?.[dateStr] && Object.keys(product.specialPrices[dateStr]).length > 0;
};

/**
 * Get all special pricing dates for a product
 * @param {Object} product - Product object with specialPrices
 * @returns {Array} Array of date strings with special pricing
 */
export const getSpecialPricingDates = (product) => {
  if (!product?.specialPrices) return [];
  return Object.keys(product.specialPrices).sort();
};

/**
 * Format date for display
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date string
 */
export const formatDateForDisplay = (date) => {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Calculate total price for tickets
 * @param {Object} product - Product object
 * @param {number} adultQuantity - Number of adult tickets
 * @param {number} childQuantity - Number of child tickets
 * @param {string|Date} date - Date for pricing
 * @param {boolean} isSpecialDay - Whether it's a special day (weekend/holiday)
 * @returns {Object} Object with grandTotal and advanceTotal
 */
export const calculateTicketTotal = (product, adultQuantity, childQuantity, date, isSpecialDay = false) => {
  if (!product) return { grandTotal: 0, advanceTotal: 0 };
  
  const effectiveAdultPrice = getEffectivePrice(product, 'adultprice', date);
  const effectiveChildPrice = getEffectivePrice(product, 'childprice', date);
  const effectiveAdvancePrice = getEffectivePrice(product, 'advanceprice', date);
  const effectiveWeekendPrice = getEffectivePrice(product, 'weekendprice', date);
  const effectiveWeekendChildPrice = getEffectivePrice(product, 'price', date);
  const effectiveWeekendAdvance = getEffectivePrice(product, 'weekendadvance', date);
  
  let adultPrice, childPrice, advancePrice;
  
  // Check if special pricing exists for this date
  const dateStr = typeof date === 'string' ? date : new Date(date).toISOString().split('T')[0];
  const hasSpecialPricing = product.specialPrices?.[dateStr] && Object.keys(product.specialPrices[dateStr]).length > 0;
  
  if (hasSpecialPricing) {
    // Use special pricing if available (overrides weekend/regular pricing)
    adultPrice = effectiveAdultPrice;
    childPrice = effectiveChildPrice;
    advancePrice = effectiveAdvancePrice;
  } else if (isSpecialDay) {
    // Use weekend pricing if no special pricing
    adultPrice = effectiveWeekendPrice || effectiveAdultPrice;
    childPrice = effectiveWeekendChildPrice || effectiveChildPrice;
    advancePrice = effectiveWeekendAdvance || effectiveAdvancePrice;
  } else {
    // Use regular pricing
    adultPrice = effectiveAdultPrice;
    childPrice = effectiveChildPrice;
    advancePrice = effectiveAdvancePrice;
  }
  
  const grandTotal = (adultQuantity * adultPrice) + (childQuantity * childPrice);
  
  // Check payment type - if full payment, use full prices; otherwise use advance prices
  const paymentType = product.paymentType || 'advance';
  let advanceTotal;
  
  if (paymentType === 'full') {
    // For full payment, use the full prices (adult + child full prices)
    advanceTotal = grandTotal;
  } else {
    // For advance payment, use advance prices
    advanceTotal = (adultQuantity * advancePrice) + (childQuantity * advancePrice);
  }
  
  return { grandTotal, advanceTotal };
};
