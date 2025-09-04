// src/components/CustomCalendar.jsx
import React, { useMemo } from "react";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  format,
  isSameMonth,
  isSameDay,
  isBefore,
  startOfDay,
} from "date-fns";
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import { getEffectivePrice } from '../utils/priceUtils';


export default function CustomCalendar({
  selectedDate,
  onDateChange,
  normalPrice,
  weekendPrice,
  // *** NEW: Props to receive dynamic pricing data ***
  specialDates = [],
  isPricingActive = false,
  product = null, // Add product prop for special pricing
}) {
  const parseDate = (d) => {
    if (!d) return null;
    return d instanceof Date ? d : new Date(d);
  };

  const controlledDate = parseDate(selectedDate);
  const today = startOfDay(new Date());

  const [currentMonth, setCurrentMonth] = React.useState(
    startOfMonth(controlledDate || today)
  );

  // *** NEW: Create a fast lookup Set for special dates ***
  // This is much more efficient than searching an array every time.
  const specialDatesSet = useMemo(() => {
    if (!isPricingActive || !specialDates) {
      return new Set();
    }
    // Convert the array of ISO date strings into a Set of 'yyyy-MM-dd' strings
    return new Set(
      specialDates.map(dateStr => format(new Date(dateStr), 'yyyy-MM-dd'))
    );
  }, [specialDates, isPricingActive]);


  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calStart = startOfWeek(monthStart);
  const calEnd = endOfWeek(monthEnd);

  const weeks = [];
  let day = calStart;
  while (day <= calEnd) {
    const week = [];
    for (let i = 0; i < 7; i++) {
      week.push(day);
      day = addDays(day, 1);
    }
    weeks.push(week);
  }

  const pick = (d) => {
    if (onDateChange) {
      // Pass the date back in the same 'yyyy-MM-dd' format as the initial state
      onDateChange(format(d, 'yyyy-MM-dd'));
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto bg-white p-5 rounded-2xl shadow-lg border border-slate-200/80 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setCurrentMonth((m) => subMonths(m, 1))}
          className="p-2 rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
          aria-label="Previous month"
        >
          <ChevronLeftIcon className="w-6 h-6" />
        </button>
        <div className="font-bold text-lg text-slate-800">
          {format(currentMonth, "MMMM yyyy")}
        </div>
        <button
          onClick={() => setCurrentMonth((m) => addMonths(m, 1))}
          className="p-2 rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
          aria-label="Next month"
        >
          <ChevronRightIcon className="w-6 h-6" />
        </button>
      </div>

      {/* Weekdays */}
      <div className="grid grid-cols-7 gap-1 text-center text-sm font-semibold text-slate-500 mb-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((wd) => (
          <div key={wd}>{wd}</div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-y-1">
        {weeks.flat().map((d) => {
          const inMonth = isSameMonth(d, currentMonth);
          const isSelected = controlledDate && isSameDay(d, controlledDate);
          const isToday = isSameDay(d, today);
          const isPast = isBefore(d, today);
          const isDisabled = isPast || !inMonth;

          // --- START: DYNAMIC PRICE LOGIC ---
          // Check if the current day 'd' is in our set of special dates
          const isSpecialDay = specialDatesSet.has(format(d, 'yyyy-MM-dd'));
          const dateStr = format(d, 'yyyy-MM-dd');
          
          // Get effective price using the special pricing system
          let priceToShow = normalPrice;
          let hasSpecialPricing = false;
          
          if (product) {
            // Use special pricing if available, otherwise fall back to weekend/regular pricing
            const effectiveAdultPrice = getEffectivePrice(product, 'adultprice', dateStr);
            const effectiveWeekendPrice = getEffectivePrice(product, 'weekendprice', dateStr);
            
            // Check if this date has special pricing
            hasSpecialPricing = effectiveAdultPrice !== product.adultprice || effectiveWeekendPrice !== product.weekendprice;
            
            if (isSpecialDay) {
              priceToShow = effectiveWeekendPrice || effectiveAdultPrice || weekendPrice || normalPrice;
            } else {
              priceToShow = effectiveAdultPrice || normalPrice;
            }
          } else {
            // Fallback to old logic if no product provided
            priceToShow = isSpecialDay ? weekendPrice : normalPrice;
          }
          // --- END: DYNAMIC PRICE LOGIC ---

          let buttonClasses = "flex flex-col items-center justify-center h-11 w-11 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400";

          if (isDisabled) {
            buttonClasses += " text-slate-300 cursor-not-allowed";
          } else if (isSelected) {
            buttonClasses += " bg-slate-800 text-white font-bold shadow-md";
          } else {
            buttonClasses += " text-slate-700 hover:bg-slate-100";
            // *** NEW: Add a visual indicator for special price days ***
            if (isSpecialDay) {
                buttonClasses += " bg-teal-50 border border-teal-200";
            }
            // Add special pricing indicator
            if (hasSpecialPricing) {
                buttonClasses += " bg-blue-50 border border-blue-200";
            }
            if (isToday) {
                buttonClasses += " bg-slate-100 font-semibold";
            }
          }

          return (
            <div key={d.toISOString()} className="flex justify-center items-center">
              <button
                onClick={() => !isDisabled && pick(d)}
                disabled={isDisabled}
                aria-pressed={Boolean(isSelected)}
                className={buttonClasses}
              >
                <span className={isPast && inMonth ? "line-through" : ""}>{format(d, "d")}</span>
                
                {!isDisabled && priceToShow > 0 ? (
                  <span className={`text-[10px] font-normal mt-0.5 ${ 
                    isSelected ? "opacity-90" : 
                    hasSpecialPricing ? "text-blue-700 font-semibold" :
                    isSpecialDay ? "text-teal-700 font-semibold" : 
                    "text-slate-500" 
                  }`}>
                    ₹{Number(priceToShow).toFixed(0)}
                  </span>
                ) : (
                  isToday && !isDisabled && (
                    <span className="w-1 h-1 bg-slate-500 rounded-full mt-1"></span>
                  )
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}