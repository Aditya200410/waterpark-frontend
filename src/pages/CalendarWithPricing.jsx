import React from 'react';
import { DayPicker } from 'react-day-picker';
import { format } from 'date-fns'; // You already have this import!
import 'react-day-picker/dist/style.css';

export function CalendarWithPricing(props) {
  const { price, selectedDate, onDateChange } = props;

  return (
    <div className="flex flex-col items-center mb-4">
      <DayPicker
        mode="single"
        selected={selectedDate}
        onSelect={onDateChange}
        disabled={{ before: new Date() }}
        fromDate={new Date()}
        className="bg-gradient-to-br from-[#E0F7FA] to-white p-4 rounded-xl shadow-lg"
      />
      
      
      {selectedDate && price > 0 && (
        <div className="flex items-center text-xl text-blue-700 font-bold mt-5">
       
          Price for {format(selectedDate, 'PPP')}: ₹{price.toFixed(2)}
        </div>
      )}
    </div>
  );
}