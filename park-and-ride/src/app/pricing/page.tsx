'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaParking, FaCheck, FaClock, FaRegCalendarAlt, FaMapMarkedAlt, FaShieldAlt } from 'react-icons/fa';
import { useAuth } from '../lib/AuthContext';
import DynamicPricing from './components/DynamicPricing';
import AvailabilityChecker from './components/AvailabilityChecker';
import ReservationCalculator from './components/ReservationCalculator';

const PricingPage = () => {
  const [billingCycle, setBillingCycle] = useState('monthly');
  const { user, loading } = useAuth();
  const router = useRouter();

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

  // Features for each plan
  const standardFeatures = [
    'Access to all parking locations',
    'Basic shuttle service',
    'Mobile app access',
    'Email customer support',
  ];

  const premiumFeatures = [
    ...standardFeatures,
    'Reserved parking spots',
    'Priority shuttle boarding',
    'Real-time tracking',
    'Phone customer support',
  ];

  const businessFeatures = [
    ...premiumFeatures,
    'Multiple vehicle registration',
    'Dedicated parking spaces',
    'Express shuttle service',
    '24/7 priority support',
    'Company account management',
  ];

  return (
    <div className="bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">Simple, Transparent Pricing</h1>
          <p className="max-w-2xl mx-auto text-lg text-gray-600">
            Choose the plan that works best for your commuting needs. All plans include access to our Park & Ride services.
          </p>
          
          <div className="flex justify-center mt-8">
            <div className="relative bg-gray-100 rounded-full p-1 flex z-0 shadow-sm inline-flex">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`relative rounded-full py-2 px-4 text-sm font-medium transition-colors focus:outline-none ${
                  billingCycle === 'monthly' 
                    ? 'text-white bg-blue-600' 
                    : 'text-gray-800 hover:bg-gray-200'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('annually')}
                className={`relative rounded-full py-2 px-4 text-sm font-medium transition-colors focus:outline-none ${
                  billingCycle === 'annually' 
                    ? 'text-white bg-blue-600' 
                    : 'text-gray-800 hover:bg-gray-200'
                }`}
              >
                Annually <span className="text-xs text-green-600 font-bold ml-1">Save 20%</span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Standard Plan */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 transition-transform hover:scale-105">
            <div className="p-8">
              <div className="flex items-center">
                <FaParking className="h-8 w-8 text-blue-500" />
                <h2 className="ml-3 text-2xl font-bold text-gray-900">Standard</h2>
              </div>
              
              <div className="mt-4 flex items-baseline">
                <span className="text-5xl font-extrabold text-gray-900">
                  Rs.{billingCycle === 'monthly' ? '4900' : '3900'}
                </span>
                <span className="ml-1 text-xl text-gray-500">/month</span>
              </div>
              
              {billingCycle === 'annually' && (
                <p className="mt-1 text-sm text-green-600">
                  Rs.{4900 * 12 - 3900 * 12} saved annually
                </p>
              )}
              
              <p className="mt-6 text-gray-500">
                Perfect for occasional commuters who need reliable parking.
              </p>
            </div>
            
            <div className="px-8 pt-2 pb-8">
              <ul className="space-y-3">
                {standardFeatures.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <FaCheck className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="ml-3 text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <div className="mt-8">
                <Link 
                  href="/auth/login" 
                  className="block w-full text-center bg-white border-2 border-blue-600 text-blue-600 py-3 rounded-md font-medium hover:bg-blue-50 transition duration-300"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
          
          {/* Premium Plan */}
          <div className="bg-white rounded-xl shadow-xl overflow-hidden border-2 border-blue-500 transform scale-105 z-10">
            <div className="absolute inset-x-0 top-0 transform translate-y-px">
              <div className="flex justify-center transform -translate-y-1/2">
                <span className="inline-flex rounded-full bg-blue-600 px-4 py-1 text-sm font-semibold tracking-wider uppercase text-white">
                  Most Popular
                </span>
              </div>
            </div>
            
            <div className="p-8 pt-12">
              <div className="flex items-center">
                <FaParking className="h-8 w-8 text-blue-600" />
                <h2 className="ml-3 text-2xl font-bold text-gray-900">Premium</h2>
              </div>
              
              <div className="mt-4 flex items-baseline">
                <span className="text-5xl font-extrabold text-gray-900">
                  Rs.{billingCycle === 'monthly' ? '7900' : '6300'}
                </span>
                <span className="ml-1 text-xl text-gray-500">/month</span>
              </div>
              
              {billingCycle === 'annually' && (
                <p className="mt-1 text-sm text-green-600">
                  Rs.{7900 * 12 - 6300 * 12} saved annually
                </p>
              )}
              
              <p className="mt-6 text-gray-500">
                For daily commuters who want premium parking and priority services.
              </p>
            </div>
            
            <div className="px-8 pt-2 pb-8">
              <ul className="space-y-3">
                {premiumFeatures.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <FaCheck className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="ml-3 text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <div className="mt-8">
                <Link 
                  href="/auth/login" 
                  className="block w-full text-center bg-blue-600 text-white py-3 rounded-md font-medium hover:bg-blue-700 transition duration-300"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
          
          {/* Business Plan */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 transition-transform hover:scale-105">
            <div className="p-8">
              <div className="flex items-center">
                <FaParking className="h-8 w-8 text-blue-500" />
                <h2 className="ml-3 text-2xl font-bold text-gray-900">Business</h2>
              </div>
              
              <div className="mt-4 flex items-baseline">
                <span className="text-5xl font-extrabold text-gray-900">
                  Rs.{billingCycle === 'monthly' ? '14900' : '11900'}
                </span>
                <span className="ml-1 text-xl text-gray-500">/month</span>
              </div>
              
              {billingCycle === 'annually' && (
                <p className="mt-1 text-sm text-green-600">
                  Rs.{14900 * 12 - 11900 * 12} saved annually
                </p>
              )}
              
              <p className="mt-6 text-gray-500">
                Designed for businesses with multiple employees commuting regularly.
              </p>
            </div>
            
            <div className="px-8 pt-2 pb-8">
              <ul className="space-y-3">
                {businessFeatures.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <FaCheck className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="ml-3 text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <div className="mt-8">
                <Link 
                  href="/auth/login" 
                  className="block w-full text-center bg-white border-2 border-blue-600 text-blue-600 py-3 rounded-md font-medium hover:bg-blue-50 transition duration-300"
                >
                  Contact Sales
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        {/* Pay-as-you-go Section */}
        <div className="mt-16 bg-white rounded-xl shadow-md overflow-hidden">
          <div className="px-8 py-12 max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold text-gray-900">Pay as You Go</h2>
              <p className="mt-2 text-gray-600">
                Don\'t need a subscription? Use our pay-as-you-go pricing for occasional visits.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="p-6 border rounded-lg text-center text-black">
                <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-blue-100 mb-4">
                  <FaClock className="text-blue-600 h-6 w-6" />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-black">Hourly</h3>
                <p className="text-3xl font-bold text-gray-900">Rs.15<span className="text-sm text-gray-600">/hour</span></p>
                <p className="mt-2 text-gray-600 text-sm">Perfect for quick visits</p>
              </div>
              
              <div className="p-6 border rounded-lg text-center text-black">
                <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-blue-100 mb-4">
                  <FaRegCalendarAlt className="text-blue-600 h-6 w-6" />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-black">Daily</h3>
                <p className="text-3xl font-bold text-gray-900">Rs.60<span className="text-sm text-gray-600">/day</span></p>
                <p className="mt-2 text-gray-600 text-sm">For all-day parking</p>
              </div>
              
              <div className="p-6 border rounded-lg text-center text-black">
                <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-blue-100 mb-4">
                  <FaMapMarkedAlt className="text-blue-600 h-6 w-6" />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-black">Weekend</h3>
                <p className="text-3xl font-bold text-gray-900">Rs.100<span className="text-sm text-gray-600">/weekend</span></p>
                <p className="mt-2 text-gray-600 text-sm">Friday evening to Sunday</p>
              </div>
              
              <div className="p-6 border rounded-lg text-center text-black">
                <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-blue-100 mb-4">
                  <FaShieldAlt className="text-blue-600 h-6 w-6" />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-black">Weekly</h3>
                <p className="text-3xl font-bold text-gray-900">Rs.200<span className="text-sm text-gray-600">/week</span></p>
                <p className="mt-2 text-gray-600 text-sm">7 consecutive days</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Dynamic Pricing Model */}
        <div className="mt-16">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900">Dynamic Pricing Model</h2>
            <p className="mt-2 text-gray-600 max-w-2xl mx-auto">
              Our hourly rates vary throughout the day based on demand. Check the current rates to find the best time to park.
            </p>
          </div>
          <DynamicPricing />
        </div>
        
        {/* Availability Checker */}
        <div className="mt-16">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900">Check Real-Time Availability</h2>
            <p className="mt-2 text-gray-600 max-w-2xl mx-auto">
              Find and reserve available parking spaces at your preferred location and time.
            </p>
          </div>
          <AvailabilityChecker />
        </div>
        
        {/* Reservation Calculator */}
        <div className="mt-16">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900">Calculate Your Parking Cost</h2>
            <p className="mt-2 text-gray-600 max-w-2xl mx-auto">
              Estimate the cost of your parking reservation based on your specific needs and preferences.
            </p>
          </div>
          <ReservationCalculator />
        </div>
        
        {/* FAQ */}
        <div className="mt-16">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900">Frequently Asked Questions</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold text-lg mb-2 text-black">Can I cancel my subscription at any time?</h3>
              <p className="text-gray-600">
                Yes, you can cancel your subscription at any time. If you cancel, your subscription will remain active until the end of the current billing period.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold text-lg mb-2 text-black">Are there any parking locations with premium rates?</h3>
              <p className="text-gray-600">
                Yes, certain high-demand locations like airport terminals and downtown centers may have premium rates. These will be clearly indicated when booking.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold text-lg mb-2 text-black">What happens if I stay longer than planned?</h3>
              <p className="text-gray-600">
                If you stay longer than your booked time, you\'ll be charged the hourly rate for any additional time. You can also extend your booking through the app.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold text-lg mb-2 text-black">Can I share my subscription with family members?</h3>
              <p className="text-gray-600">
                Standard and Premium plans are for individual use. Business plans can support multiple users under the same account.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold text-lg mb-2 text-black">How does dynamic pricing work?</h3>
              <p className="text-gray-600">
                Our dynamic pricing model adjusts hourly rates based on real-time demand. During peak hours (typically morning and evening rush), rates may be higher. You can save by booking during off-peak hours, which are clearly marked in green in our pricing chart.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold text-lg mb-2 text-black ">Can I lock in a rate before arriving?</h3>
              <p className="text-gray-600">
                Yes, booking through our app or website allows you to lock in the current rate, even if prices increase due to surge demand before your arrival. Pre-booking is always recommended.
              </p>
            </div>
          </div>
        </div>
        
        {/* CTA */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to get started?</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Choose a plan that works for you and transform your daily commute with Park & Ride.
          </p>
          <Link 
            href="/auth/login" 
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-md font-medium hover:bg-blue-700 transition duration-300"
          >
            Sign Up Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PricingPage; 