import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiSearch, 
  FiPlus, 
  FiFilter, 
  FiX,
  FiBookOpen,
  FiUser,
  FiTag,
  FiCalendar
} from 'react-icons/fi';
import { fetchBlogs, searchBlogs, createBlog, setFilters, clearFilters } from '../store/blogs';
import { setSearchQuery, clearSearch } from '../store/ui';
import toast from 'react-hot-toast';

const Blog = () => {
  const dispatch = useDispatch();
  const { blogs, searchResults, loading, error, filters } = useSelector((state) => state.blogs);
  const { searchQuery } = useSelector((state) => state.ui);
  const { isAuthenticated } = useSelector((state) => state.auth);
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [newBlog, setNewBlog] = useState({
    title: '',
    body: '',
    tags: '',
    coverImage: ''
  });

  useEffect(() => {
    dispatch(fetchBlogs());
  }, [dispatch]);

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearching(true);
      dispatch(searchBlogs(searchQuery.trim()));
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

  // Create new blog
  const handleCreateBlog = async (e) => {
    e.preventDefault();
    if (!newBlog.title.trim() || !newBlog.body.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    const blogData = {
      ...newBlog,
      tags: newBlog.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
    };

    try {
      await dispatch(createBlog(blogData)).unwrap();
      setShowCreateModal(false);
      setNewBlog({ title: '', body: '', tags: '', coverImage: '' });
      toast.success('Blog created successfully!');
    } catch (error) {
      toast.error(error || 'Failed to create blog');
    }
  };

  // Get display blogs (search results or all blogs)
  const displayBlogs = isSearching ? searchResults : blogs;

  // Filter blogs based on current filters
  const filteredBlogs = displayBlogs.filter(blog => {
    if (filters.tag && !blog.tags?.includes(filters.tag)) return false;
    if (filters.author && blog.author?.username !== filters.author) return false;
    return true;
  });

  return (
    <div className="min-h-screen pt-20 px-6 bg-gray-50 dark:bg-zinc-900">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-lg border border-gray-100 dark:border-zinc-700 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Blog Community
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Discover, share, and discuss your favorite books and reading experiences
              </p>
            </div>
            
            {isAuthenticated && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FiPlus className="h-5 w-5" />
                Write Blog
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
                  placeholder="Search blogs, authors, or tags..."
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Filter by Tag
                    </label>
                    <input
                      type="text"
                      placeholder="Enter tag..."
                      value={filters.tag}
                      onChange={(e) => handleFilterChange('tag', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Filter by Author
                    </label>
                    <input
                      type="text"
                      placeholder="Enter author username..."
                      value={filters.author}
                      onChange={(e) => handleFilterChange('author', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Blog List */}
        <div className="space-y-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-300">Loading blogs...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600 dark:text-red-400">{error}</p>
            </div>
          ) : filteredBlogs.length === 0 ? (
            <div className="text-center py-12">
              <FiBookOpen className="h-16 w-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {isSearching ? 'No blogs found' : 'No blogs yet'}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {isSearching ? 'Try adjusting your search terms' : 'Be the first to share your thoughts!'}
              </p>
            </div>
          ) : (
            filteredBlogs.map((blog) => (
              <motion.div
                key={blog._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-zinc-800 rounded-2xl shadow-lg border border-gray-100 dark:border-zinc-700 p-6 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-start gap-4">
                  {blog.coverImage && (
                    <img
                      src={blog.coverImage}
                      alt={blog.title}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                  )}
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {blog.title}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                      {blog.body}
                    </p>
                    
                    <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <FiUser className="h-4 w-4" />
                        <span>{blog.author?.username || 'Anonymous'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FiCalendar className="h-4 w-4" />
                        <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                      </div>
                      {blog.tags && blog.tags.length > 0 && (
                        <div className="flex items-center gap-1">
                          <FiTag className="h-4 w-4" />
                          <span>{blog.tags.join(', ')}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Create Blog Modal */}
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
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Create New Blog</h2>
              </div>
              
              <form onSubmit={handleCreateBlog} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={newBlog.title}
                    onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter blog title..."
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Content *
                  </label>
                  <textarea
                    value={newBlog.body}
                    onChange={(e) => setNewBlog({ ...newBlog, body: e.target.value })}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Write your blog content..."
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tags
                  </label>
                  <input
                    type="text"
                    value={newBlog.tags}
                    onChange={(e) => setNewBlog({ ...newBlog, tags: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter tags separated by commas..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Cover Image URL
                  </label>
                  <input
                    type="url"
                    value={newBlog.coverImage}
                    onChange={(e) => setNewBlog({ ...newBlog, coverImage: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter image URL..."
                  />
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
                    Create Blog
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

export default Blog;
