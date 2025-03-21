'use client';

import { FaParking, FaMapMarkedAlt, FaRegClock } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Link from 'next/link';

const Hero = () => {
  return (
    <div className="relative bg-gradient-to-r from-blue-600 to-indigo-800 py-20 lg:py-32">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10 bg-pattern"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center">
          <div className="w-full lg:w-1/2 mb-12 lg:mb-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Park. Ride. <span className="text-yellow-300">Arrive Relaxed.</span>
              </h1>
              <p className="text-xl text-blue-100 mb-8 max-w-lg">
                Seamless parking and transportation solution for your daily commute or travel needs.
                Book, pay, and track in one place.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link href="/auth/login" className="inline-block bg-white text-blue-700 font-semibold px-6 py-3 rounded-md shadow-lg hover:bg-yellow-300 hover:text-blue-800 transition duration-300 text-center">
                  Book Now
                </Link>
                <Link href="/pricing" className="inline-block bg-transparent text-white border-2 border-white font-semibold px-6 py-3 rounded-md hover:bg-white hover:text-blue-700 transition duration-300 text-center">
                  View Pricing
                </Link>
              </div>
            </motion.div>
          </div>
          
          <div className="w-full lg:w-1/2 lg:pl-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-xl shadow-xl overflow-hidden"
            >
              <div className="p-8">
                <h3 className="text-2xl font-semibold text-gray-800 mb-6">Why Choose Park&Ride?</h3>
                <ul className="space-y-6">
                  <li className="flex items-start">
                    <div className="flex-shrink-0 bg-blue-100 p-3 rounded-lg">
                      <FaParking className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <h4 className="text-lg font-medium text-gray-800">Guaranteed Parking</h4>
                      <p className="text-gray-600">Reserve your spot in advance and never worry about finding parking again.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 bg-blue-100 p-3 rounded-lg">
                      <FaMapMarkedAlt className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <h4 className="text-lg font-medium text-gray-800">Real-Time Tracking</h4>
                      <p className="text-gray-600">Know exactly when your shuttle arrives with our live tracking system.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 bg-blue-100 p-3 rounded-lg">
                      <FaRegClock className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <h4 className="text-lg font-medium text-gray-800">Time-Saving</h4>
                      <p className="text-gray-600">Skip the hassle of city parking and reduce your commute time.</p>
                    </div>
                  </li>
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero; 