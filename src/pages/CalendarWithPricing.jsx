// src/components/CustomCalendar.jsx
import React, { useEffect, useState } from "react";
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
  parseISO,
  isBefore,
  startOfDay,
} from "date-fns";

/**
 * Helper components for icons
 */
const ChevronLeftIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path
      fillRule="evenodd"
      d="M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z"
      clipRule="evenodd"
    />
  </svg>
);

const ChevronRightIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path
      fillRule="evenodd"
      d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z"
      clipRule="evenodd"
    />
  </svg>
);


/**
 * CustomCalendar
 * A modern, premium-looking calendar component.
 * Props:
 * - selectedDate: Date | ISO string | null
 * - onDateChange: function(Date) -> void
 * - price: number (displayed inside selected date circle)
 */
export default function CustomCalendar({ selectedDate, onDateChange, price }) {
  const parseDate = (d) => {
    if (!d) return null;
    if (typeof d === "string") return parseISO(d);
    return d instanceof Date ? d : new Date(d);
  };

  const controlledDate = parseDate(selectedDate);
  // Use startOfDay to compare dates without time component
  const today = startOfDay(new Date());

  const [currentMonth, setCurrentMonth] = useState(
    startOfMonth(controlledDate || today)
  );
  const [sel, setSel] = useState(controlledDate);

  useEffect(() => {
    const newSel = parseDate(selectedDate);
    setSel(newSel);
    if (newSel) {
      setCurrentMonth(startOfMonth(newSel));
    }
  }, [selectedDate]);

  // Calendar grid calculation
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calStart = startOfWeek(monthStart);
  const calEnd = endOfWeek(monthEnd);

  // Build weeks array
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
    setSel(d);
    if (onDateChange) onDateChange(d);
  };

  return (
    <div className="w-full max-w-sm mx-auto bg-white p-5 rounded-2xl shadow-lg border border-slate-200/80 font-sans">
      {/* Header: Month Navigation */}
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

      {/* Weekday Headings */}
      <div className="grid grid-cols-7 gap-1 text-center text-sm font-semibold text-slate-500 mb-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((wd) => (
          <div key={wd}>{wd}</div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-y-1">
        {weeks.flat().map((d) => {
          const inMonth = isSameMonth(d, currentMonth);
          const isSelected = sel && isSameDay(d, sel);
          const isToday = isSameDay(d, today);
          const isPast = isBefore(d, today);
          
          // A date is disabled if it's in the past or not in the current month view
          const isDisabled = isPast || !inMonth;

          let buttonClasses = "flex flex-col items-center justify-center h-11 w-11 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400";
          
          if (isDisabled) {
            buttonClasses += " text-slate-300 cursor-not-allowed";
          } else if (isSelected) {
            buttonClasses += " bg-slate-800 text-white font-bold shadow-md";
          } else if (isToday) {
            buttonClasses += " bg-slate-100 text-slate-900 font-semibold hover:bg-slate-200";
          } else {
            buttonClasses += " text-slate-700 hover:bg-slate-100";
          }

          return (
            <div key={d.toISOString()} className="flex justify-center items-center">
              <button
                onClick={() => !isDisabled && pick(d)}
                disabled={isDisabled}
                aria-pressed={Boolean(isSelected)}
                className={buttonClasses}
              >
                <span className={isPast && inMonth ? "line-through" : ""}>
                  {format(d, "d")}
                </span>
                
                {/* Price inside selected circle or dot for today */}
                {isSelected && price > 0 ? (
                  <span className="text-[10px] font-normal opacity-90 mt-1">
                    ₹{Number(price).toFixed(0)}
                  </span>
                ) : (
                  !isSelected && isToday && !isDisabled && (
                    <span className="w-1 h-1 bg-slate-500 rounded-full "></span>
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