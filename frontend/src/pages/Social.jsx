/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { 
  FiHeart, FiMessageCircle, FiShare2, FiUser, FiMoreHorizontal,
  FiImage, FiVideo, FiSmile, FiSend, FiBookOpen, FiTrendingUp,
  FiFilter, FiSearch, FiGrid, FiList, FiClock, FiTag
} from 'react-icons/fi';
import { fetchPosts } from '../store/social';
import toast from 'react-hot-toast';

const Social = () => {
  const dispatch = useDispatch();
  const { posts, loading } = useSelector((state) => state.social);
  const { user } = useSelector((state) => state.auth);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [viewMode, setViewMode] = useState('feed');
  const [isVisible, setIsVisible] = useState(false);
  const [newPost, setNewPost] = useState({
    text: '',
    images: [],
    tags: []
  });

  useEffect(() => {
    dispatch(fetchPosts());
    
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, [dispatch]);

  // Filter posts based on search and filter
  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = selectedFilter === 'all' || 
                         (selectedFilter === 'book-reviews' && post.tags?.some(tag => tag.includes('BookReview'))) ||
                         (selectedFilter === 'reading-updates' && post.tags?.some(tag => tag.includes('CurrentlyReading'))) ||
                         (selectedFilter === 'book-club' && post.tags?.some(tag => tag.includes('BookClub')));
    
    return matchesSearch && matchesFilter;
  });

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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const handleLike = (postId) => {
    // TODO: Implement like functionality
    toast.success('Post liked!');
  };

  const handleComment = (postId) => {
    // TODO: Implement comment functionality
    toast.success('Comment feature coming soon!');
  };

  const handleShare = (postId) => {
    // TODO: Implement share functionality
    toast.success('Share feature coming soon!');
  };

  const handleCreatePost = (e) => {
    e.preventDefault();
    if (!newPost.text.trim()) {
      toast.error('Please write something to post');
      return;
    }
    // TODO: Implement create post functionality
    toast.success('Post created successfully!');
    setNewPost({ text: '', images: [], tags: [] });
  };

  if (loading) {
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          variants={animationVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Book Community
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Connect with fellow book lovers, share your reading journey, and discover new recommendations
            </p>
          </div>

          {/* Search and Filter Bar */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-lg border border-gray-200 dark:border-zinc-700 p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search posts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Filter */}
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'all', name: 'All Posts', icon: FiGrid },
                  { id: 'book-reviews', name: 'Book Reviews', icon: FiBookOpen },
                  { id: 'reading-updates', name: 'Reading Updates', icon: FiTrendingUp },
                  { id: 'book-club', name: 'Book Club', icon: FiUser }
                ].map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => setSelectedFilter(filter.id)}
                    className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedFilter === filter.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-700'
                    }`}
                  >
                    <filter.icon className="w-4 h-4 mr-2" />
                    {filter.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Create Post */}
          {user && (
            <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-lg border border-gray-200 dark:border-zinc-700 p-6 mb-8">
              <form onSubmit={handleCreatePost}>
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                    {user.username?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <div className="flex-1">
                    <textarea
                      value={newPost.text}
                      onChange={(e) => setNewPost({ ...newPost, text: e.target.value })}
                      placeholder="What's on your mind about books today?"
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center space-x-4">
                        <button type="button" className="flex items-center text-gray-500 hover:text-blue-600 transition-colors">
                          <FiImage className="w-5 h-5 mr-2" />
                          Photo
                        </button>
                        <button type="button" className="flex items-center text-gray-500 hover:text-blue-600 transition-colors">
                          <FiVideo className="w-5 h-5 mr-2" />
                          Video
                        </button>
                        <button type="button" className="flex items-center text-gray-500 hover:text-blue-600 transition-colors">
                          <FiSmile className="w-5 h-5 mr-2" />
                          Emoji
                        </button>
                      </div>
                      <button
                        type="submit"
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                      >
                        <FiSend className="w-4 h-4 mr-2" />
                        Post
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* Posts Feed */}
          <div className="space-y-6">
            {filteredPosts.length === 0 ? (
              <div className="text-center py-12">
                <FiBookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No posts found</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Try adjusting your search or filter criteria.
                </p>
              </div>
            ) : (
              filteredPosts.map((post) => (
                <motion.div
                  key={post._id}
                  variants={animationVariants}
                  className="bg-white dark:bg-zinc-900 rounded-2xl shadow-lg border border-gray-200 dark:border-zinc-700 overflow-hidden"
                >
                  {/* Post Header */}
                  <div className="p-6 border-b border-gray-200 dark:border-zinc-700">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                          {post.author?.username?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {post.author?.username || 'Anonymous'}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {formatDate(post.createdAt)}
                          </p>
                        </div>
                      </div>
                      <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                        <FiMoreHorizontal className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Post Content */}
                  <div className="p-6">
                    <p className="text-gray-900 dark:text-white mb-4 leading-relaxed">
                      {post.text}
                    </p>

                    {/* Post Images */}
                    {post.images && post.images.length > 0 && (
                      <div className="mb-4">
                        <img
                          src={post.images[0]}
                          alt="Post"
                          className="w-full h-64 object-cover rounded-lg"
                        />
                      </div>
                    )}

                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-sm rounded-full"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Post Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-zinc-700">
                      <div className="flex items-center space-x-6">
                        <button
                          onClick={() => handleLike(post._id)}
                          className="flex items-center text-gray-500 hover:text-red-500 transition-colors"
                        >
                          <FiHeart className="w-5 h-5 mr-2" />
                          <span>Like</span>
                        </button>
                        <button
                          onClick={() => handleComment(post._id)}
                          className="flex items-center text-gray-500 hover:text-blue-500 transition-colors"
                        >
                          <FiMessageCircle className="w-5 h-5 mr-2" />
                          <span>Comment</span>
                        </button>
                        <button
                          onClick={() => handleShare(post._id)}
                          className="flex items-center text-gray-500 hover:text-green-500 transition-colors"
                        >
                          <FiShare2 className="w-5 h-5 mr-2" />
                          <span>Share</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>

          {/* Community Stats */}
          <div className="mt-12 bg-white dark:bg-zinc-900 rounded-2xl shadow-lg border border-gray-200 dark:border-zinc-700 p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Community Highlights
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiBookOpen className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {posts.length}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">Posts Shared</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiUser className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {new Set(posts.map(post => post.author?._id)).size}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">Active Members</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiTrendingUp className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {posts.filter(post => post.tags?.some(tag => tag.includes('BookReview'))).length}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">Book Reviews</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Social;
