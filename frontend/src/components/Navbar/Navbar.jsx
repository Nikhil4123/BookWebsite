/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiMenu, FiX, FiSearch, FiShoppingCart, FiHeart, FiUser, FiBookOpen, FiHome, FiGrid, FiLogOut, FiSettings, FiBookmark, FiSun, FiMoon } from 'react-icons/fi';
import { logout } from '../../store/auth';
import { toggleTheme } from '../../store/ui';
import toast from 'react-hot-toast';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  
  const dispatch = useDispatch();
  const location = useLocation();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { items: cartItems } = useSelector((state) => state.cart);
  const { items: favoriteItems } = useSelector((state) => state.favorites);
  const { theme } = useSelector((state) => state.ui);

  const cartItemCount = cartItems?.length || 0;
  const favoriteItemCount = favoriteItems?.length || 0;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    setIsUserMenuOpen(false);
    toast.success('Logged out successfully');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to search results page
      window.location.href = `/all-books?search=${encodeURIComponent(searchQuery)}`;
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navItems = [
    { name: 'Home', path: '/', icon: FiHome },
    { name: 'Books', path: '/all-books', icon: FiBookOpen },
    { name: 'Market', path: '/market', icon: FiGrid },
    { name: 'Blog', path: '/blog', icon: FiBookmark },
    { name: 'Social', path: '/social', icon: FiUser }
  ];

  const isActivePath = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Main Navbar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? theme === 'dark'
              ? 'bg-gray-900/95 backdrop-blur-md shadow-lg border-b border-gray-700'
              : 'bg-white/95 backdrop-blur-md shadow-lg border-b border-amber-100'
            : theme === 'dark'
              ? 'bg-gray-900/20 backdrop-blur-sm'
              : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-3"
            >
              <Link to="/" className="flex items-center space-x-3 group">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:rotate-12">
                    <FiBookOpen className="w-7 h-7 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse"></div>
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                    BookVerse
                  </h1>
                  <p className="text-xs text-gray-500 -mt-1">Your Literary Universe</p>
                </div>
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navItems.map((item) => (
                <motion.div
                  key={item.name}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to={item.path}
                    className={`relative px-4 py-2 rounded-xl font-medium transition-all duration-300 group ${
                      isActivePath(item.path)
                        ? theme === 'dark'
                          ? 'text-amber-400 bg-amber-900/30'
                          : 'text-amber-600 bg-amber-50'
                        : theme === 'dark'
                          ? 'text-gray-300 hover:text-amber-400 hover:bg-amber-900/20'
                          : 'text-gray-700 hover:text-amber-600 hover:bg-amber-50'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <item.icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </div>
                    {isActivePath(item.path) && (
                      <motion.div
                        layoutId="activeTab"
                        className={`absolute inset-0 rounded-xl -z-10 ${
                          theme === 'dark'
                            ? 'bg-gradient-to-r from-amber-900/40 to-orange-900/40'
                            : 'bg-gradient-to-r from-amber-100 to-orange-100'
                        }`}
                        initial={false}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              {/* Search Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 text-gray-600 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-all duration-200"
              >
                <FiSearch className="w-5 h-5" />
              </motion.button>

              {/* Cart */}
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="relative"
              >
                <Link
                  to="/cart"
                  className="p-2 text-gray-600 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-all duration-200 relative"
                >
                  <FiShoppingCart className="w-5 h-5" />
                  {cartItemCount > 0 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full flex items-center justify-center font-bold"
                    >
                      {cartItemCount > 9 ? '9+' : cartItemCount}
                    </motion.div>
                  )}
                </Link>
              </motion.div>

              {/* Theme Toggle */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => dispatch(toggleTheme())}
                className="p-2 text-gray-600 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-all duration-200"
              >
                {theme === 'dark' ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
              </motion.button>

              {/* Favorites */}
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="relative"
              >
                <Link
                  to="/favorites"
                  className="p-2 text-gray-600 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-all duration-200 relative"
                >
                  <FiHeart className="w-5 h-5" />
                  {favoriteItemCount > 0 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs rounded-full flex items-center justify-center font-bold"
                    >
                      {favoriteItemCount > 9 ? '9+' : favoriteItemCount}
                    </motion.div>
                  )}
                </Link>
              </motion.div>

              {/* User Menu */}
              {isAuthenticated ? (
                <div className="relative">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2 p-2 text-gray-600 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-all duration-200"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center">
                      <FiUser className="w-4 h-4 text-white" />
                    </div>
                    <span className="hidden sm:block text-sm font-medium">{user?.name || 'User'}</span>
                  </motion.button>

                  {/* User Dropdown */}
                  <AnimatePresence>
                    {isUserMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className={`absolute right-0 mt-2 w-48 rounded-2xl shadow-xl border py-2 z-50 ${
                          theme === 'dark' 
                            ? 'bg-gray-800 border-gray-700' 
                            : 'bg-white border-amber-100'
                        }`}
                      >
                        <div className={`px-4 py-3 border-b ${
                          theme === 'dark' ? 'border-gray-700' : 'border-amber-100'
                        }`}>
                          <p className={`text-sm font-medium ${
                            theme === 'dark' ? 'text-white' : 'text-gray-900'
                          }`}>{user?.name || 'User'}</p>
                          <p className={`text-xs ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                          }`}>{user?.email}</p>
                        </div>
                        <div className="py-1">
                          <Link
                            to="/profile"
                            className={`flex items-center px-4 py-2 text-sm transition-colors duration-200 ${
                              theme === 'dark'
                                ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                : 'text-gray-700 hover:bg-amber-50 hover:text-amber-600'
                            }`}
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <FiUser className="w-4 h-4 mr-3" />
                            Profile
                          </Link>
                          <Link
                            to="/favorites"
                            className={`flex items-center px-4 py-2 text-sm transition-colors duration-200 ${
                              theme === 'dark'
                                ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                : 'text-gray-700 hover:bg-amber-50 hover:text-amber-600'
                            }`}
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <FiHeart className="w-4 h-4 mr-3" />
                            Favorites
                          </Link>
                          <button
                            onClick={handleLogout}
                            className={`flex items-center w-full px-4 py-2 text-sm transition-colors duration-200 ${
                              theme === 'dark'
                                ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                : 'text-gray-700 hover:bg-amber-50 hover:text-amber-600'
                            }`}
                          >
                            <FiLogOut className="w-4 h-4 mr-3" />
                            Logout
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link
                    to="/login"
                    className="px-4 py-2 text-gray-700 hover:text-amber-600 hover:bg-amber-50 rounded-xl font-medium transition-all duration-200"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-medium hover:from-amber-600 hover:to-orange-600 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    Sign Up
                  </Link>
                </div>
              )}

              {/* Mobile Menu Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-gray-600 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-all duration-200"
              >
                {isMobileMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className={`border-t backdrop-blur-md ${
                theme === 'dark' 
                  ? 'border-gray-700 bg-gray-900/95' 
                  : 'border-amber-100 bg-white/95'
              }`}
            >
              <div className="max-w-2xl mx-auto px-4 py-4">
                <form onSubmit={handleSearch} className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for books, authors, or genres..."
                    className="w-full px-4 py-3 pl-12 bg-amber-50 border border-amber-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
                    autoFocus
                  />
                  <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-amber-500" />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl text-sm font-medium hover:from-amber-600 hover:to-orange-600 transition-all duration-200"
                  >
                    Search
                  </button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            
            {/* Menu Content */}
            <div className={`absolute right-0 top-0 h-full w-80 shadow-2xl ${
              theme === 'dark' ? 'bg-gray-900' : 'bg-white'
            }`}>
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <h2 className={`text-xl font-bold ${
                    theme === 'dark' ? 'text-white' : 'text-gray-800'
                  }`}>Menu</h2>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`p-2 rounded-xl transition-colors duration-200 ${
                      theme === 'dark'
                        ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <FiX className="w-6 h-6" />
                  </button>
                </div>

                {/* Mobile Navigation */}
                <nav className="space-y-2">
                  {navItems.map((item) => (
                    <Link
                      key={item.name}
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                        isActivePath(item.path)
                          ? theme === 'dark'
                            ? 'text-amber-400 bg-amber-900/30'
                            : 'text-amber-600 bg-amber-50'
                          : theme === 'dark'
                            ? 'text-gray-300 hover:text-amber-400 hover:bg-amber-900/30'
                            : 'text-gray-700 hover:text-amber-600 hover:bg-amber-50'
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.name}</span>
                    </Link>
                  ))}
                </nav>

                {/* User Section */}
                {isAuthenticated ? (
                  <div className={`mt-8 pt-6 border-t ${
                    theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                  }`}>
                    <div className={`px-4 py-3 rounded-xl mb-4 ${
                      theme === 'dark' ? 'bg-gray-700' : 'bg-amber-50'
                    }`}>
                      <p className={`text-sm font-medium ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>{user?.name || 'User'}</p>
                      <p className={`text-xs ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                      }`}>{user?.email}</p>
                    </div>
                    <div className="space-y-2">
                      <Link
                        to="/profile"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors duration-200 ${
                          theme === 'dark'
                            ? 'text-gray-300 hover:text-white hover:bg-gray-700'
                            : 'text-gray-700 hover:text-amber-600 hover:bg-amber-50'
                        }`}
                      >
                        <FiUser className="w-5 h-5" />
                        <span>Profile</span>
                      </Link>
                      <Link
                        to="/favorites"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors duration-200 ${
                          theme === 'dark'
                            ? 'text-gray-300 hover:text-white hover:bg-gray-700'
                            : 'text-gray-700 hover:text-amber-600 hover:bg-amber-50'
                        }`}
                      >
                        <FiHeart className="w-5 h-5" />
                        <span>Favorites</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className={`flex items-center w-full space-x-3 px-4 py-3 rounded-xl transition-colors duration-200 ${
                          theme === 'dark'
                            ? 'text-gray-300 hover:text-white hover:bg-gray-700'
                            : 'text-gray-700 hover:text-amber-600 hover:bg-amber-50'
                        }`}
                      >
                        <FiLogOut className="w-5 h-5" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className={`mt-8 pt-6 border-t space-y-3 ${
                    theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                  }`}>
                    <Link
                      to="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`block w-full px-4 py-3 text-center border rounded-xl font-medium transition-all duration-200 ${
                        theme === 'dark'
                          ? 'text-gray-300 border-gray-600 hover:border-blue-500 hover:text-blue-400'
                          : 'text-gray-700 border-gray-300 hover:border-amber-500 hover:text-amber-600'
                      }`}
                    >
                      Login
                    </Link>
                    <Link
                      to="/signup"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block w-full px-4 py-3 text-center bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-medium hover:from-amber-600 hover:to-orange-600 transition-all duration-200"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer for fixed navbar */}
      <div className="h-20" />
    </>
  );
};

export default Navbar;
