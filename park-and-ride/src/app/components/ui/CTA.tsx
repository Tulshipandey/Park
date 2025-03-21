'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { FaArrowRight } from 'react-icons/fa';

const CTA = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-8 md:mb-0 md:w-2/3"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready for a stress-free commute?
            </h2>
            <p className="text-blue-100 text-xl max-w-2xl">
              Download our app now and transform your daily travel experience with Park & Ride. Book parking, track shuttles, and enjoy a seamless journey.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4"
          >
            <Link href="/auth/login" className="inline-flex items-center justify-center bg-white text-blue-700 px-6 py-3 rounded-md shadow-lg hover:bg-yellow-300 transition duration-300 font-medium">
              Book Now
              <FaArrowRight className="ml-2" />
            </Link>
            <Link href="/auth/login" className="inline-flex items-center justify-center bg-transparent border-2 border-white text-white px-6 py-3 rounded-md hover:bg-white hover:text-blue-700 transition duration-300 font-medium">
              Download App
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CTA; 