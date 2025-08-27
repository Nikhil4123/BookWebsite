/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiSearch, 
  FiShoppingCart, 
  FiMenu, 
  FiX, 
  FiHeart,
  FiBookOpen,
  FiHome,
  FiGrid,
  FiMoon,
  FiSun
} from 'react-icons/fi';
import { logout } from '../../store/auth';
import { clearCart } from '../../store/cart';
import { setSearchQuery } from '../../store/ui';
import { searchBooks } from '../../store/books';
import { searchBlogs } from '../../store/blogs';
import { searchPosts } from '../../store/social';
import toast from 'react-hot-toast';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { totalItems } = useSelector((state) => state.cart);
  const { searchQuery } = useSelector((state) => state.ui);
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isDark, setIsDark] = useState(false);
  
  const userMenuRef = useRef(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Initialize dark mode from localStorage/system preference
  useEffect(() => {
    const stored = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const activeDark = stored ? stored === 'dark' : prefersDark;
    setIsDark(activeDark);
  }, []);

  const toggleTheme = () => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  // Handle click outside user menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const currentPath = location.pathname;
      
      if (currentPath === '/blog') {
        dispatch(searchBlogs(searchQuery.trim()));
      } else if (currentPath === '/social') {
        dispatch(searchPosts(searchQuery.trim()));
      } else {
        dispatch(searchBooks(searchQuery.trim()));
        navigate('/books');
      }
    }
  };

  // Handle logout
  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCart());
    setShowUserMenu(false);
    setShowMobileMenu(false);
    toast.success('Logged out successfully');
    navigate('/');
  };

  // Navigation items
  const navItems = [
    { name: 'Home', path: '/', icon: FiHome },
    { name: 'Books', path: '/books', icon: FiBookOpen },
    { name: 'Market', path: '/market', icon: FiGrid },
    { name: 'Blog', path: '/blog', icon: FiBookOpen },
    { name: 'Social', path: '/social', icon: FiHeart },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white/95 dark:bg-zinc-900/90 backdrop-blur-md shadow-lg border-b border-gray-200 dark:border-zinc-800`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2"
            >
              <FiBookOpen className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900 dark:text-white">BookHub</span>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
      <Link 
                key={item.name}
                to={item.path}
                className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === item.path
                    ? 'text-blue-600 bg-blue-50 dark:bg-blue-500/10'
                    : 'text-gray-700 dark:text-gray-200 hover:text-blue-600 hover:bg-gray-50 dark:hover:bg-zinc-800'
                }`}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.name}</span>
              </Link>
            ))}
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder={
                    location.pathname === '/blog' ? 'Search blogs...' :
                    location.pathname === '/social' ? 'Search posts...' :
                    'Search books...'
                  }
                  value={searchQuery}
                  onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                  className="w-64 pl-10 pr-4 py-2 border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-4 w-4" />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white p-1 rounded-md hover:bg-blue-700 transition-colors"
                >
                  <FiSearch className="h-3 w-3" />
                </button>
              </form>
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
              aria-label="Toggle theme"
              title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
            >
              {isDark ? <FiSun className="h-5 w-5" /> : <FiMoon className="h-5 w-5" />}
            </button>
            {/* Cart */}
            {isAuthenticated && (
              <Link to="/cart" className="relative">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 text-gray-700 dark:text-gray-200 hover:text-blue-600 transition-colors"
                >
                  <FiShoppingCart className="h-6 w-6" />
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </motion.div>
      </Link>
            )}

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium text-sm">
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <span className="hidden lg:block text-sm font-medium text-gray-700 dark:text-gray-200">
                    {user?.name || 'User'}
                  </span>
                </button>

                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-48 bg-white dark:bg-zinc-900 rounded-lg shadow-lg border border-gray-200 dark:border-zinc-800 py-2"
                    >
        <Link 
          to="/profile" 
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
                        onClick={() => setShowUserMenu(false)}
        >
                        Profile
        </Link>
        <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                      >
                        Logout
        </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
    ) : (
              <div className="flex items-center space-x-2">
        <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 transition-colors"
        >
                  Login
        </Link>
        <Link
                  to="/signup"
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
                  Sign Up
        </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden p-2 text-gray-700 dark:text-gray-200 hover:text-blue-600 transition-colors"
            >
              {showMobileMenu ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
            </button>
        </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-4">
                      <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder={
                  location.pathname === '/blog' ? 'Search blogs...' :
                  location.pathname === '/social' ? 'Search posts...' :
                  'Search books...'
                }
                value={searchQuery}
                onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white p-1 rounded-md hover:bg-blue-700 transition-colors"
        >
              <FiSearch className="h-3 w-3" />
        </button>
          </form>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {showMobileMenu && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white dark:bg-zinc-900 border-t border-gray-200 dark:border-zinc-800"
          >
            <div className="px-4 py-2 space-y-1">
              {navItems.map((item) => (
            <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === item.path
                      ? 'text-blue-600 bg-blue-50 dark:bg-blue-500/10'
                      : 'text-gray-700 dark:text-gray-200 hover:text-blue-600 hover:bg-gray-50 dark:hover:bg-zinc-800'
                  }`}
                  onClick={() => setShowMobileMenu(false)}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
            </Link>
              ))}
        </div>
          </motion.div>
      )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
