import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiSearch, 
  FiFilter, 
  FiGrid, 
  FiList, 
  FiChevronDown,
  FiChevronUp,
  FiX,
  FiBookOpen,
  FiStar,
  FiTrendingUp
} from 'react-icons/fi';
import BookCard from '../components/BookCard/BookCard';
import { fetchBooks, setFilters, setCurrentPage, clearFilters } from '../store/books';
import { setSearchQuery, clearSearch } from '../store/ui';

const AllBooks = () => {
  const dispatch = useDispatch();
  const { books, loading, filters, pagination } = useSelector((state) => state.books);
  const { searchQuery } = useSelector((state) => state.ui);
  const { theme } = useSelector((state) => state.ui);
  
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState('newest');
  const [localFilters, setLocalFilters] = useState({
    category: 'all',
    priceRange: 'all',
    rating: 'all',
    availability: 'all'
  });

  useEffect(() => {
    dispatch(fetchBooks());
  }, [dispatch]);

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Search functionality would be implemented here
      console.log('Searching for:', searchQuery);
    }
  };

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    setLocalFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  // Apply filters
  const applyFilters = () => {
    dispatch(setFilters(localFilters));
    dispatch(setCurrentPage(1));
  };

  // Clear all filters
  const handleClearFilters = () => {
    setLocalFilters({
      category: 'all',
      priceRange: 'all',
      rating: 'all',
      availability: 'all'
    });
    dispatch(clearFilters());
  };

  // Handle sorting
  const handleSort = (sortType) => {
    setSortBy(sortType);
    // Sorting logic would be implemented here
  };

  // Get filtered and sorted books
  const getFilteredBooks = () => {
    let filtered = [...books];

    // Apply local filters
    if (localFilters.category !== 'all') {
      filtered = filtered.filter(book => book.category === localFilters.category);
    }

    if (localFilters.priceRange !== 'all') {
      const [min, max] = localFilters.priceRange.split('-').map(Number);
      filtered = filtered.filter(book => {
        const price = book.price || 0;
        if (max) {
          return price >= min && price <= max;
        }
        return price >= min;
      });
    }

    if (localFilters.rating !== 'all') {
      const minRating = Number(localFilters.rating);
      filtered = filtered.filter(book => (book.rating || 0) >= minRating);
    }

    if (localFilters.availability !== 'all') {
      filtered = filtered.filter(book => book.status === localFilters.availability);
    }

    // Apply sorting
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.publishedYear || 0) - new Date(a.publishedYear || 0));
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.publishedYear || 0) - new Date(b.publishedYear || 0));
        break;
      case 'price-low':
        filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'price-high':
        filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case 'rating':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'title':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        break;
    }

    return filtered;
  };

  const filteredBooks = getFilteredBooks();
  const totalBooks = filteredBooks.length;

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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className={`min-h-screen pt-20 ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-gray-900 to-gray-800' 
        : 'bg-gradient-to-br from-gray-50 to-blue-50'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Explore Our Book Collection
          </h1>
          <p className={`text-xl max-w-3xl mx-auto ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Discover thousands of books across all genres. From bestsellers to hidden gems, 
            find your next favorite read in our carefully curated collection.
          </p>
        </motion.div>

        {/* Search and Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-2xl shadow-lg border p-6 mb-8 ${
            theme === 'dark' 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white border-gray-100'
          }`}
        >
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            {/* Search Bar */}
            <div className="flex-1 max-w-md">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="Search books, authors, or genres..."
                  value={searchQuery}
                  onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    theme === 'dark'
                      ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400'
                      : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
                  }`}
                />
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white p-1 rounded-md hover:bg-blue-700 transition-colors"
                >
                  <FiSearch className="h-3 w-3" />
                </button>
              </form>
            </div>

            {/* View Mode Toggle */}
            <div className={`flex items-center space-x-2 rounded-lg p-1 ${
              theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
            }`}>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'grid' 
                    ? theme === 'dark'
                      ? 'bg-gray-600 text-blue-400 shadow-sm'
                      : 'bg-white text-blue-600 shadow-sm'
                    : theme === 'dark'
                      ? 'text-gray-300 hover:text-gray-100'
                      : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <FiGrid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'list' 
                    ? theme === 'dark'
                      ? 'bg-gray-600 text-blue-400 shadow-sm'
                      : 'bg-white text-blue-600 shadow-sm'
                    : theme === 'dark'
                      ? 'text-gray-300 hover:text-gray-100'
                      : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <FiList className="w-5 h-5" />
              </button>
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FiFilter className="w-5 h-5" />
              <span>Filters</span>
              {showFilters ? <FiChevronUp className="w-4 h-4" /> : <FiChevronDown className="w-4 h-4" />}
            </button>
          </div>

          {/* Filters Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className={`mt-6 pt-6 border-t ${
                  theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                }`}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Category Filter */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Category
                    </label>
                    <select
                      value={localFilters.category}
                      onChange={(e) => handleFilterChange('category', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        theme === 'dark'
                          ? 'border-gray-600 bg-gray-700 text-white'
                          : 'border-gray-300 bg-white text-gray-900'
                      }`}
                    >
                      <option value="all">All Categories</option>
                      <option value="fiction">Fiction</option>
                      <option value="non-fiction">Non-Fiction</option>
                      <option value="science">Science</option>
                      <option value="history">History</option>
                      <option value="biography">Biography</option>
                      <option value="fantasy">Fantasy</option>
                      <option value="mystery">Mystery</option>
                    </select>
                  </div>

                  {/* Price Range Filter */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Price Range
                    </label>
                    <select
                      value={localFilters.priceRange}
                      onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        theme === 'dark'
                          ? 'border-gray-600 bg-gray-700 text-white'
                          : 'border-gray-300 bg-white text-gray-900'
                      }`}
                    >
                      <option value="all">All Prices</option>
                      <option value="0-10">Under $10</option>
                      <option value="10-25">$10 - $25</option>
                      <option value="25-50">$25 - $50</option>
                      <option value="50-100">$50 - $100</option>
                      <option value="100-">Over $100</option>
                    </select>
                  </div>

                  {/* Rating Filter */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Minimum Rating
                    </label>
                    <select
                      value={localFilters.rating}
                      onChange={(e) => handleFilterChange('rating', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        theme === 'dark'
                          ? 'border-gray-600 bg-gray-700 text-white'
                          : 'border-gray-300 bg-white text-gray-900'
                      }`}
                    >
                      <option value="all">Any Rating</option>
                      <option value="4">4+ Stars</option>
                      <option value="3">3+ Stars</option>
                      <option value="2">2+ Stars</option>
                    </select>
                  </div>

                  {/* Availability Filter */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Availability
                    </label>
                    <select
                      value={localFilters.availability}
                      onChange={(e) => handleFilterChange('availability', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        theme === 'dark'
                          ? 'border-gray-600 bg-gray-700 text-white'
                          : 'text-gray-900'
                      }`}
                    >
                      <option value="all">All</option>
                      <option value="available">Available</option>
                      <option value="out_of_stock">Out of Stock</option>
                      <option value="coming_soon">Coming Soon</option>
                    </select>
                  </div>
                </div>

                {/* Filter Actions */}
                <div className="flex items-center justify-between mt-6">
                  <button
                    onClick={handleClearFilters}
                    className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    <FiX className="w-4 h-4" />
                    <span>Clear All</span>
                  </button>
                  <button
                    onClick={applyFilters}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Apply Filters
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Results Summary */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col sm:flex-row items-center justify-between mb-8"
        >
          <div className="flex items-center space-x-4 mb-4 sm:mb-0">
            <div className="flex items-center space-x-2">
              <FiBookOpen className="w-5 h-5 text-blue-600" />
              <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                Showing <span className={`font-semibold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>{totalBooks}</span> books
              </span>
            </div>
          </div>

          {/* Sort Options */}
          <div className="flex items-center space-x-4">
            <span className={`text-sm ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => handleSort(e.target.value)}
              className={`px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm ${
                theme === 'dark'
                  ? 'border-gray-600 bg-gray-700 text-white'
                  : 'border-gray-300 bg-white text-gray-900'
              }`}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="title">Title A-Z</option>
            </select>
          </div>
        </motion.div>

        {/* Books Grid/List */}
        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center items-center py-16"
          >
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>Loading books...</p>
            </div>
          </motion.div>
        ) : filteredBooks.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 ${
              theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
            }`}>
              <FiBookOpen className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className={`text-xl font-semibold mb-2 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>No books found</h3>
            <p className={`mb-6 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Try adjusting your filters or search terms to find what you're looking for.
            </p>
            <button
              onClick={handleClearFilters}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Clear Filters
            </button>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                : 'grid-cols-1'
            }`}
          >
            {filteredBooks.map((book, index) => (
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

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12 flex justify-center"
          >
            <div className="flex items-center space-x-2">
              <button
                onClick={() => dispatch(setCurrentPage(Math.max(1, pagination.currentPage - 1)))}
                disabled={pagination.currentPage === 1}
                className={`px-3 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${
                  theme === 'dark'
                    ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                Previous
              </button>
              
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => dispatch(setCurrentPage(page))}
                  className={`px-3 py-2 rounded-lg transition-colors ${
                    page === pagination.currentPage
                      ? 'bg-blue-600 text-white'
                      : theme === 'dark'
                        ? 'border border-gray-600 text-gray-300 hover:bg-gray-700'
                        : 'border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
              
              <button
                onClick={() => dispatch(setCurrentPage(Math.min(pagination.totalPages, pagination.currentPage + 1)))}
                disabled={pagination.currentPage === pagination.totalPages}
                className={`px-3 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${
                  theme === 'dark'
                    ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                Next
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AllBooks;