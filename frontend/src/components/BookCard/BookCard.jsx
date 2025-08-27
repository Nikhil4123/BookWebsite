/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FiShoppingCart, 
  FiHeart, 
  FiEye, 
  FiStar, 
  FiClock,
  FiUser,
  FiTag
} from 'react-icons/fi';
import { addToCart } from '../../store/cart';
import { addToFavorites, removeFromFavorites } from '../../store/favorites';
import toast from 'react-hot-toast';

const BookCard = ({ book, showActions = true, className = '' }) => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { items: cartItems } = useSelector((state) => state.cart);
  const { items: favoriteItems } = useSelector((state) => state.favorites || { items: [] });
  
  const [isLoading, setIsLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Derive image url with multi-field fallback
  const deriveImageUrl = () => {
    if (imageError) return 'https://via.placeholder.com/300x400?text=Book+Cover';
    return (
      book.coverImage ||
      book.image ||
      book.url ||
      (book.images && (book.images.cover || book.images.main)) ||
      'https://via.placeholder.com/300x400?text=Book+Cover'
    );
  };
  
  const isInCart = cartItems.some(item => item._id === book._id);
  const isFavorite = favoriteItems.some(item => item._id === book._id);

  // Handle add to cart
  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      return;
    }
    
    if (isInCart) {
      toast.success('Book is already in your cart');
      return;
    }

    setIsLoading(true);
    try {
      await dispatch(addToCart(book._id)).unwrap();
      toast.success('Added to cart successfully');
    } catch (error) {
      toast.error(error || 'Failed to add to cart');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle favorite toggle
  const handleFavoriteToggle = () => {
    if (!isAuthenticated) {
      toast.error('Please login to add favorites');
      return;
    }

    if (isFavorite) {
      dispatch(removeFromFavorites(book._id));
      toast.success('Removed from favorites');
    } else {
      dispatch(addToFavorites(book));
      toast.success('Added to favorites');
    }
  };

  // Handle image error
  const handleImageError = () => {
    setImageError(true);
  };

  // Format price
  const formatPrice = (price) => {
    if (!price) return 'Free';
    return `$${parseFloat(price).toFixed(2)}`;
  };

  // Format rating
  const formatRating = (rating) => {
    if (!rating) return '4.5';
    return parseFloat(rating).toFixed(1);
  };

  // Get book status
  const getBookStatus = () => {
    if (book.status === 'available') return { text: 'Available', color: 'bg-green-100 text-green-800' };
    if (book.status === 'out_of_stock') return { text: 'Out of Stock', color: 'bg-red-100 text-red-800' };
    if (book.status === 'coming_soon') return { text: 'Coming Soon', color: 'bg-blue-100 text-blue-800' };
    return { text: 'Available', color: 'bg-green-100 text-green-800' };
  };

  const status = getBookStatus();
  
  return (
    <motion.div
      className={`bg-white dark:bg-zinc-900 rounded-2xl shadow-lg border border-gray-100 dark:border-zinc-800 overflow-hidden hover:shadow-xl transition-all duration-300 group ${className}`}
      whileHover={{ y: -8 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Book Cover */}
      <div className="relative aspect-[3/4] bg-gray-200 dark:bg-zinc-800 overflow-hidden">
        <img
          src={deriveImageUrl()}
          alt={book.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          onError={handleImageError}
        />
        
        {/* Status Badge */}
        <div className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
          {status.text}
          </div>

        {/* Quick Actions Overlay */}
        {showActions && (
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleFavoriteToggle}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                isFavorite 
                  ? 'bg-red-500 text-white hover:bg-red-600' 
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              <FiHeart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
            </motion.button>
            
            <Link to={`/books/${book._id}`}>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-12 h-12 bg-white/20 text-white rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                <FiEye className="w-5 h-5" />
              </motion.button>
      </Link>
          </div>
        )}

        {/* Rating Badge */}
        <div className="absolute top-3 right-3 bg-white/90 dark:bg-zinc-900/80 backdrop-blur-sm rounded-full px-2 py-1 flex items-center space-x-1">
          <FiStar className="w-3 h-3 text-yellow-400 fill-current" />
          <span className="text-xs font-medium text-gray-700">
            {formatRating(book.rating)}
          </span>
        </div>
      </div>

      {/* Book Info */}
      <div className="p-6">
        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {book.title}
        </h3>

        {/* Author */}
        <div className="flex items-center space-x-2 mb-3">
          <FiUser className="w-4 h-4 text-gray-400" />
          <p className="text-gray-400 dark:text-gray-300 text-sm line-clamp-1">
            {book.author || 'Unknown Author'}
          </p>
        </div>

        {/* Category */}
        {book.category && (
          <div className="flex items-center space-x-2 mb-3">
            <FiTag className="w-4 h-4 text-gray-400" />
            <span className="text-xs bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full">
              {book.category}
            </span>
          </div>
        )}

        {/* Price and Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold text-blue-500 dark:text-blue-400">
              {formatPrice(book.price)}
            </span>
            {book.originalPrice && book.originalPrice > book.price && (
              <span className="text-sm text-gray-400 dark:text-gray-500 line-through">
                {formatPrice(book.originalPrice)}
              </span>
            )}
          </div>

          {showActions && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddToCart}
              disabled={isLoading || isInCart || book.status === 'out_of_stock'}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                isInCart
                  ? 'bg-green-100 text-green-700 cursor-not-allowed'
                  : book.status === 'out_of_stock'
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg'
              }`}
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : isInCart ? (
                'In Cart'
              ) : book.status === 'out_of_stock' ? (
                'Out of Stock'
              ) : (
                <>
                  <FiShoppingCart className="w-4 h-4 inline mr-2" />
                  Add to Cart
                </>
              )}
            </motion.button>
          )}
        </div>

        {/* Additional Info */}
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-zinc-800">
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center space-x-1">
              <FiClock className="w-3 h-3" />
              <span>{book.publishedYear || 'N/A'}</span>
            </div>
            <span>{book.pages || 'N/A'} pages</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BookCard;
