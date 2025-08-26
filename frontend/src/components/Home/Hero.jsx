/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FiArrowRight, FiBookOpen, FiSearch, FiTrendingUp, FiUsers, FiStar, FiHeart } from 'react-icons/fi';

const Hero = () => {
  const { theme } = useSelector((state) => state.ui);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  // Unique book-themed background patterns
  const heroPatterns = [
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRkZGRkZGIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPHBhdGggZD0iTTAgMEgxMDBWMTAwSDBWMFoiIGZpbGw9InVybCgjZ3JhZGllbnQwX2xpbmVhcl8xXzEpIi8+CjxkZWZzPgo8bGluZWFyR3JhZGllbnQgaWQ9ImdyYWRpZW50MF9saW5lYXJfMV8xIiB4MT0iMCIgeTE9IjAiIHgyPSIxMDAiIHkyPSIxMDAiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KPHN0b3Agc3RvcC1jb2xvcj0iIzg4N0NGRiIvPgo8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiM0QzU1NjAiLz4KPC9saW5lYXJHcmFkaWVudD4KPC9kZWZzPgo8L3N2Zz4K',
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRkZGRkZGIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPGNpcmNsZSBjeD0iNTAiIGN5PSI1MCIgcj0iNDAiIGZpbGw9InVybCgjZ3JhZGllbnQwX3JhZGlhbF8xXzEpIi8+CjxkZWZzPgo8cmFkaWFsR3JhZGllbnQgaWQ9ImdyYWRpZW50MF9yYWRpYWxfMV8xIiBjeD0iNTAiIGN5PSI1MCIgcj0iNTAiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KPHN0b3Agc3RvcC1jb2xvcj0iIzg4N0NGRiIvPgo8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiM0QzU1NjAiLz4KPC9yYWRpYWxHcmFkaWVudD4KPC9kZWZzPgo8L3N2Zz4K',
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRkZGRkZGIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPHBhdGggZD0iTTAgMEw1MCA1MEwwIDEwMEgxMDBMMTAwIDBIMFYwWiIgZmlsbD0idXJsKCNncmFkaWVudDBfbGluZWFyXzFfMSkiLz4KPGRlZnM+CjxsaW5lYXJHcmFkaWVudCBpZD0iZ3JhZGllbnQwX2xpbmVhcl8xXzEiIHgxPSIwIiB5MT0iMCIgeDI9IjEwMCIgeTI9IjEwMCIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgo8c3RvcCBzdG9wLWNvbG9yPSIjODg3Q0ZGIi8+CjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzRDNTVGNCIvPgo8L2xpbmVhckdyYWRpZW50Pgo8L2RlZnM+Cjwvc3ZnPgo='
  ];

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroPatterns.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // Floating book elements
  const floatingBooks = [
    { id: 1, title: "The Great Gatsby", author: "F. Scott Fitzgerald", delay: 0, x: 20, y: 30 },
    { id: 2, title: "1984", author: "George Orwell", delay: 0.5, x: 80, y: 20 },
    { id: 3, title: "Pride & Prejudice", author: "Jane Austen", delay: 1, x: 15, y: 70 },
    { id: 4, title: "To Kill a Mockingbird", author: "Harper Lee", delay: 1.5, x: 75, y: 75 }
  ];

  return (
    <section className={`relative min-h-screen overflow-hidden ${
      theme === 'dark'
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-black'
        : 'bg-gradient-to-br from-amber-50 via-orange-50 to-red-50'
    }`}>
      {/* Animated background patterns */}
      <div className="absolute inset-0 opacity-30">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImageIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0"
            style={{
              backgroundImage: `url("${heroPatterns[currentImageIndex]}")`,
              backgroundSize: '200px 200px',
              backgroundRepeat: 'repeat'
            }}
          />
        </AnimatePresence>
      </div>

      {/* Floating book elements */}
      {floatingBooks.map((book) => (
        <motion.div
          key={book.id}
          initial={{ opacity: 0, y: 50, x: book.x }}
          animate={{ 
            opacity: [0.3, 0.8, 0.3], 
            y: [book.y, book.y - 20, book.y],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ 
            duration: 6, 
            delay: book.delay, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute hidden lg:block"
          style={{ left: `${book.x}%`, top: `${book.y}%` }}
        >
          <div className="relative group">
            <div className="w-16 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg shadow-lg transform rotate-12 group-hover:rotate-0 transition-transform duration-300">
                                <div className={`absolute inset-1 rounded-md opacity-90 ${
                    theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                  }`}></div>
              <div className="absolute top-2 left-2 w-2 h-2 bg-amber-600 rounded-full"></div>
              <div className="absolute top-2 right-2 w-2 h-2 bg-amber-600 rounded-full"></div>
            </div>
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
              {book.title}
            </div>
          </div>
        </motion.div>
      ))}

      {/* Main content */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          {/* Left side - Text content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : -50 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8"
          >
            {/* Unique badge */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-medium rounded-full shadow-lg"
            >
              <FiStar className="w-4 h-4 mr-2 animate-pulse" />
              Discover Your Next Adventure
            </motion.div>

            {/* Main heading with unique typography */}
            <div className="space-y-4">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="text-5xl lg:text-7xl font-bold leading-tight"
              >
                <span className="bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 bg-clip-text text-transparent">
                  Stories
                </span>
                <br />
                <span className={theme === 'dark' ? 'text-white' : 'text-gray-800'}>That</span>
                <br />
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Transform
                </span>
              </motion.h1>
            </div>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className={`text-xl leading-relaxed max-w-lg ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}
            >
              Embark on literary journeys that ignite imagination, challenge perspectives, and create lasting memories. Your next favorite book awaits.
            </motion.p>

            {/* Action buttons with unique styling */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link
                to="/all-books"
                className="group relative inline-flex items-center px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-2xl text-lg overflow-hidden shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                <span className="relative z-10 flex items-center">
                  <FiBookOpen className="mr-3 w-6 h-6" />
                  Explore Library
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-red-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </Link>

              <Link
                to="/signup"
                className="group relative inline-flex items-center px-8 py-4 border-2 border-purple-500 text-purple-600 font-semibold rounded-2xl text-lg overflow-hidden hover:text-white transition-all duration-300"
              >
                <span className="relative z-10 flex items-center">
                  <FiUsers className="mr-3 w-6 h-6" />
                  Join Book Club
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </Link>
            </motion.div>

            {/* Stats with unique design */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="grid grid-cols-3 gap-6 pt-8"
            >
              {[
                { number: "50K+", label: "Books", icon: FiBookOpen, color: "from-amber-400 to-orange-500" },
                { number: "10K+", label: "Readers", icon: FiUsers, color: "from-purple-400 to-pink-500" },
                { number: "100+", label: "Genres", icon: FiTrendingUp, color: "from-red-400 to-pink-500" }
              ].map((stat, index) => (
                <div key={index} className="text-center group">
                  <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${stat.color} rounded-2xl mb-3 group-hover:scale-110 transition-transform duration-300`}>
                    <stat.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className={`text-3xl font-bold mb-1 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-800'
                  }`}>{stat.number}</div>
                  <div className={`text-sm ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                  }`}>{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right side - Visual elements */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : 50 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative hidden lg:block"
          >
            {/* Central book stack */}
            <div className="relative">
              {/* Main book */}
              <motion.div
                animate={{ 
                  y: [0, -20, 0],
                  rotateY: [0, 5, 0]
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="relative z-20 w-80 h-96 mx-auto"
              >
                <div className="w-full h-full bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 rounded-2xl shadow-2xl transform rotate-6">
                  <div className={`absolute inset-2 rounded-xl opacity-95 ${
                    theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                  }`}></div>
                  <div className="absolute top-4 left-4 right-4 space-y-2">
                    <div className="h-3 bg-amber-200 rounded-full"></div>
                    <div className="h-3 bg-orange-200 rounded-full w-3/4"></div>
                    <div className="h-3 bg-red-200 rounded-full w-1/2"></div>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="h-8 bg-gradient-to-r from-amber-300 to-orange-400 rounded-lg"></div>
                  </div>
                </div>
              </motion.div>

              {/* Background books */}
              <motion.div
                animate={{ 
                  y: [0, -15, 0],
                  rotateY: [0, -3, 0]
                }}
                transition={{ 
                  duration: 4, 
                  delay: 0.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute top-8 left-8 w-72 h-88 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl shadow-xl transform -rotate-6 z-10"
              >
                <div className={`absolute inset-2 rounded-xl opacity-90 ${
                  theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                }`}></div>
              </motion.div>

              <motion.div
                animate={{ 
                  y: [0, -10, 0],
                  rotateY: [0, 3, 0]
                }}
                transition={{ 
                  duration: 4, 
                  delay: 1,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute top-16 right-8 w-64 h-80 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-2xl shadow-xl transform rotate-12 z-0"
              >
                <div className={`absolute inset-2 rounded-xl opacity-90 ${
                  theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                }`}></div>
              </motion.div>
            </div>

            {/* Floating elements */}
            <motion.div
              animate={{ 
                rotate: [0, 360],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 20, 
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-full opacity-60"
            ></motion.div>

            <motion.div
              animate={{ 
                rotate: [360, 0],
                scale: [1, 0.8, 1]
              }}
              transition={{ 
                duration: 15, 
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-br from-pink-300 to-purple-400 rounded-full opacity-60"
            ></motion.div>
          </motion.div>
        </div>
      </div>

      {/* Bottom wave decoration */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-auto">
          <path
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
            opacity=".25"
            fill="currentColor"
            className={theme === 'dark' ? 'text-amber-900' : 'text-amber-100'}
          ></path>
          <path
            d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.71,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
            opacity=".5"
            fill="currentColor"
            className={theme === 'dark' ? 'text-orange-900' : 'text-orange-100'}
          ></path>
          <path
            d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
            fill="currentColor"
            className={theme === 'dark' ? 'text-red-900' : 'text-red-100'}
          ></path>
        </svg>
      </div>
    </section>
  );
};

export default Hero;
