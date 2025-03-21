'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaMapMarkedAlt, FaLocationArrow, FaShuttleVan, FaRegClock } from 'react-icons/fa';
import { useAuth } from '../lib/AuthContext';

const shuttleData = [
  { id: 1, name: 'Shuttle A', location: 'Downtown Station', heading: 'North Terminal', nextStop: '5 min', capacity: '70%' },
  { id: 2, name: 'Shuttle B', location: 'Airport Terminal', heading: 'South Plaza', nextStop: '3 min', capacity: '85%' },
  { id: 3, name: 'Shuttle C', location: 'North Station', heading: 'Downtown', nextStop: '10 min', capacity: '45%' },
  { id: 4, name: 'Shuttle D', location: 'West Hub', heading: 'East Plaza', nextStop: '7 min', capacity: '60%' },
];

const TrackingPage = () => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [selectedShuttle, setSelectedShuttle] = useState<number | null>(null);

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

  return (
    <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 bg-gray-50 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">Track Your Shuttle</h1>
        <p className="max-w-2xl mx-auto text-lg text-gray-600">
          Monitor shuttle locations in real-time and plan your journey accordingly.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Shuttle List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="bg-blue-600 px-6 py-4">
              <h2 className="text-lg font-semibold text-white flex items-center">
                <FaShuttleVan className="mr-2" /> Active Shuttles
              </h2>
            </div>
            
            <div className="p-4 text-black">
              <div className="space-y-4 text-black">
                {shuttleData.map(shuttle => (
                  <div 
                    key={shuttle.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedShuttle === shuttle.id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-blue-200 hover:bg-blue-50'
                    }`}
                    onClick={() => setSelectedShuttle(shuttle.id)}
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold text-lg">{shuttle.name}</h3>
                      <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        Capacity: {shuttle.capacity}
                      </span>
                    </div>
                    
                    <div className="mt-2 space-y-1 text-sm text-gray-600">
                      <div className="flex items-center">
                        <FaLocationArrow className="text-blue-500 mr-2" />
                        <span>Current: {shuttle.location}</span>
                      </div>
                      <div className="flex items-center">
                        <FaMapMarkedAlt className="text-blue-500 mr-2" />
                        <span>Heading to: {shuttle.heading}</span>
                      </div>
                      <div className="flex items-center">
                        <FaRegClock className="text-blue-500 mr-2" />
                        <span>Next stop in: {shuttle.nextStop}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Map Placeholder */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-md overflow-hidden h-full">
            <div className="bg-blue-600 px-6 py-4">
              <h2 className="text-lg font-semibold text-white flex items-center">
                <FaMapMarkedAlt className="mr-2" /> Live Tracking Map
              </h2>
            </div>
            
            <div className="p-6 h-[500px] flex items-center justify-center bg-gray-100">
              {selectedShuttle ? (
                <div className="text-center">
                  <div className="w-24 h-24 bg-blue-600 rounded-full mx-auto flex items-center justify-center mb-4">
                    <FaShuttleVan className="text-white text-4xl" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    {shuttleData.find(s => s.id === selectedShuttle)?.name}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Live tracking is available in the mobile app for a better experience.
                  </p>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                    Download Mobile App
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-gray-600 mb-2">Select a shuttle to view its live location.</p>
                  <FaMapMarkedAlt className="text-gray-400 text-6xl mx-auto" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackingPage; 