'use client';

import React, { useState, useEffect } from 'react';
import { FaClock, FaExclamationTriangle, FaRegChartBar, FaInfoCircle } from 'react-icons/fa';

type HourlyRate = {
  hour: number;
  rate: number;
  demand: 'low' | 'medium' | 'high';
};

type DaySchedule = {
  day: string;
  rates: HourlyRate[];
};

// Sample weekday hourly rates with demand levels
const weekdayRates: HourlyRate[] = [
  { hour: 6, rate: 2.50, demand: 'medium' },
  { hour: 7, rate: 3.50, demand: 'high' },
  { hour: 8, rate: 4.00, demand: 'high' },
  { hour: 9, rate: 3.50, demand: 'high' },
  { hour: 10, rate: 2.50, demand: 'medium' },
  { hour: 11, rate: 2.00, demand: 'low' },
  { hour: 12, rate: 2.00, demand: 'low' },
  { hour: 13, rate: 2.00, demand: 'low' },
  { hour: 14, rate: 2.00, demand: 'low' },
  { hour: 15, rate: 2.50, demand: 'medium' },
  { hour: 16, rate: 3.50, demand: 'high' },
  { hour: 17, rate: 4.00, demand: 'high' },
  { hour: 18, rate: 3.50, demand: 'high' },
  { hour: 19, rate: 2.50, demand: 'medium' },
  { hour: 20, rate: 2.00, demand: 'low' },
  { hour: 21, rate: 1.50, demand: 'low' },
  { hour: 22, rate: 1.50, demand: 'low' },
];

// Sample weekend hourly rates with demand levels
const weekendRates: HourlyRate[] = [
  { hour: 8, rate: 2.00, demand: 'low' },
  { hour: 9, rate: 2.50, demand: 'medium' },
  { hour: 10, rate: 3.00, demand: 'medium' },
  { hour: 11, rate: 3.50, demand: 'high' },
  { hour: 12, rate: 3.50, demand: 'high' },
  { hour: 13, rate: 3.50, demand: 'high' },
  { hour: 14, rate: 3.00, demand: 'medium' },
  { hour: 15, rate: 2.50, demand: 'medium' },
  { hour: 16, rate: 2.50, demand: 'medium' },
  { hour: 17, rate: 2.50, demand: 'medium' },
  { hour: 18, rate: 2.00, demand: 'low' },
  { hour: 19, rate: 2.00, demand: 'low' },
  { hour: 20, rate: 1.50, demand: 'low' },
];

const scheduleData: DaySchedule[] = [
  { day: 'Monday', rates: weekdayRates },
  { day: 'Tuesday', rates: weekdayRates },
  { day: 'Wednesday', rates: weekdayRates },
  { day: 'Thursday', rates: weekdayRates },
  { day: 'Friday', rates: weekdayRates },
  { day: 'Saturday', rates: weekendRates },
  { day: 'Sunday', rates: weekendRates },
];

export default function DynamicPricing() {
  const [selectedDay, setSelectedDay] = useState<DaySchedule>(scheduleData[0]);
  const [selectedHour, setSelectedHour] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [showSurgeAlert, setShowSurgeAlert] = useState(false);
  
  const formatHour = (hour: number) => {
    if (hour === 0) return '12 AM';
    if (hour === 12) return '12 PM';
    return hour < 12 ? `${hour} AM` : `${hour - 12} PM`;
  };

  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`;
  };

  const getDemandColor = (demand: string) => {
    switch (demand) {
      case 'low':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCurrentDayAndHour = () => {
    const now = new Date();
    const currentDay = now.getDay();
    const currentHour = now.getHours();
    
    // Map JS day (0=Sunday, 6=Saturday) to our schedule array (0=Monday, 6=Sunday)
    const mappedDay = currentDay === 0 ? 6 : currentDay - 1;
    
    setSelectedDay(scheduleData[mappedDay]);
    setSelectedHour(currentHour);
    
    // Check if current time is during surge hours
    const currentDayRates = scheduleData[mappedDay].rates;
    const currentRate = currentDayRates.find(rate => rate.hour === currentHour);
    
    if (currentRate && currentRate.demand === 'high') {
      setShowSurgeAlert(true);
    }
    
    // Format current time
    setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  };

  // Initialize with current day and time
  useEffect(() => {
    getCurrentDayAndHour();
    
    // Update every minute
    const interval = setInterval(() => {
      getCurrentDayAndHour();
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <FaRegChartBar className="mr-2" /> Dynamic Pricing Model
        </h3>
      </div>
      
      <div className="p-6">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500">
              Our pricing varies based on demand and time of day to provide you with the best rates.
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">Current Time</div>
            <div className="text-lg font-semibold">{currentTime}</div>
          </div>
        </div>
        
        {showSurgeAlert && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <div className="flex items-center">
              <FaExclamationTriangle className="text-red-500 mr-2" />
              <div>
                <p className="text-sm text-red-700 font-semibold">Surge Pricing Alert</p>
                <p className="text-xs text-red-600">High demand currently in effect. Prices may be higher than usual.</p>
              </div>
            </div>
          </div>
        )}
        
        <div className="mb-6">
          <div className="flex space-x-2 mb-4 overflow-x-auto pb-2">
            {scheduleData.map((day) => (
              <button
                key={day.day}
                onClick={() => setSelectedDay(day)}
                className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${
                  selectedDay.day === day.day
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {day.day}
              </button>
            ))}
          </div>
          
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full">
              <div className="grid grid-cols-12 gap-2 min-w-max">
                <div className="col-span-2 font-medium text-gray-700 p-2">Time</div>
                <div className="col-span-2 font-medium text-gray-700 p-2">Rate per Hour</div>
                <div className="col-span-2 font-medium text-gray-700 p-2">Demand Level</div>
                <div className="col-span-6 font-medium text-gray-700 p-2">Price Graph</div>
                
                {selectedDay.rates.map((rate) => (
                  <React.Fragment key={rate.hour}>
                    <div 
                      className={`col-span-2 p-2 text-black ${selectedHour === rate.hour ? 'bg-blue-50 rounded' : ''}`}
                    >
                      {formatHour(rate.hour)}
                    </div>
                    <div 
                      className={`col-span-2 p-2 font-medium text-black ${selectedHour === rate.hour ? 'bg-blue-50 rounded' : ''}`}
                    >
                      {formatPrice(rate.rate)}
                    </div>
                    <div 
                      className={`col-span-2  p-2 text-black ${selectedHour === rate.hour ? 'bg-blue-50 rounded' : ''}`}
                    >
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDemandColor(rate.demand)}`}>
                        {rate.demand.charAt(0).toUpperCase() + rate.demand.slice(1)}
                      </span>
                    </div>
                    <div 
                      className={`col-span-6 text-sm p-2 ${selectedHour === rate.hour ? 'bg-blue-50 rounded' : ''}`}
                    >
                      <div className="w-full bg-gray-200 rounded-full h-4">
                        <div 
                          className={`h-4 rounded-full ${
                            rate.demand === 'low' 
                              ? 'bg-green-500' 
                              : rate.demand === 'medium'
                                ? 'bg-yellow-500'
                                : 'bg-red-500'
                          }`}
                          style={{ width: `${(rate.rate / 4) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
            <FaInfoCircle className="mr-2 text-blue-500" /> Understanding Our Dynamic Pricing
          </h4>
          <ul className="text-sm text-gray-600 space-y-2">
            <li className="flex items-start">
              <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2 mt-1"></span>
              <span><strong>Low Demand (Green):</strong> Best time to book for optimal pricing.</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-3 h-3 bg-yellow-500 rounded-full mr-2 mt-1"></span>
              <span><strong>Medium Demand (Yellow):</strong> Standard rates apply.</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-3 h-3 bg-red-500 rounded-full mr-2 mt-1"></span>
              <span><strong>High Demand (Red):</strong> Surge pricing in effect due to increased demand.</span>
            </li>
          </ul>
          <p className="mt-2 text-xs text-gray-500">
            * Rates may vary based on location, special events, and holidays. Rates are subject to change without notice.
          </p>
        </div>
        
        <div className="mt-6 text-center">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Book at Current Rates
          </button>
        </div>
      </div>
    </div>
  );
} 