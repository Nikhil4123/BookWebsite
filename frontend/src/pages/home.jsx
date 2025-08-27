import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiStar, FiTrendingUp, FiBookOpen, FiUsers, FiAward } from 'react-icons/fi';
import Hero from '../components/Home/Hero';
import RecentlyAdded from '../components/Home/RecentlyAdded';
import { fetchBooks } from '../store/books';
import { fetchUserProfile } from '../store/auth';

const Home = () => {
  const dispatch = useDispatch();
  const { books, loading } = useSelector((state) => state.books);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-black dark:via-zinc-950 dark:to-zinc-900">
      {/* Hero Section */}
      <Hero />

      {/* Welcome Section */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
        className="py-16 px-4 sm:px-6 lg:px-8 dark:bg-black"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Welcome to{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                BookHub
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Discover your next favorite book, connect with fellow readers, and explore a world of knowledge 
              through our curated collection of books from around the globe.
            </p>
          </motion.div>

          {/* Stats Section */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
          >
            <motion.div
              variants={statsVariants}
              className="bg-white dark:bg-zinc-900 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-zinc-800 text-center hover:shadow-xl transition-shadow duration-300"
            >
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiBookOpen className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{totalBooks}+</h3>
              <p className="text-gray-600 dark:text-gray-300">Books Available</p>
            </motion.div>

            <motion.div
              variants={statsVariants}
              className="bg-white dark:bg-zinc-900 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-zinc-800 text-center hover:shadow-xl transition-shadow duration-300"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiUsers className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">1000+</h3>
              <p className="text-gray-600 dark:text-gray-300">Active Readers</p>
            </motion.div>

            <motion.div
              variants={statsVariants}
              className="bg-white dark:bg-zinc-900 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-zinc-800 text-center hover:shadow-xl transition-shadow duration-300"
            >
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiAward className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">50+</h3>
              <p className="text-gray-600 dark:text-gray-300">Categories</p>
            </motion.div>
          </motion.div>

          {/* CTA Section */}
          <motion.div variants={itemVariants} className="text-center">
            <Link
              to="/books"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-full text-lg hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Explore All Books
              <FiArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* Featured Books Section */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
        className="py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-black"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
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
              {featuredBooks.map((book) => {
                const imageUrl = (
                  book.coverImage ||
                  book.image ||
                  book.url ||
                  (book.images && (book.images.cover || book.images.main)) ||
                  'https://via.placeholder.com/300x400?text=Book+Cover'
                );
                return (
                  <motion.div
                    key={book._id}
                    variants={itemVariants}
                    whileHover={{ y: -8 }}
                    className="group bg-white dark:bg-zinc-900 rounded-2xl shadow-lg border border-gray-100 dark:border-zinc-800 overflow-hidden hover:shadow-2xl transition-all duration-300"
                  >
                    <div className="relative aspect-[3/4] bg-gray-200 dark:bg-zinc-800 overflow-hidden">
                      <img
                        src={imageUrl}
                        alt={book.title}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/300x400?text=Book+Cover'; }}
                      />
                      <div className="absolute top-3 left-3 bg-white/90 dark:bg-zinc-900/80 backdrop-blur-sm text-xs font-medium px-2 py-1 rounded-full text-gray-700 dark:text-gray-200">Featured</div>
                      <div className="absolute top-3 right-3 bg-white/90 dark:bg-zinc-900/80 rounded-full px-2 py-1 flex items-center space-x-1">
                        <FiStar className="w-3 h-3 text-yellow-400 fill-current" />
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-200">{(book.rating || 4.5).toFixed ? (book.rating || 4.5).toFixed(1) : book.rating || '4.5'}</span>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {book.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">{book.author || 'Unknown Author'}</p>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-lg font-semibold text-blue-600 dark:text-blue-400">${(book.price ?? 19.99)}</span>
                        {book.originalPrice && book.originalPrice > (book.price ?? 0) && (
                          <span className="text-sm text-gray-400 dark:text-gray-500 line-through">${book.originalPrice}</span>
                        )}
                      </div>
                      <Link
                        to={`/books/${book._id}`}
                        className="block w-full text-center bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-300"
                      >
                        View Details
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </div>
      </motion.section>

      {/* Recently Added Section */}
      <RecentlyAdded />

      {/* Features Section */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
        className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-50 to-indigo-50"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose BookHub?
            </h2>
            <p className="text-lg text-gray-600">
              Discover the features that make us your go-to destination for books
            </p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {[
              {
                icon: FiBookOpen,
                title: "Vast Collection",
                description: "Access thousands of books across all genres and categories",
                color: "blue"
              },
              {
                icon: FiTrendingUp,
                title: "Trending Books",
                description: "Stay updated with the latest and most popular releases",
                color: "green"
              },
              {
                icon: FiStar,
                title: "Curated Selection",
                description: "Handpicked books by our expert curators",
                color: "yellow"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={statsVariants}
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300"
              >
                <div className={`w-16 h-16 bg-${feature.color}-100 rounded-full flex items-center justify-center mx-auto mb-6`}>
                  <feature.icon className={`w-8 h-8 text-${feature.color}-600`} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-center leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
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
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Ready to Start Your Reading Journey?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
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
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-blue-600 text-blue-600 font-semibold rounded-full text-lg hover:bg-blue-600 hover:text-white transform hover:scale-105 transition-all duration-300"
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