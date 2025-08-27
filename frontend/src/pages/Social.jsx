import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiSearch, 
  FiPlus, 
  FiFilter, 
  FiX,
  FiMessageCircle,
  FiUser,
  FiTag,
  FiCalendar,
  FiHeart,
  FiEye,
  FiImage,
  FiVideo,
  FiGlobe,
  FiUsers,
  FiLock
} from 'react-icons/fi';
import { fetchPosts, searchPosts, createPost, setFilters, clearFilters } from '../store/social';
import { setSearchQuery, clearSearch } from '../store/ui';
import toast from 'react-hot-toast';

const Social = () => {
  const dispatch = useDispatch();
  const { posts, searchResults, loading, error, filters } = useSelector((state) => state.social);
  const { searchQuery } = useSelector((state) => state.ui);
  const { isAuthenticated } = useSelector((state) => state.auth);
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [newPost, setNewPost] = useState({
    text: '',
    tags: '',
    visibility: 'public',
    images: '',
    video: ''
  });

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchPosts());
    }
  }, [dispatch, isAuthenticated]);

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearching(true);
      dispatch(searchPosts(searchQuery.trim()));
    }
  };

  // Clear search
  const handleClearSearch = () => {
    dispatch(clearSearch());
    dispatch(clearFilters());
    setIsSearching(false);
  };

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    dispatch(setFilters({ [filterType]: value }));
  };

  // Create new post
  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPost.text.trim()) {
      toast.error('Please write something in your post');
      return;
    }

    const postData = {
      ...newPost,
      tags: newPost.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      images: newPost.images ? [newPost.images] : []
    };

    try {
      await dispatch(createPost(postData)).unwrap();
      setShowCreateModal(false);
      setNewPost({ text: '', tags: '', visibility: 'public', images: '', video: '' });
      toast.success('Post created successfully!');
    } catch (error) {
      toast.error(error || 'Failed to create post');
    }
  };

  // Get display posts (search results or all posts)
  const displayPosts = isSearching ? searchResults : posts;

  // Filter posts based on current filters
  const filteredPosts = displayPosts.filter(post => {
    if (filters.visibility !== 'all' && post.visibility !== filters.visibility) return false;
    return true;
  });

  return (
    <div className="min-h-screen pt-20 px-6 bg-gray-50 dark:bg-zinc-900">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-lg border border-gray-100 dark:border-zinc-700 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Social Feed
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Connect with fellow book lovers and share your reading journey
              </p>
            </div>
            
            {isAuthenticated && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FiPlus className="h-5 w-5" />
                Create Post
              </button>
            )}
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-lg border border-gray-100 dark:border-zinc-700 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            {/* Search Bar */}
            <div className="flex-1 max-w-md">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="Search posts, tags, or users..."
                  value={searchQuery}
                  onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-5 w-5" />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white p-1 rounded-md hover:bg-blue-700 transition-colors"
                >
                  <FiSearch className="h-3 w-3" />
                </button>
              </form>
            </div>

            {/* Filter Toggle */}
            <div className="flex items-center gap-4">
              {isSearching && (
                <button
                  onClick={handleClearSearch}
                  className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 transition-colors"
                >
                  <FiX className="h-4 w-4" />
                  Clear Search
                </button>
              )}
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors"
              >
                <FiFilter className="h-4 w-4" />
                Filters
              </button>
            </div>
          </div>

          {/* Filters Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-6 pt-6 border-t border-gray-200 dark:border-zinc-700"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Filter by Visibility
                  </label>
                  <select
                    value={filters.visibility}
                    onChange={(e) => handleFilterChange('visibility', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Posts</option>
                    <option value="public">Public Only</option>
                    <option value="followers">Followers Only</option>
                  </select>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Posts Feed */}
        <div className="space-y-6">
          {!isAuthenticated ? (
            <div className="text-center py-12">
              <FiMessageCircle className="h-16 w-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Join the Conversation
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Sign in to view and create posts
              </p>
            </div>
          ) : loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-300">Loading posts...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600 dark:text-red-400">{error}</p>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <FiMessageCircle className="h-16 w-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {isSearching ? 'No posts found' : 'No posts yet'}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {isSearching ? 'Try adjusting your search terms' : 'Be the first to share something!'}
              </p>
            </div>
          ) : (
            filteredPosts.map((post) => (
              <motion.div
                key={post._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-zinc-800 rounded-2xl shadow-lg border border-gray-100 dark:border-zinc-700 p-6 hover:shadow-xl transition-shadow"
              >
                {/* Post Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <FiUser className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {post.author?.username || 'Anonymous'}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        {post.visibility === 'public' && <FiGlobe className="h-3 w-3" />}
                        {post.visibility === 'followers' && <FiUsers className="h-3 w-3" />}
                        {post.visibility === 'private' && <FiLock className="h-3 w-3" />}
                        <span className="capitalize">{post.visibility}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Post Content */}
                <div className="mb-4">
                  <p className="text-gray-900 dark:text-white whitespace-pre-wrap">
                    {post.text}
                  </p>
                </div>

                {/* Post Media */}
                {post.images && post.images.length > 0 && (
                  <div className="mb-4">
                    <img
                      src={post.images[0]}
                      alt="Post"
                      className="w-full max-h-96 object-cover rounded-lg"
                    />
                  </div>
                )}

                {post.video && (
                  <div className="mb-4">
                    <video
                      src={post.video}
                      controls
                      className="w-full rounded-lg"
                    />
                  </div>
                )}

                {/* Post Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 text-xs rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Post Actions */}
                <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                  <button className="flex items-center gap-1 hover:text-blue-600 transition-colors">
                    <FiHeart className="h-4 w-4" />
                    <span>Like</span>
                  </button>
                  <button className="flex items-center gap-1 hover:text-blue-600 transition-colors">
                    <FiMessageCircle className="h-4 w-4" />
                    <span>Comment</span>
                  </button>
                  <button className="flex items-center gap-1 hover:text-blue-600 transition-colors">
                    <FiEye className="h-4 w-4" />
                    <span>View</span>
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Create Post Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-zinc-800 rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-200 dark:border-zinc-700">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Create New Post</h2>
              </div>
              
              <form onSubmit={handleCreatePost} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    What's on your mind? *
                  </label>
                  <textarea
                    value={newPost.text}
                    onChange={(e) => setNewPost({ ...newPost, text: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Share your thoughts about books, reading, or anything else..."
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tags
                  </label>
                  <input
                    type="text"
                    value={newPost.tags}
                    onChange={(e) => setNewPost({ ...newPost, tags: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter tags separated by commas..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={newPost.images}
                    onChange={(e) => setNewPost({ ...newPost, images: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter image URL..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Video URL
                  </label>
                  <input
                    type="url"
                    value={newPost.video}
                    onChange={(e) => setNewPost({ ...newPost, video: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter video URL..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Visibility
                  </label>
                  <select
                    value={newPost.visibility}
                    onChange={(e) => setNewPost({ ...newPost, visibility: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="public">Public</option>
                    <option value="followers">Followers Only</option>
                    <option value="private">Private</option>
                  </select>
                </div>
                
                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-zinc-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Create Post
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Social;
