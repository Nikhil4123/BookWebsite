import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiClock, FiTrendingUp, FiStar, FiUser, FiPlus } from 'react-icons/fi';
import BookCard from '../BookCard/BookCard';
import { fetchBooks } from '../../store/books';

const RecentlyAdded = () => {
  const dispatch = useDispatch();
  const { books, loading } = useSelector((state) => state.books);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (books.length === 0) {
      dispatch(fetchBooks());
    }
    
    // Trigger animations when component mounts
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, [dispatch, books.length]);

  // Dummy data for recently added books by users
  const dummyRecentlyAddedBooks = [
    {
      _id: 'recent-1',
      title: 'The Midnight Library',
      author: 'Matt Haig',
      price: 24.99,
      coverImage: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1602190253i/52578297.jpg',
      addedBy: 'Sarah Johnson',
      addedDate: '2 days ago',
      rating: 4.5,
      isUserAdded: true
    },
    {
      _id: 'recent-2',
      title: 'Atomic Habits',
      author: 'James Clear',
      price: 19.99,
      coverImage: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1655988385i/40121378.jpg',
      addedBy: 'Mike Chen',
      addedDate: '3 days ago',
      rating: 4.8,
      isUserAdded: true
    },
    {
      _id: 'recent-3',
      title: 'The Seven Husbands of Evelyn Hugo',
      author: 'Taylor Jenkins Reid',
      price: 22.99,
      coverImage: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1674739973i/32620332.jpg',
      addedBy: 'Emma Davis',
      addedDate: '4 days ago',
      rating: 4.6,
      isUserAdded: true
    },
    {
      _id: 'recent-4',
      title: 'Project Hail Mary',
      author: 'Andy Weir',
      price: 27.99,
      coverImage: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1597695864i/54493401.jpg',
      addedBy: 'Alex Thompson',
      addedDate: '5 days ago',
      rating: 4.7,
      isUserAdded: true
    },
    {
      _id: 'recent-5',
      title: 'Lessons in Chemistry',
      author: 'Bonnie Garmus',
      price: 25.99,
      coverImage: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1644158558i/58065033.jpg',
      addedBy: 'Lisa Wang',
      addedDate: '6 days ago',
      rating: 4.4,
      isUserAdded: true
    },
    {
      _id: 'recent-6',
      title: 'Tomorrow, and Tomorrow, and Tomorrow',
      author: 'Gabrielle Zevin',
      price: 26.99,
      coverImage: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1634158558i/58784475.jpg',
      addedBy: 'David Kim',
      addedDate: '1 week ago',
      rating: 4.3,
      isUserAdded: true
    }
  ];

  // Get recently added books (last 6 books) or use dummy data
  const recentlyAddedBooks = books.length > 0 ? books.slice(-6).reverse() : dummyRecentlyAddedBooks;

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
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-zinc-900 dark:to-zinc-800">
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
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                <FiPlus className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                Recently Added by Users
              </h2>
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Discover the latest books added by our community members. Fresh stories, new authors, and exciting reads 
              are shared regularly by fellow book lovers.
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
                <p className="text-gray-600">Loading recent books...</p>
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
                  className="relative"
                >
                  <BookCard book={book} />
                  {book.isUserAdded && (
                    <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
                      <FiUser className="w-3 h-3 mr-1" />
                      {book.addedBy}
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* CTA Section */}
          <motion.div
            variants={itemVariants}
            className="text-center"
          >
            <div className="bg-white dark:bg-zinc-900 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-zinc-800 max-w-2xl mx-auto">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                  <FiTrendingUp className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Join the Community
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Share your favorite books with the community and discover new reads from fellow book lovers. 
                Our platform thrives on the contributions of passionate readers like you.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/market"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Browse Market
                  <FiArrowRight className="ml-2 w-5 h-5" />
                </Link>
                <Link
                  to="/books"
                  className="inline-flex items-center px-6 py-3 border-2 border-blue-600 text-blue-600 dark:text-blue-400 font-semibold rounded-lg hover:bg-blue-600 hover:text-white transform hover:scale-105 transition-all duration-300"
                >
                  <FiStar className="mr-2 w-5 h-5" />
                  All Books
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
                icon: FiUser,
                number: '500+',
                label: 'Active community members',
                color: 'from-blue-500 to-purple-500'
              },
              {
                icon: FiTrendingUp,
                number: '50+',
                label: 'Books added this week',
                color: 'from-green-500 to-blue-500'
              },
              {
                icon: FiStar,
                number: '4.8',
                label: 'Average community rating',
                color: 'from-yellow-500 to-orange-500'
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
                <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {stat.number}
                </h4>
                <p className="text-gray-600 dark:text-gray-300">
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
