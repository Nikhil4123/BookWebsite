import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { 
  FiSearch, FiFilter, FiPlus, FiGrid, FiList, FiMapPin, 
  FiDollarSign, FiBook, FiUser, FiClock, FiCheckCircle, 
  FiXCircle, FiPause, FiPlay, FiTrash2, FiEdit, FiEye,
  FiShoppingCart, FiStar, FiTrendingUp
} from 'react-icons/fi';
import { 
  fetchListings, 
  fetchMyListings, 
  setFilters, 
  clearFilters 
} from '../store/market';
import { clearError } from '../store/market';
import toast from 'react-hot-toast';

const Market = () => {
  const dispatch = useDispatch();
  const { 
    listings, 
    myListings, 
    loading, 
    myListingsLoading, 
    error, 
    filters 
  } = useSelector((state) => state.market);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  
  const [activeTab, setActiveTab] = useState('browse');
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(clearError());
    dispatch(fetchListings(filters));
    if (isAuthenticated) {
      dispatch(fetchMyListings());
    }
  }, [dispatch, filters, isAuthenticated]);

  const handleFilterChange = (key, value) => {
    dispatch(setFilters({ [key]: value }));
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
    setSearchTerm('');
  };

  const handleSearch = () => {
    if (searchTerm.trim()) {
      dispatch(setFilters({ search: searchTerm.trim() }));
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { color: 'bg-green-500', text: 'Active', icon: FiCheckCircle },
      pending_verification: { color: 'bg-yellow-500', text: 'Pending', icon: FiClock },
      paused: { color: 'bg-gray-500', text: 'Paused', icon: FiPause },
      rejected: { color: 'bg-red-500', text: 'Rejected', icon: FiXCircle },
      sold: { color: 'bg-purple-500', text: 'Sold', icon: FiShoppingCart },
    };
    
    const config = statusConfig[status] || statusConfig.active;
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color} text-white`}>
        <Icon className="w-3 h-3 mr-1" />
        {config.text}
      </span>
    );
  };

  const getTypeBadge = (type) => {
    const typeConfig = {
      new_book: { color: 'bg-blue-500', text: 'New Book' },
      old_book_own: { color: 'bg-orange-500', text: 'My Old Book' },
      old_book_other: { color: 'bg-purple-500', text: 'Other\'s Book' },
    };
    
    const config = typeConfig[type] || typeConfig.new_book;
    
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color} text-white`}>
        {config.text}
      </span>
    );
  };

  const getConditionBadge = (condition) => {
    const conditionConfig = {
      new: { color: 'bg-green-500', text: 'New' },
      like_new: { color: 'bg-blue-500', text: 'Like New' },
      good: { color: 'bg-yellow-500', text: 'Good' },
      fair: { color: 'bg-orange-500', text: 'Fair' },
      poor: { color: 'bg-red-500', text: 'Poor' },
    };
    
    const config = conditionConfig[condition] || conditionConfig.good;
    
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color} text-white`}>
        {config.text}
      </span>
    );
  };

  const renderListingCard = (listing) => (
    <motion.div
      key={listing._id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-lg overflow-hidden hover:border-gray-300 dark:hover:border-zinc-600 transition-all duration-300 hover:shadow-xl hover:shadow-gray-900/20"
    >
      {/* Book Image */}
      <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-zinc-800 dark:to-zinc-900">
        {listing.bookRef?.url ? (
          <img 
            src={listing.bookRef.url} 
            alt={listing.bookRef.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <FiBook className="w-16 h-16 text-gray-400 dark:text-gray-600" />
          </div>
        )}
        
        {/* Status Badge */}
        <div className="absolute top-2 right-2">
          {getStatusBadge(listing.status)}
        </div>
        
        {/* Type Badge */}
        <div className="absolute top-2 left-2">
          {getTypeBadge(listing.type)}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
          {listing.bookRef?.title || 'Untitled Book'}
        </h3>
        
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
          by {listing.bookRef?.author || 'Unknown Author'}
        </p>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center text-blue-600 dark:text-blue-400">
            <FiDollarSign className="w-4 h-4 mr-1" />
            <span className="text-lg font-bold">${listing.price}</span>
          </div>
          {getConditionBadge(listing.condition)}
        </div>

        <div className="flex items-center text-gray-600 dark:text-gray-300 text-sm mb-3">
          <FiUser className="w-4 h-4 mr-1" />
          <span>{listing.seller?.username || 'Unknown Seller'}</span>
        </div>

        {listing.location && (
          <div className="flex items-center text-gray-600 dark:text-gray-300 text-sm mb-3">
            <FiMapPin className="w-4 h-4 mr-1" />
            <span>{listing.location}</span>
          </div>
        )}

        {listing.notes && (
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">
            {listing.notes}
          </p>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-md text-sm font-medium transition-colors">
            <FiEye className="w-4 h-4 mr-1 inline" />
            View Details
          </button>
          
          {isAuthenticated && listing.seller?._id === user?.id && (
            <>
              {listing.status === 'active' && (
                <button className="bg-yellow-600 hover:bg-yellow-700 text-white p-2 rounded-md transition-colors">
                  <FiPause className="w-4 h-4" />
                </button>
              )}
              {listing.status === 'paused' && (
                <button className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-md transition-colors">
                  <FiPlay className="w-4 h-4" />
                </button>
              )}
              <button className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-md transition-colors">
                <FiTrash2 className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-black dark:via-zinc-950 dark:to-zinc-900 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                Book Market
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Buy and sell books with our community
              </p>
            </div>
            
            {isAuthenticated && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-medium flex items-center transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <FiPlus className="w-5 h-5 mr-2" />
                Sell a Book
              </motion.button>
            )}
          </div>

          {/* Search and Filters */}
          <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-lg p-4 shadow-lg">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search books, authors, or sellers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-700 dark:text-gray-200 px-4 py-3 rounded-lg flex items-center transition-colors"
              >
                <FiFilter className="w-5 h-5 mr-2" />
                Filters
              </button>

              {/* View Mode Toggle */}
              <div className="flex bg-gray-100 dark:bg-zinc-800 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <FiGrid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <FiList className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Filters Panel */}
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 pt-4 border-t border-gray-200 dark:border-zinc-700"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <select
                    value={filters.type || ''}
                    onChange={(e) => handleFilterChange('type', e.target.value)}
                    className="bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-600 rounded-lg px-3 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Types</option>
                    <option value="new_book">New Books</option>
                    <option value="old_book_own">My Old Books</option>
                    <option value="old_book_other">Other's Books</option>
                  </select>

                  <select
                    value={filters.condition || ''}
                    onChange={(e) => handleFilterChange('condition', e.target.value)}
                    className="bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-600 rounded-lg px-3 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Conditions</option>
                    <option value="new">New</option>
                    <option value="like_new">Like New</option>
                    <option value="good">Good</option>
                    <option value="fair">Fair</option>
                    <option value="poor">Poor</option>
                  </select>

                  <input
                    type="number"
                    placeholder="Min Price"
                    value={filters.minPrice || ''}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                    className="bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-600 rounded-lg px-3 py-2 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  <input
                    type="number"
                    placeholder="Max Price"
                    value={filters.maxPrice || ''}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                    className="bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-600 rounded-lg px-3 py-2 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="mt-4 flex justify-end">
                  <button
                    onClick={handleClearFilters}
                    className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-sm"
                  >
                    Clear All Filters
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg p-1 mb-6">
          <button
            onClick={() => setActiveTab('browse')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'browse' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-zinc-700'
            }`}
          >
            Browse Market
          </button>
          {isAuthenticated && (
            <button
              onClick={() => setActiveTab('my-listings')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'my-listings' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-zinc-700'
              }`}
            >
              My Listings
            </button>
          )}
        </div>

        {/* Content */}
        <div className="mb-8">
          {error && (
            <div className="bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {loading || myListingsLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-4'}>
              {(activeTab === 'browse' ? listings : myListings).map(renderListingCard)}
            </div>
          )}

          {(activeTab === 'browse' ? listings : myListings).length === 0 && !loading && !myListingsLoading && (
            <div className="text-center py-12">
              <FiBook className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                {activeTab === 'browse' ? 'No listings found' : 'No listings yet'}
              </h3>
              <p className="text-gray-500 dark:text-gray-500">
                {activeTab === 'browse' 
                  ? 'Try adjusting your filters or search terms' 
                  : 'Start selling your books to see them here'
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Market;
