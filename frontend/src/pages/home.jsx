import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiStar, FiTrendingUp, FiBookOpen, FiUsers, FiAward, FiSearch, FiFilter, FiGrid } from 'react-icons/fi';
import Hero from '../components/Home/Hero';
import RecentlyAdded from '../components/Home/RecentlyAdded';
import { fetchBooks } from '../store/books';
import { fetchUserProfile } from '../store/auth';

const Home = () => {
  const dispatch = useDispatch();
  const { books, loading } = useSelector((state) => state.books);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { theme } = useSelector((state) => state.ui);
  
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    dispatch(fetchBooks());
    if (isAuthenticated && user) {
      dispatch(fetchUserProfile());
    }
    
    // Trigger animations when component mounts
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, [dispatch, isAuthenticated, user]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const statsVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  // Get featured books (first 6 books)
  const featuredBooks = books.slice(0, 6);
  const totalBooks = books.length;

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === 'dark' 
        ? 'bg-gray-900 text-white' 
        : 'bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 text-gray-900'
    }`}>
      {/* Hero Section */}
      <Hero />

      {/* Quick Actions Section */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
        className="py-12 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Quick Actions
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Get started with these quick actions
            </p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              {
                icon: FiSearch,
                title: "Search Books",
                description: "Find your next favorite read",
                path: "/books",
                color: "blue"
              },
              {
                icon: FiGrid,
                title: "Browse Market",
                description: "Discover unique book deals",
                path: "/market",
                color: "green"
              },
              {
                icon: FiBookOpen,
                title: "Read Blog",
                description: "Latest book reviews & news",
                path: "/blog",
                color: "purple"
              },
              {
                icon: FiUsers,
                title: "Join Community",
                description: "Connect with fellow readers",
                path: "/social",
                color: "orange"
              }
            ].map((action, index) => (
              <motion.div
                key={index}
                variants={statsVariants}
                whileHover={{ y: -5 }}
                className={`bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 cursor-pointer`}
              >
                <Link to={action.path}>
                  <div className={`w-16 h-16 bg-${action.color}-100 dark:bg-${action.color}-900/30 rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <action.icon className={`w-8 h-8 text-${action.color}-600 dark:text-${action.color}-400`} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 text-center">
                    {action.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-center text-sm">
                    {action.description}
                  </p>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Featured Books Section */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
        className={`py-16 px-4 sm:px-6 lg:px-8 ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        }`}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Featured Books
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Handpicked selections from our collection
            </p>
          </motion.div>

          {loading ? (
            <div className="flex justify-center items-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {featuredBooks.map((book, index) => (
                <motion.div
                  key={book._id}
                  variants={itemVariants}
                  whileHover={{ y: -8 }}
                  className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-shadow duration-300`}
                >
                  <div className="aspect-w-3 aspect-h-4 bg-gray-200 dark:bg-gray-700">
                    <img
                      src={book.coverImage || 'https://via.placeholder.com/300x400?text=Book+Cover'}
                      alt={book.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                      {book.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                      {book.author}
                    </p>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-1">
                        <FiStar className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          {book.rating || '4.5'}
                        </span>
                      </div>
                      <span className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                        ${book.price || '19.99'}
                      </span>
                    </div>
                    <Link
                      to={`/books/${book._id}`}
                      className="block w-full text-center bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-300"
                    >
                      View Details
                    </Link>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </motion.section>

      {/* Recently Added Section */}
      <RecentlyAdded />

      {/* Stats Section */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
        className={`py-16 px-4 sm:px-6 lg:px-8 ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-gradient-to-r from-blue-50 to-indigo-50'
        }`}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              BookHub by the Numbers
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Join our growing community of readers
            </p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <motion.div
              variants={statsVariants}
              className={`bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700 text-center hover:shadow-xl transition-shadow duration-300`}
            >
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiBookOpen className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{totalBooks}+</h3>
              <p className="text-gray-600 dark:text-gray-300">Books Available</p>
            </motion.div>

            <motion.div
              variants={statsVariants}
              className={`bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700 text-center hover:shadow-xl transition-shadow duration-300`}
            >
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiUsers className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">1000+</h3>
              <p className="text-gray-600 dark:text-gray-300">Active Readers</p>
            </motion.div>

            <motion.div
              variants={statsVariants}
              className={`bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700 text-center hover:shadow-xl transition-shadow duration-300`}
            >
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiAward className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">50+</h3>
              <p className="text-gray-600 dark:text-gray-300">Categories</p>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Final CTA */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
        className="py-16 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.div variants={itemVariants}>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Start Your Reading Journey?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Join thousands of readers who have already discovered their next favorite book on BookHub.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/books"
                className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-full text-lg hover:bg-blue-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Browse Books
                <FiArrowRight className="ml-2 w-5 h-5" />
              </Link>
              {!isAuthenticated && (
                <Link
                  to="/signup"
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-blue-600 text-blue-600 dark:text-blue-400 font-semibold rounded-full text-lg hover:bg-blue-600 hover:text-white transform hover:scale-105 transition-all duration-300"
                >
                  Get Started
                </Link>
              )}
            </div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default Home;