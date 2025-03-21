'use client';

import { useState, useEffect } from 'react';
import { FaCalculator, FaParking, FaShuttleVan, FaCreditCard, FaInfoCircle } from 'react-icons/fa';

type LocationOption = {
  id: string;
  name: string;
  baseRate: number;
  premiumMultiplier: number;
};

type VehicleType = {
  id: string;
  name: string;
  rateMultiplier: number;
};

type AdditionalService = {
  id: string;
  name: string;
  price: number;
  description: string;
};

const locations: LocationOption[] = [
  { id: 'downtown', name: 'Downtown Station', baseRate: 12, premiumMultiplier: 1.5 },
  { id: 'northside', name: 'Northside Transit Center', baseRate: 10, premiumMultiplier: 1.3 },
  { id: 'eastgate', name: 'Eastgate Park & Ride', baseRate: 8, premiumMultiplier: 1.2 },
  { id: 'westend', name: 'West End Terminal', baseRate: 15, premiumMultiplier: 1.8 },
  { id: 'southbay', name: 'Southbay Station', baseRate: 9, premiumMultiplier: 1.4 },
];

const vehicleTypes: VehicleType[] = [
  { id: 'compact', name: 'Compact Car', rateMultiplier: 1.0 },
  { id: 'midsize', name: 'Midsize Car', rateMultiplier: 1.1 },
  { id: 'suv', name: 'SUV / Crossover', rateMultiplier: 1.2 },
  { id: 'truck', name: 'Pickup Truck', rateMultiplier: 1.3 },
  { id: 'oversized', name: 'Oversized Vehicle', rateMultiplier: 1.5 },
];

const additionalServices: AdditionalService[] = [
  { 
    id: 'express', 
    name: 'Express Shuttle', 
    price: 5, 
    description: 'Priority boarding on shuttle services with direct routes' 
  },
  { 
    id: 'valet', 
    name: 'Valet Parking', 
    price: 10, 
    description: 'Drop off your vehicle and let our team park it for you' 
  },
  { 
    id: 'charging', 
    name: 'EV Charging', 
    price: 8, 
    description: 'Electric vehicle charging while you\'re away' 
  },
  { 
    id: 'wash', 
    name: 'Car Wash', 
    price: 15, 
    description: 'Your car will be washed and ready when you return' 
  },
  { 
    id: 'covered', 
    name: 'Covered Parking', 
    price: 7, 
    description: 'Park in our covered garage spaces' 
  },
];

const discountCodes = {
  'NEWUSER': 15,
  'WEEKEND': 10,
  'SUMMER23': 20,
};

export default function ReservationCalculator() {
  const [location, setLocation] = useState(locations[0]);
  const [vehicleType, setVehicleType] = useState(vehicleTypes[0]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');
  const [isPremiumTime, setIsPremiumTime] = useState(false);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [discountCode, setDiscountCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [isCalculatingPrice, setIsCalculatingPrice] = useState(false);
  const [calculatedPrice, setCalculatedPrice] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [breakdown, setBreakdown] = useState<{label: string, amount: number}[]>([]);
  
  // Set today as default start date and tomorrow as default end date
  useEffect(() => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    setStartDate(today.toISOString().split('T')[0]);
    setEndDate(tomorrow.toISOString().split('T')[0]);
    
    // Determine if current time is premium time (7-9 AM or 4-6 PM)
    const currentHour = today.getHours();
    setIsPremiumTime(
      (currentHour >= 7 && currentHour < 9) || 
      (currentHour >= 16 && currentHour < 18)
    );
  }, []);
  
  const handleLocationChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedLocation = locations.find(loc => loc.id === event.target.value);
    if (selectedLocation) {
      setLocation(selectedLocation);
    }
  };
  
  const handleVehicleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedVehicle = vehicleTypes.find(veh => veh.id === event.target.value);
    if (selectedVehicle) {
      setVehicleType(selectedVehicle);
    }
  };
  
  const toggleService = (serviceId: string) => {
    setSelectedServices(prev => {
      if (prev.includes(serviceId)) {
        return prev.filter(id => id !== serviceId);
      } else {
        return [...prev, serviceId];
      }
    });
  };
  
  const applyDiscountCode = () => {
    if (!discountCode.trim()) {
      setErrorMessage('Please enter a discount code');
      return;
    }
    
    const upperCaseCode = discountCode.toUpperCase();
    if (upperCaseCode in discountCodes) {
      setAppliedDiscount(discountCodes[upperCaseCode as keyof typeof discountCodes]);
      setErrorMessage('');
    } else {
      setAppliedDiscount(0);
      setErrorMessage('Invalid discount code');
    }
  };
  
  const calculateDurationHours = () => {
    if (!startDate || !endDate || !startTime || !endTime) {
      setErrorMessage('Please select dates and times');
      return 0;
    }
    
    const start = new Date(`${startDate}T${startTime}`);
    const end = new Date(`${endDate}T${endTime}`);
    
    if (end <= start) {
      setErrorMessage('End time must be after start time');
      return 0;
    }
    
    setErrorMessage('');
    const durationMs = end.getTime() - start.getTime();
    return durationMs / (1000 * 60 * 60); // Convert ms to hours
  };
  
  const calculatePrice = () => {
    setIsCalculatingPrice(true);
    
    setTimeout(() => {
      const hours = calculateDurationHours();
      
      if (hours <= 0) {
        setIsCalculatingPrice(false);
        return;
      }
      
      // Calculate base price = (base rate * vehicle multiplier * hours)
      let basePrice = location.baseRate * vehicleType.rateMultiplier * hours;
      
      // Apply premium time multiplier if applicable
      const premiumPrice = isPremiumTime ? (basePrice * location.premiumMultiplier) - basePrice : 0;
      
      // Calculate services price
      const servicesArray = selectedServices.map(serviceId => {
        const service = additionalServices.find(s => s.id === serviceId);
        return service ? service.price : 0;
      });
      const servicesPrice = servicesArray.reduce((total, price) => total + price, 0);
      
      // Calculate subtotal
      const subtotal = basePrice + premiumPrice + servicesPrice;
      
      // Apply discount if available
      const discountAmount = appliedDiscount > 0 ? (subtotal * (appliedDiscount / 100)) : 0;
      
      // Final price
      const finalPrice = subtotal - discountAmount;
      
      // Create breakdown
      const newBreakdown = [
        { label: 'Base Parking Fee', amount: parseFloat(basePrice.toFixed(2)) },
      ];
      
      if (premiumPrice > 0) {
        newBreakdown.push({ 
          label: 'Peak Hour Surcharge', 
          amount: parseFloat(premiumPrice.toFixed(2))
        });
      }
      
      if (servicesPrice > 0) {
        newBreakdown.push({ 
          label: 'Additional Services', 
          amount: parseFloat(servicesPrice.toFixed(2))
        });
      }
      
      if (discountAmount > 0) {
        newBreakdown.push({ 
          label: `Discount ({appliedDiscount}%)`, 
          amount: -parseFloat(discountAmount.toFixed(2))
        });
      }
      
      newBreakdown.push({ 
        label: 'Total', 
        amount: parseFloat(finalPrice.toFixed(2))
      });
      
      setBreakdown(newBreakdown);
      setCalculatedPrice(parseFloat(finalPrice.toFixed(2)));
      setShowBreakdown(true);
      setIsCalculatingPrice(false);
    }, 800);
  };
  
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="bg-gradient-to-r from-green-600 to-teal-600 px-6 py-4">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <FaCalculator className="mr-2" /> Reservation Cost Calculator
        </h3>
      </div>
      
      <div className="p-6">
        <p className="text-sm text-gray-500 mb-6">
          Calculate the estimated cost of your reservation based on location, vehicle type, duration, and optional services.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-4 flex items-center">
              <FaParking className="mr-2 text-green-600" /> Parking Details
            </h4>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                  Select Location
                </label>
                <select
                  id="location"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800"
                  value={location.id}
                  onChange={handleLocationChange}
                >
                  {locations.map((loc) => (
                    <option key={loc.id} value={loc.id} className="text-gray-800">
                      {loc.name} - Rs.{loc.baseRate}/hour
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="vehicle" className="block text-sm font-medium text-gray-700 mb-1">
                  Vehicle Type
                </label>
                <select
                  id="vehicle"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800"
                  value={vehicleType.id}
                  onChange={handleVehicleTypeChange}
                >
                  {vehicleTypes.map((veh) => (
                    <option key={veh.id} value={veh.id} className="text-gray-800">
                      {veh.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                    Arrival Date
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                
                <div>
                  <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-1">
                    Arrival Time
                  </label>
                  <select
                    id="startTime"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                  >
                    {[...Array(24)].map((_, hour) => (
                      <option key={hour} value={`${hour.toString().padStart(2, '0')}:00`} className="text-gray-800">
                        {hour === 0 ? '12:00 AM' : hour === 12 ? '12:00 PM' : hour < 12 ? `${hour}:00 AM` : `${hour - 12}:00 PM`}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                    Departure Date
                  </label>
                  <input
                    type="date"
                    id="endDate"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    min={startDate || new Date().toISOString().split('T')[0]}
                  />
                </div>
                
                <div>
                  <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-1">
                    Departure Time
                  </label>
                  <select
                    id="endTime"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                  >
                    {[...Array(24)].map((_, hour) => (
                      <option key={hour} value={`Rs.{hour.toString().padStart(2, '0')}:00`} className="text-gray-800">
                        {hour === 0 ? '12:00 AM' : hour === 12 ? '12:00 PM' : hour < 12 ? `${hour}:00 AM` : `${hour - 12}:00 PM`}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="flex items-center">
                <input
                  id="premiumTime"
                  type="checkbox"
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  checked={isPremiumTime}
                  onChange={(e) => setIsPremiumTime(e.target.checked)}
                />
                <label htmlFor="premiumTime" className="ml-2 block text-sm text-gray-700">
                  Peak Hours (7-9 AM, 4-6 PM)
                </label>
                <div className="ml-2 text-gray-500 hover:text-gray-700">
                  <FaInfoCircle className="h-4 w-4" title="Higher rates apply during peak hours" />
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-4 flex items-center">
              <FaShuttleVan className="mr-2 text-green-600" /> Additional Services
            </h4>
            
            <div className="space-y-3 mb-4">
              {additionalServices.map((service) => (
                <div key={service.id} className="flex items-start">
                  <input
                    id={`service-${service.id}`}
                    type="checkbox"
                    className="h-4 w-4 mt-1 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    checked={selectedServices.includes(service.id)}
                    onChange={() => toggleService(service.id)}
                  />
                  <label htmlFor={`service-${service.id}`} className="ml-2 block text-sm">
                    <div className="font-medium text-gray-700">{service.name} (+Rs.{service.price})</div>
                    <div className="text-gray-500">{service.description}</div>
                  </label>
                </div>
              ))}
            </div>
            
            <h4 className="text-sm font-medium text-gray-900 mb-4 flex items-center">
              <FaCreditCard className="mr-2 text-green-600" /> Discount
            </h4>
            
            <div className="flex space-x-2 mb-1">
              <input
                type="text"
                placeholder="Enter discount code"
                className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800"
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value.trim())}
              />
              <button 
                className="px-4 py-2 bg-green-100 text-green-700 rounded-md hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                onClick={applyDiscountCode}
              >
                Apply
              </button>
            </div>
            
            {appliedDiscount > 0 && (
              <div className="text-sm text-green-600 mb-4">
                {appliedDiscount}% discount applied!
              </div>
            )}
            
            {errorMessage && (
              <div className="text-sm text-red-600 mb-4">
                {errorMessage}
              </div>
            )}
            
            <div className="mt-4">
              <button 
                className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 flex items-center justify-center"
                onClick={calculatePrice}
                disabled={isCalculatingPrice}
              >
                {isCalculatingPrice ? (
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <FaCalculator className="mr-2" />
                )}
                <span>{isCalculatingPrice ? 'Calculating...' : 'Calculate Total'}</span>
              </button>
            </div>
          </div>
        </div>
        
        {calculatedPrice !== null && showBreakdown && (
          <div className="mt-8">
            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 text-black">Price Breakdown</h4>
              
              <div className="space-y-3 text-black">
                {breakdown.map((item, index) => (
                  <div 
                    key={index} 
                    className={`flex justify-between ${
                      item.label === 'Total' ? 'pt-3 border-t border-gray-200 font-semibold' : ''
                    }`}
                  >
                    <span>{item.label}</span>
                    <span className={item.amount < 0 ? 'text-green-600' : ''}>
                      {item.amount < 0 ? '-' : ''}Rs.{Math.abs(item.amount).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 text-center">
                <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                  Book Now
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 