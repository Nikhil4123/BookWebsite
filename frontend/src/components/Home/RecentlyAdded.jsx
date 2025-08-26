import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiClock, FiTrendingUp, FiStar } from 'react-icons/fi';
import BookCard from '../BookCard/BookCard';
import { fetchBooks } from '../../store/books';

const RecentlyAdded = () => {
  const dispatch = useDispatch();
  const { books, loading } = useSelector((state) => state.books);
  const { theme } = useSelector((state) => state.ui);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (books.length === 0) {
      dispatch(fetchBooks());
    }
    
    // Trigger animations when component mounts
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, [dispatch, books.length]);

  // Get recently added books (last 6 books)
  const recentlyAddedBooks = books.slice(-6).reverse();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
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

  const headerVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  return (
    <section className={`py-16 px-4 sm:px-6 lg:px-8 ${
      theme === 'dark' 
        ? 'bg-gray-800' 
        : 'bg-gradient-to-br from-gray-50 to-blue-50'
    }`}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
        >
          {/* Header */}
          <motion.div
            variants={headerVariants}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                <FiClock className="w-6 h-6 text-white" />
              </div>
              <h2 className={`text-3xl md:text-4xl font-bold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Recently Added
              </h2>
            </div>
            <p className={`text-lg max-w-2xl mx-auto ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Discover the latest additions to our collection. Fresh stories, new authors, and exciting reads 
              are added regularly to keep your reading journey fresh and engaging.
            </p>
          </motion.div>

          {/* Books Grid */}
          {loading ? (
            <motion.div
              variants={itemVariants}
              className="flex justify-center items-center py-16"
            >
              <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>Loading recent books...</p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
            >
              {recentlyAddedBooks.map((book, index) => (
                <motion.div
                  key={book._id}
                  variants={itemVariants}
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.3 }}
                >
                  <BookCard book={book} />
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* CTA Section */}
          <motion.div
            variants={itemVariants}
            className="text-center"
          >
            <div className={`rounded-2xl p-8 shadow-lg border max-w-2xl mx-auto ${
              theme === 'dark' 
                ? 'bg-gray-800 border-gray-700' 
                : 'bg-white border-gray-100'
            }`}>
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                  <FiTrendingUp className="w-6 h-6 text-white" />
                </div>
                <h3 className={`text-2xl font-bold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  Stay Updated
                </h3>
              </div>
              <p className={`mb-6 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Never miss out on new releases and trending books. Our collection is constantly growing 
                with carefully curated selections from around the world.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/books"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Browse All Books
                  <FiArrowRight className="ml-2 w-5 h-5" />
                </Link>
                <Link
                  to="/new-releases"
                  className="inline-flex items-center px-6 py-3 border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-600 hover:text-white transform hover:scale-105 transition-all duration-300"
                >
                  <FiStar className="mr-2 w-5 h-5" />
                  New Releases
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Stats Section */}
          <motion.div
            variants={itemVariants}
            className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              {
                icon: FiClock,
                number: 'Daily',
                label: 'New books added every day',
                color: 'from-orange-500 to-red-500'
              },
              {
                icon: FiTrendingUp,
                number: '1000+',
                label: 'Books added this month',
                color: 'from-green-500 to-blue-500'
              },
              {
                icon: FiStar,
                number: '4.8',
                label: 'Average reader rating',
                color: 'from-purple-500 to-pink-500'
              }
            ].map((stat, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="text-center"
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${stat.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <h4 className={`text-2xl font-bold mb-2 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {stat.number}
                </h4>
                <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default RecentlyAdded;
