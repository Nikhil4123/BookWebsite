/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { 
  FiEdit, FiSave, FiX, FiUser, FiMail, FiMapPin, FiBook, 
  FiHeart, FiShoppingCart, FiStar, FiTrendingUp, FiCalendar,
  FiSettings, FiLogOut, FiCamera, FiPlus, FiGrid, FiList
} from 'react-icons/fi';
import { fetchUserProfile, updateUserProfile, logout } from '../store/auth';
import { fetchMyListings } from '../store/market';
import toast from 'react-hot-toast';

const Profile = () => {
  const dispatch = useDispatch();
  const { user, loading, profileLoading } = useSelector((state) => state.auth);
  const { myListings } = useSelector((state) => state.market);
  
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [viewMode, setViewMode] = useState('grid');
  const [isVisible, setIsVisible] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    address: '',
    bio: '',
    favoriteGenres: [],
    studyInterests: [],
    readingStatus: 'none',
    privacy: 'public'
  });

  useEffect(() => {
    dispatch(fetchUserProfile());
    dispatch(fetchMyListings());
    
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        address: user.address || '',
        bio: user.bio || '',
        favoriteGenres: user.favoriteGenres || [],
        studyInterests: user.studyInterests || [],
        readingStatus: user.readingStatus || 'none',
        privacy: user.privacy || 'public'
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      await dispatch(updateUserProfile(formData)).unwrap();
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error(error || 'Failed to update profile');
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out successfully');
  };

  // Dummy data for stats
  const stats = [
    { label: 'Books Read', value: '24', icon: FiBook, color: 'blue' },
    { label: 'Favorites', value: '12', icon: FiHeart, color: 'red' },
    { label: 'Market Listings', value: myListings.length.toString(), icon: FiShoppingCart, color: 'green' },
    { label: 'Reviews', value: '8', icon: FiStar, color: 'yellow' }
  ];

  // Dummy reading history
  const readingHistory = [
    {
      id: 1,
      title: 'The Midnight Library',
      author: 'Matt Haig',
      cover: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1602190253i/52578297.jpg',
      rating: 4.5,
      date: '2024-01-15',
      status: 'completed'
    },
    {
      id: 2,
      title: 'Atomic Habits',
      author: 'James Clear',
      cover: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1655988385i/40121378.jpg',
      rating: 4.8,
      date: '2024-01-10',
      status: 'completed'
    },
    {
      id: 3,
      title: 'Project Hail Mary',
      author: 'Andy Weir',
      cover: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1597695864i/54493401.jpg',
      rating: 4.7,
      date: '2024-01-05',
      status: 'currently_reading'
    }
  ];

  const animationVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  if (loading || profileLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-black dark:via-zinc-950 dark:to-zinc-900 pt-20">
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-black dark:via-zinc-950 dark:to-zinc-900 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          variants={animationVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
        >
          {/* Profile Header */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-lg border border-gray-200 dark:border-zinc-700 p-8 mb-8">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between">
              <div className="flex items-center space-x-6 mb-6 lg:mb-0">
                <div className="relative">
                  <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {user?.username?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <button className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors">
                    <FiCamera className="w-4 h-4" />
                  </button>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {user?.username || 'User'}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-300 mb-2">
                    {user?.email || 'user@example.com'}
                  </p>
                  <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
                    <FiCalendar className="w-4 h-4 mr-1" />
                    <span>Member since {new Date().toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-3">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleSave}
                      className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
                    >
                      <FiSave className="w-4 h-4 mr-2" />
                      Save
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center"
                    >
                      <FiX className="w-4 h-4 mr-2" />
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                    >
                      <FiEdit className="w-4 h-4 mr-2" />
                      Edit Profile
                    </button>
                    <button
                      onClick={handleLogout}
                      className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center"
                    >
                      <FiLogOut className="w-4 h-4 mr-2" />
                      Logout
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={animationVariants}
                className="bg-white dark:bg-zinc-900 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-zinc-700 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">{stat.label}</p>
                  </div>
                  <div className={`w-12 h-12 bg-${stat.color}-100 dark:bg-${stat.color}-900/20 rounded-full flex items-center justify-center`}>
                    <stat.icon className={`w-6 h-6 text-${stat.color}-600 dark:text-${stat.color}-400`} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Tabs */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-lg border border-gray-200 dark:border-zinc-700 mb-8">
            <div className="border-b border-gray-200 dark:border-zinc-700">
              <nav className="flex space-x-8 px-6">
                {[
                  { id: 'overview', label: 'Overview', icon: FiUser },
                  { id: 'reading', label: 'Reading History', icon: FiBook },
                  { id: 'market', label: 'Market Activity', icon: FiShoppingCart },
                  { id: 'settings', label: 'Settings', icon: FiSettings }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                  >
                    <tab.icon className="w-4 h-4 mr-2" />
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-6">
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {isEditing ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Username
                        </label>
                        <input
                          type="text"
                          name="username"
                          value={formData.username}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Address
                        </label>
                        <input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Bio
                        </label>
                        <textarea
                          name="bio"
                          value={formData.bio}
                          onChange={handleInputChange}
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                          placeholder="Tell us about yourself..."
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Personal Information</h3>
                        <div className="space-y-3">
                          <div className="flex items-center">
                            <FiUser className="w-5 h-5 text-gray-400 mr-3" />
                            <span className="text-gray-700 dark:text-gray-300">{user?.username || 'Not set'}</span>
                          </div>
                          <div className="flex items-center">
                            <FiMail className="w-5 h-5 text-gray-400 mr-3" />
                            <span className="text-gray-700 dark:text-gray-300">{user?.email || 'Not set'}</span>
                          </div>
                          <div className="flex items-center">
                            <FiMapPin className="w-5 h-5 text-gray-400 mr-3" />
                            <span className="text-gray-700 dark:text-gray-300">{user?.address || 'Not set'}</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">About</h3>
                        <p className="text-gray-700 dark:text-gray-300">
                          {user?.bio || 'No bio added yet. Click "Edit Profile" to add one!'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Reading History Tab */}
              {activeTab === 'reading' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Reading History</h3>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600' : 'text-gray-400'}`}
                      >
                        <FiGrid className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600' : 'text-gray-400'}`}
                      >
                        <FiList className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
                    {readingHistory.map((book) => (
                      <div
                        key={book.id}
                        className={`bg-gray-50 dark:bg-zinc-800 rounded-lg p-4 border border-gray-200 dark:border-zinc-700 ${
                          viewMode === 'list' ? 'flex items-center space-x-4' : ''
                        }`}
                      >
                        <img
                          src={book.cover}
                          alt={book.title}
                          className={`rounded-lg object-cover ${
                            viewMode === 'list' ? 'w-16 h-20' : 'w-full h-48'
                          }`}
                        />
                        <div className={viewMode === 'list' ? 'flex-1' : 'mt-4'}>
                          <h4 className="font-semibold text-gray-900 dark:text-white">{book.title}</h4>
                          <p className="text-gray-600 dark:text-gray-300 text-sm">{book.author}</p>
                          <div className="flex items-center mt-2">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <FiStar
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < Math.floor(book.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-gray-500 ml-2">{book.rating}</span>
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-gray-500">{book.date}</span>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              book.status === 'completed' 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                                : 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                            }`}>
                              {book.status === 'completed' ? 'Completed' : 'Reading'}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Market Activity Tab */}
              {activeTab === 'market' && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">My Market Listings</h3>
                  {myListings.length === 0 ? (
                    <div className="text-center py-12">
                      <FiShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No listings yet</h4>
                      <p className="text-gray-600 dark:text-gray-300">Start selling your books to see them here!</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {myListings.slice(0, 6).map((listing) => (
                        <div key={listing._id} className="bg-gray-50 dark:bg-zinc-800 rounded-lg p-4 border border-gray-200 dark:border-zinc-700">
                          <div className="aspect-[3/4] bg-gray-200 dark:bg-zinc-700 rounded-lg mb-3 flex items-center justify-center">
                            {listing.bookRef?.url ? (
                              <img src={listing.bookRef.url} alt={listing.bookRef.title} className="w-full h-full object-cover rounded-lg" />
                            ) : (
                              <FiBook className="w-12 h-12 text-gray-400" />
                            )}
                          </div>
                          <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">
                            {listing.bookRef?.title || 'Untitled Book'}
                          </h4>
                          <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
                            ${listing.price}
                          </p>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            listing.status === 'active' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                              : listing.status === 'pending_verification'
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                          }`}>
                            {listing.status.replace('_', ' ')}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === 'settings' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Account Settings</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Reading Status
                        </label>
                        <select
                          name="readingStatus"
                          value={formData.readingStatus}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="none">Not reading</option>
                          <option value="currently_reading">Currently Reading</option>
                          <option value="completed">Completed</option>
                          <option value="on_hold">On Hold</option>
                          <option value="dropped">Dropped</option>
                          <option value="plan_to_read">Plan to Read</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Privacy
                        </label>
                        <select
                          name="privacy"
                          value={formData.privacy}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="public">Public</option>
                          <option value="followers">Followers Only</option>
                          <option value="private">Private</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;