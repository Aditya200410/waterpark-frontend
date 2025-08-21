import React, { useEffect, useState } from 'react';
import { DayPicker } from 'react-day-picker';
import { format } from 'date-fns';
import 'react-day-picker/dist/style.css';
import { toast } from 'react-toastify';
import config from '../config/config'; // Adjust the path to your config file
import { useNavigate, useParams } from 'react-router-dom';
// This is where your pricing data would come from.
// In a real app, you'd fetch this from your backend API.
// The key should be in 'yyyy-MM-dd' format.




export function CalendarWithPricing(props) {

       const { price,selectedDate, onDateChange } = props;

  return (
    <div className="flex flex-col items-center mb-4">
   
      <DayPicker
        mode="single"
        selected={selectedDate}
        onSelect={onDateChange}
        hidden={{before: new Date()}} // Disable past dates
        fromDate={new Date()} // Disables past dates
      
        className="bg-gradient-to-br from-[#E0F7FA] to-white p-4 rounded-xl shadow-lg"
      />
         
      

      {/* Only show the price if it's a valid number */}
      {price > 0 && (
        <div className="flex items-center bottom-0 text-xl text-blue-700 font-bold mt-10">
       price: ₹{price.toFixed(2)}
        </div>
      )}

      
    </div>
  );
}