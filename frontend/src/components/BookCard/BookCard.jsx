/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiHeart, FiShoppingCart, FiEye, FiStar, FiBookOpen, FiClock, FiUser } from 'react-icons/fi';
import { addToCart, removeFromCart } from '../../store/cart';
import { addToFavorites, removeFromFavorites } from '../../store/favorites';
import toast from 'react-hot-toast';

const BookCard = ({ book }) => {
  const dispatch = useDispatch();
  const { items: cartItems } = useSelector((state) => state.cart);
  const { items: favoriteItems } = useSelector((state) => state.favorites);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { theme } = useSelector((state) => state.ui);

  const [isHovered, setIsHovered] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const isInCart = cartItems?.some(item => item._id === book._id) || false;
  const isInFavorites = favoriteItems?.some(item => item._id === book._id) || false;

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      return;
    }
    if (isInCart) {
      dispatch(removeFromCart(book._id));
      toast.success('Removed from cart');
    } else {
      dispatch(addToCart({ ...book, quantity: 1 }));
      toast.success('Added to cart');
    }
  };

  const handleToggleFavorite = () => {
    if (!isAuthenticated) {
      toast.error('Please login to add favorites');
      return;
    }
    if (isInFavorites) {
      dispatch(removeFromFavorites(book._id));
      toast.success('Removed from favorites');
    } else {
      dispatch(addToFavorites(book));
      toast.success('Added to favorites');
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const getRatingColor = (rating) => {
    if (rating >= 4.5) return 'from-green-400 to-emerald-500';
    if (rating >= 4.0) return 'from-blue-400 to-cyan-500';
    if (rating >= 3.5) return 'from-yellow-400 to-orange-500';
    if (rating >= 3.0) return 'from-orange-400 to-red-500';
    return 'from-gray-400 to-gray-500';
  };

  const getStatusBadge = () => {
    if (book.availability === 'in-stock') {
      return (
        <div className="absolute top-3 left-3 z-20">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-lg">
            <div className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse"></div>
            In Stock
          </span>
        </div>
      );
    } else if (book.availability === 'limited') {
      return (
        <div className="absolute top-3 left-3 z-20">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg">
            <div className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse"></div>
            Limited
          </span>
        </div>
      );
    } else {
      return (
        <div className="absolute top-3 left-3 z-20">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-red-400 to-pink-500 text-white shadow-lg">
            <div className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse"></div>
            Out of Stock
          </span>
        </div>
      );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 3D Book Container */}
      <motion.div
        animate={{
          rotateY: isHovered ? 15 : 0,
          rotateX: isHovered ? 5 : 0,
          scale: isHovered ? 1.05 : 1,
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className={`relative rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform perspective-1000 ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        }`}
      >
        {/* Book Cover Image */}
        <div className="relative h-80 overflow-hidden bg-gradient-to-br from-amber-50 to-orange-100">
          {/* Loading skeleton */}
          {!isImageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-br from-amber-200 to-orange-300 animate-pulse">
              <div className="absolute inset-0 flex items-center justify-center">
                <FiBookOpen className="w-16 h-16 text-amber-600 animate-bounce" />
              </div>
            </div>
          )}
          
          <img
            src={book.coverImage || 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'}
            alt={book.title}
            className={`w-full h-full object-cover transition-transform duration-500 ${
              isHovered ? 'scale-110' : 'scale-100'
            } ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setIsImageLoaded(true)}
          />
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Status badge */}
          {getStatusBadge()}

          {/* Quick action buttons */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.2 }}
                className="absolute bottom-3 left-3 right-3 flex gap-2"
              >
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleToggleFavorite}
                  className={`flex-1 flex items-center justify-center py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isInFavorites
                      ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg'
                      : 'bg-white/90 text-gray-700 hover:bg-white hover:shadow-lg'
                  }`}
                >
                  <FiHeart className={`w-4 h-4 mr-1 ${isInFavorites ? 'fill-current' : ''}`} />
                  {isInFavorites ? 'Saved' : 'Save'}
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleAddToCart}
                  className={`flex-1 flex items-center justify-center py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isInCart
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg'
                      : 'bg-white/90 text-gray-700 hover:bg-white hover:shadow-lg'
                  }`}
                >
                  <FiShoppingCart className="w-4 h-4 mr-1" />
                  {isInCart ? 'In Cart' : 'Add'}
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Book Information */}
        <div className="p-6 space-y-4">
          {/* Title and Author */}
          <div className="space-y-2">
            <Link to={`/book/${book._id}`}>
                          <h3 className={`text-xl font-bold group-hover:text-amber-600 transition-colors duration-200 line-clamp-2 leading-tight ${
              theme === 'dark' ? 'text-white' : 'text-gray-800'
            }`}>
              {book.title}
            </h3>
            </Link>
            <div className={`flex items-center ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>
              <FiUser className="w-4 h-4 mr-2 text-amber-500" />
              <span className="text-sm font-medium">{book.author || 'Unknown Author'}</span>
            </div>
          </div>

          {/* Rating and Reviews */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className={`inline-flex items-center px-2 py-1 rounded-lg bg-gradient-to-r ${getRatingColor(book.rating || 4.0)} text-white text-xs font-bold`}>
                <FiStar className="w-3 h-3 mr-1 fill-current" />
                {book.rating || 4.0}
              </div>
              <span className={`text-sm ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}>
                ({book.reviewCount || Math.floor(Math.random() * 100) + 20} reviews)
              </span>
            </div>
            
            {/* Publication year and age */}
            {book.publicationYear ? (
              <div className={`flex items-center text-sm ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}>
                <FiClock className="w-3 h-3 mr-1" />
                <span>{book.publicationYear}</span>
                <span className={`ml-1 text-xs ${
                  theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                }`}>
                  ({new Date().getFullYear() - book.publicationYear} years old)
                </span>
              </div>
            ) : (
              <div className={`flex items-center text-sm ${
                theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
              }`}>
                <FiClock className="w-3 h-3 mr-1" />
                <span>Publication year not available</span>
              </div>
            )}
          </div>

          {/* Genre tags */}
          {book.genre && (
            <div className="flex flex-wrap gap-2">
              {book.genre.split(',').slice(0, 2).map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 border border-amber-200"
                >
                  {tag.trim()}
                </span>
              ))}
            </div>
          )}

          {/* Price and Actions */}
          <div className="flex items-center justify-between pt-2">
            <div className="space-y-1">
                          <div className={`text-2xl font-bold ${
              theme === 'dark' ? 'text-white' : 'text-gray-800'
            }`}>
              {formatPrice(book.price || 19.99)}
            </div>
              {book.originalPrice && book.originalPrice > book.price && (
                <div className="text-sm text-gray-500 line-through">
                  {formatPrice(book.originalPrice)}
                </div>
              )}
            </div>
            
            <Link
              to={`/book/${book._id}`}
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl hover:from-amber-600 hover:to-orange-600 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <FiEye className="w-4 h-4 mr-2" />
              View Details
            </Link>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-amber-400/20 to-orange-400/20 rounded-full -translate-y-10 translate-x-10 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full translate-y-8 -translate-x-8 pointer-events-none" />
      </motion.div>

      {/* Hover effect shadow */}
      {isHovered && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-gradient-to-r from-amber-400/20 to-orange-400/20 rounded-2xl blur-xl -z-10"
        />
      )}
    </motion.div>
  );
};

export default BookCard;
