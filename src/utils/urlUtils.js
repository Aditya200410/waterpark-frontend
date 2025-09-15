/**
 * Utility functions for URL generation and parsing
 */

/**
 * Creates a URL-friendly slug from a product name
 * @param {string} name - The product name
 * @returns {string} - URL-friendly slug
 */
export const createSlug = (name) => {
  if (!name) return '';
  
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
};

/**
 * Creates a product URL with only the product name slug
 * @param {string} id - The product ID (not used in URL but kept for compatibility)
 * @param {string} name - The product name
 * @returns {string} - URL with only the product name slug
 */
export const createProductUrl = (id, name) => {
  if (!name) return '';
  const slug = createSlug(name);
  return `/waterpark/${slug}`;
};


/**
 * Extracts product name from URL slug
 * @param {string} urlParam - The URL parameter (e.g., "virar-waterpark")
 * @returns {string} - The product name slug
 */
export const extractProductSlugFromUrl = (urlParam) => {
  if (!urlParam) return '';
  return urlParam;
};

/**
 * Creates a blog URL with blog/blogname format
 * @param {string} id - The blog ID (not used in URL but kept for compatibility)
 * @param {string} name - The blog name
 * @returns {string} - URL with blog/blogname format
 */
export const createBlogUrl = (id, name) => {
  if (!name) return '';
  const slug = createSlug(name);
  return `/blog/${slug}`;
};

/**
 * Creates an offer URL with offer/offername format
 * @param {string} id - The offer ID (not used in URL but kept for compatibility)
 * @param {string} name - The offer name
 * @returns {string} - URL with offer/offername format
 */
export const createOfferUrl = (id, name) => {
  if (!name) return '';
  const slug = createSlug(name);
  return `/offer/${slug}`;
};

/**
 * Creates a URL with seller token if available
 * @param {string} path - The base path
 * @param {string} sellerToken - The seller token
 * @returns {string} - URL with seller token
 */
export const createURLWithSellerToken = (path, sellerToken) => {
  if (!sellerToken) return path;
  
  const separator = path.includes('?') ? '&' : '?';
  return `${path}${separator}seller=${sellerToken}`;
};