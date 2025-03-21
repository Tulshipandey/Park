'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaParking, FaUser, FaCar } from 'react-icons/fa';
import { useAuth } from '../lib/AuthContext';

const locations = [
  { id: 'loc1', name: 'Downtown Central', available: 23, price: 15 },
  { id: 'loc2', name: 'North Station', available: 17, price: 12 },
  { id: 'loc3', name: 'West End Hub', available: 8, price: 18 },
  { id: 'loc4', name: 'Airport Terminal', available: 42, price: 25 },
  { id: 'loc5', name: 'South Bay Plaza', available: 15, price: 14 },
];

const BookingPage = () => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [vehicleType, setVehicleType] = useState('standard');

  // Get tomorrow's date as default
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDate = tomorrow.toISOString().split('T')[0];

  // Enforce authentication check
  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);
  
  // Return loading state if authentication is being checked
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  // Prevent rendering if user is not authenticated
  if (!user) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would handle the booking submission
    alert('Booking submitted! In a real app, this would save to the database.');
  };

  return (
    <div className="bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">Book Your Parking Spot</h1>
          <p className="max-w-2xl mx-auto text-lg text-gray-600">
            Reserve your parking space in advance and enjoy stress-free commuting with our Park & Ride service.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-blue-600 py-6 px-8">
            <h2 className="text-xl font-semibold text-white flex items-center">
              <FaParking className="mr-2" /> Book a Parking Spot
            </h2>
          </div>
          
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Location Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <FaMapMarkerAlt className="mr-2 text-blue-600" /> Select Location
                </label>
                <select
                  className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black "
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                >
                  <option value="">Select a location</option>
                  {locations.map((loc) => (
                    <option key={loc.id} value={loc.id}>
                      {loc.name} ({loc.available} spots) - ${loc.price}/day
                    </option>
                  ))}
                </select>
              </div>

              {/* Date Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <FaCalendarAlt className="mr-2 text-blue-600" /> Date
                </label>
                <input
                  type="date"
                  className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
                  min={defaultDate}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>

              {/* Start Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <FaClock className="mr-2 text-blue-600" /> Start Time
                </label>
                <input
                  type="time"
                  className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  required
                />
              </div>

              {/* End Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <FaClock className="mr-2 text-blue-600" /> End Time
                </label>
                <input
                  type="time"
                  className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  required
                />
              </div>

              {/* Vehicle Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <FaCar className="mr-2 text-blue-600" /> Vehicle Type
                </label>
                <select
                  className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
                  value={vehicleType}
                  onChange={(e) => setVehicleType(e.target.value)}
                >
                  <option value="standard">Standard Car</option>
                  <option value="compact">Compact Car</option>
                  <option value="suv">SUV / Crossover</option>
                  <option value="van">Van / Minivan</option>
                  <option value="electric">Electric Vehicle (includes charging)</option>
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                className="inline-flex justify-center py-3 px-6 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 text-black"
              >
                Book Now
              </button>
            </div>
          </form>
        </div>

        {/* Additional Information */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-blue-600 mb-4">
              <FaParking className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-black">Guaranteed Parking</h3>
            <p className="text-gray-600">
              Once you book, your spot is reserved. No more driving around looking for parking.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-blue-600 mb-4">
              <FaUser className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-black">Free Shuttle Service</h3>
            <p className="text-gray-600">
              All parking locations include complimentary shuttle service to key destinations.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-blue-600 mb-4">
              <FaCalendarAlt className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-black">Flexible Scheduling</h3>
            <p className="text-gray-600">
              Changes to your reservation can be made up to 2 hours before your booking time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage; 