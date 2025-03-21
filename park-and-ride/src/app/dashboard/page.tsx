'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../lib/AuthContext';
import { FaCalendarAlt, FaTicketAlt, FaHistory, FaMapMarkedAlt, FaCar, FaCreditCard, FaSignOutAlt } from 'react-icons/fa';
import ProfileManager from './components/ProfileManager';
import LoyaltyCard from './components/LoyaltyCard';
import SupportCenter from './components/SupportCenter';

const Dashboard = () => {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const [activeParkings, setActiveParkings] = useState(1);
  const [upcomingBookings, setUpcomingBookings] = useState(2);
  const [activeTab, setActiveTab] = useState<'overview' | 'profile' | 'loyalty' | 'support'>('overview');
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in the useEffect
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileManager />;
      case 'loyalty':
        return <LoyaltyCard />;
      case 'support':
        return <SupportCenter />;
      case 'overview':
      default:
        return (
          <>
            <div className="mb-12 bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Welcome, {user.email?.split('@')[0]}</h2>
              <p className="text-gray-600">
                Manage your parking spots, bookings, and shuttle tracking from your personal dashboard.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <div className={`bg-white rounded-xl shadow-md p-6 border-l-4 ${activeParkings > 0 ? 'border-green-500' : 'border-gray-300'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Active Parkings</p>
                    <p className="text-2xl font-bold text-gray-800">{activeParkings}</p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <FaCar className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </div>
              
              <div className={`bg-white rounded-xl shadow-md p-6 border-l-4 ${upcomingBookings > 0 ? 'border-blue-500' : 'border-gray-300'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Upcoming Bookings</p>
                    <p className="text-2xl font-bold text-gray-800">{upcomingBookings}</p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <FaCalendarAlt className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-gray-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Shuttle Status</p>
                    <p className="text-lg font-bold text-gray-800">On Schedule</p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <FaMapMarkedAlt className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="bg-blue-600 px-6 py-4">
                  <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
                </div>
                <div className="p-6">
                  <ul className="divide-y divide-gray-200">
                    <li className="py-4 flex">
                      <div className="bg-blue-100 p-2 rounded-lg mr-4">
                        <FaTicketAlt className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Parking Booked</p>
                        <p className="text-sm text-gray-500">Central Station - Slot A12</p>
                        <p className="text-xs text-gray-400">March 15, 2023 - 10:30 AM</p>
                      </div>
                    </li>
                    <li className="py-4 flex">
                      <div className="bg-blue-100 p-2 rounded-lg mr-4">
                        <FaCreditCard className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Payment Processed</p>
                        <p className="text-sm text-gray-500">$15.00 - Daily Parking</p>
                        <p className="text-xs text-gray-400">March 14, 2023 - 9:15 AM</p>
                      </div>
                    </li>
                    <li className="py-4 flex">
                      <div className="bg-blue-100 p-2 rounded-lg mr-4">
                        <FaHistory className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Trip Completed</p>
                        <p className="text-sm text-gray-500">Downtown to West End</p>
                        <p className="text-xs text-gray-400">March 12, 2023 - 5:45 PM</p>
                      </div>
                    </li>
                  </ul>
                  <div className="mt-4">
                    <a href="/dashboard/history" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                      View all activity →
                    </a>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="bg-blue-600 px-6 py-4">
                  <h3 className="text-lg font-semibold text-white">Upcoming Bookings</h3>
                </div>
                <div className="p-6">
                  <ul className="divide-y divide-gray-200">
                    <li className="py-4">
                      <div className="flex justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">Central Station - Slot B5</p>
                          <p className="text-xs text-gray-500">March 22, 2023 • 8:00 AM - 6:00 PM</p>
                        </div>
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Confirmed
                        </span>
                      </div>
                    </li>
                    <li className="py-4">
                      <div className="flex justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">North Parking - Slot D12</p>
                          <p className="text-xs text-gray-500">March 25, 2023 • 9:30 AM - 7:30 PM</p>
                        </div>
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          Pending
                        </span>
                      </div>
                    </li>
                  </ul>
                  <div className="mt-4">
                    <a href="/booking" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      Book new parking spot →
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <div className="bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          
          <div className="flex items-center space-x-4">
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  activeTab === 'overview'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('profile')}
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  activeTab === 'profile'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Profile
              </button>
              <button
                onClick={() => setActiveTab('loyalty')}
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  activeTab === 'loyalty'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Loyalty
              </button>
              <button
                onClick={() => setActiveTab('support')}
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  activeTab === 'support'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Support
              </button>
            </div>
            
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="flex items-center px-4 py-2 text-sm font-medium rounded-md bg-red-500 text-white hover:bg-red-600 transition-colors"
            >
              {isLoggingOut ? 'Logging out...' : (
                <>
                  <FaSignOutAlt className="mr-2" />
                  Logout
                </>
              )}
            </button>
          </div>
        </div>
        
        {renderTabContent()}
      </div>
    </div>
  );
};

export default Dashboard; 