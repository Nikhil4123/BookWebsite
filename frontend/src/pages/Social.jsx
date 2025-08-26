/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiFilter, FiUser, FiUsers, FiMessageCircle, FiHeart, FiShare2, FiBookOpen, FiStar, FiPlus, FiMoreHorizontal, FiCamera, FiEdit3 } from 'react-icons/fi';

const Social = () => {
  const { theme } = useSelector((state) => state.ui);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState('feed');
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);

  // Sample social data (you can fetch from backend)
  const users = [
    {
      id: 1,
      name: "Sarah Johnson",
      username: "@sarahj",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      bio: "Book lover and avid reader. Always looking for the next great story.",
      followers: 1247,
      following: 892,
      booksRead: 156,
      currentlyReading: "The Midnight Library",
      isOnline: true
    },
    {
      id: 2,
      name: "Michael Chen",
      username: "@mchen",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      bio: "Classic literature enthusiast. Shakespeare, Dickens, and everything in between.",
      followers: 892,
      following: 654,
      booksRead: 203,
      currentlyReading: "Pride and Prejudice",
      isOnline: false
    },
    {
      id: 3,
      name: "Emma Rodriguez",
      username: "@emmar",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      bio: "Young adult fiction lover. Building my personal library one book at a time.",
      followers: 567,
      following: 445,
      booksRead: 89,
      currentlyReading: "The Hunger Games",
      isOnline: true
    }
  ];

  const posts = [
    {
      id: 1,
      author: users[0],
      content: "Just finished 'The Midnight Library' by Matt Haig. What an incredible journey through infinite possibilities! Has anyone else read this? I'd love to discuss the ending.",
      image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&h=400&fit=crop",
      likes: 45,
      comments: 12,
      shares: 8,
      timestamp: "2 hours ago",
      tags: ["The Midnight Library", "Matt Haig", "book review", "discussion"]
    },
    {
      id: 2,
      author: users[1],
      content: "Re-reading 'Pride and Prejudice' for the 5th time. Austen's wit and social commentary never get old. What's your favorite Austen novel?",
      image: null,
      likes: 67,
      comments: 23,
      shares: 15,
      timestamp: "5 hours ago",
      tags: ["Jane Austen", "Pride and Prejudice", "classic literature", "re-reading"]
    },
    {
      id: 3,
      author: users[2],
      content: "My bookshelf organization project is complete! 📚✨ How do you organize your books? By genre, author, or color?",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop",
      likes: 89,
      comments: 34,
      shares: 21,
      timestamp: "1 day ago",
      tags: ["bookshelf", "organization", "book collection", "home decor"]
    }
  ];

  const groups = [
    {
      id: 1,
      name: "Classic Literature Club",
      description: "A community for lovers of classic literature. Monthly book discussions and author studies.",
      members: 1247,
      image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=200&fit=crop",
      isPrivate: false
    },
    {
      id: 2,
      name: "Science Fiction Readers",
      description: "Exploring the vast universe of sci-fi literature. From Asimov to modern authors.",
      members: 892,
      image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=200&fit=crop",
      isPrivate: false
    },
    {
      id: 3,
      name: "Book Club for Beginners",
      description: "New to reading? Join our supportive community for new readers.",
      members: 456,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop",
      isPrivate: true
    }
  ];

  const handleCreatePost = () => {
    if (newPostContent.trim()) {
      // Here you would typically send the post to your backend
      console.log('Creating post:', { content: newPostContent, image: selectedImage });
      setNewPostContent('');
      setSelectedImage(null);
      setShowCreatePost(false);
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setSelectedImage(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className={`min-h-screen pt-20 transition-colors duration-300 ${
      theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            BookHub Social
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Connect with fellow readers, share your thoughts, and discover new books
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className={`mb-8 p-4 rounded-2xl shadow-lg ${
            theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
          }`}
        >
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search users, posts, or groups..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-colors duration-200 ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500'
                  : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
              }`}
            />
          </div>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex space-x-1 p-1 rounded-xl bg-gray-100 dark:bg-gray-800 w-fit">
            {[
              { id: 'feed', label: 'Feed', icon: FiBookOpen },
              { id: 'people', label: 'People', icon: FiUsers },
              { id: 'groups', label: 'Groups', icon: FiUser },
              { id: 'discussions', label: 'Discussions', icon: FiMessageCircle }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  selectedTab === tab.id
                    ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Create Post Button */}
        {isAuthenticated && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-8"
          >
            <button
              onClick={() => setShowCreatePost(true)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                theme === 'dark'
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              <FiPlus className="w-5 h-5" />
              <span>Create Post</span>
            </button>
          </motion.div>
        )}

        {/* Create Post Modal */}
        <AnimatePresence>
          {showCreatePost && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={() => setShowCreatePost(false)}
              />
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className={`relative w-full max-w-2xl p-6 rounded-2xl shadow-xl ${
                  theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold">Create a Post</h3>
                  <button
                    onClick={() => setShowCreatePost(false)}
                    className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <FiMoreHorizontal className="w-5 h-5" />
                  </button>
                </div>
                
                <textarea
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  placeholder="What's on your mind? Share your thoughts about books, reading, or anything literary..."
                  className={`w-full h-32 p-4 rounded-xl border resize-none transition-colors duration-200 ${
                    theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500'
                      : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
                  }`}
                />
                
                {selectedImage && (
                  <div className="mt-4 relative">
                    <img
                      src={selectedImage}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-xl"
                    />
                    <button
                      onClick={() => setSelectedImage(null)}
                      className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                )}
                
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center space-x-2">
                    <label className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 cursor-pointer">
                      <FiCamera className="w-5 h-5" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                  
                  <button
                    onClick={handleCreatePost}
                    disabled={!newPostContent.trim()}
                    className={`px-6 py-2 rounded-xl font-medium transition-all duration-200 ${
                      newPostContent.trim()
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    Post
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content based on selected tab */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {selectedTab === 'feed' && (
              <div className="space-y-6">
                {posts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 * index }}
                    className={`p-6 rounded-2xl shadow-lg ${
                      theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                    }`}
                  >
                    {/* Post Header */}
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="relative">
                        <img
                          src={post.author.avatar}
                          alt={post.author.name}
                          className="w-12 h-12 rounded-full"
                        />
                        {post.author.isOnline && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold">{post.author.name}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {post.author.username} • {post.timestamp}
                        </p>
                      </div>
                      <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                        <FiMoreHorizontal className="w-5 h-5" />
                      </button>
                    </div>
                    
                    {/* Post Content */}
                    <p className="text-gray-800 dark:text-gray-200 mb-4">{post.content}</p>
                    
                    {/* Post Image */}
                    {post.image && (
                      <img
                        src={post.image}
                        alt="Post"
                        className="w-full h-64 object-cover rounded-xl mb-4"
                      />
                    )}
                    
                    {/* Post Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.map(tag => (
                        <span
                          key={tag}
                          className={`px-3 py-1 text-sm rounded-full ${
                            theme === 'dark' 
                              ? 'bg-blue-900/30 text-blue-400' 
                              : 'bg-blue-100 text-blue-600'
                          }`}
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                    
                    {/* Post Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center space-x-6">
                        <button className="flex items-center space-x-2 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors duration-200">
                          <FiHeart className="w-5 h-5" />
                          <span>{post.likes}</span>
                        </button>
                        <button className="flex items-center space-x-2 text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200">
                          <FiMessageCircle className="w-5 h-5" />
                          <span>{post.comments}</span>
                        </button>
                        <button className="flex items-center space-x-2 text-gray-500 dark:text-gray-400 hover:text-green-500 dark:hover:text-green-400 transition-colors duration-200">
                          <FiShare2 className="w-5 h-5" />
                          <span>{post.shares}</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {selectedTab === 'people' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {users.map((user, index) => (
                  <motion.div
                    key={user.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 * index }}
                    className={`p-6 rounded-2xl shadow-lg ${
                      theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                    }`}
                  >
                    <div className="text-center">
                      <div className="relative inline-block mb-4">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-20 h-20 rounded-full"
                        />
                        {user.isOnline && (
                          <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full" />
                        )}
                      </div>
                      
                      <h3 className="text-xl font-bold mb-2">{user.name}</h3>
                      <p className="text-gray-500 dark:text-gray-400 mb-2">{user.username}</p>
                      <p className="text-gray-600 dark:text-gray-300 mb-4">{user.bio}</p>
                      
                      <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                        <div>
                          <div className="font-bold">{user.followers}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">Followers</div>
                        </div>
                        <div>
                          <div className="font-bold">{user.following}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">Following</div>
                        </div>
                        <div>
                          <div className="font-bold">{user.booksRead}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">Books</div>
                        </div>
                      </div>
                      
                      <div className="mb-4 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                        <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Currently Reading</div>
                        <div className="font-medium">{user.currentlyReading}</div>
                      </div>
                      
                      <button className={`w-full py-2 rounded-xl font-medium transition-all duration-200 ${
                        theme === 'dark'
                          ? 'bg-blue-600 hover:bg-blue-700 text-white'
                          : 'bg-blue-500 hover:bg-blue-600 text-white'
                      }`}>
                        Follow
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {selectedTab === 'groups' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {groups.map((group, index) => (
                  <motion.div
                    key={group.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 * index }}
                    className={`p-6 rounded-2xl shadow-lg ${
                      theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                    }`}
                  >
                    <div className="relative mb-4">
                      <img
                        src={group.image}
                        alt={group.name}
                        className="w-full h-32 object-cover rounded-xl"
                      />
                      {group.isPrivate && (
                        <div className="absolute top-2 right-2 px-2 py-1 bg-gray-800 text-white text-xs rounded-full">
                          Private
                        </div>
                      )}
                    </div>
                    
                    <h3 className="text-xl font-bold mb-2">{group.name}</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">{group.description}</p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {group.members} members
                      </span>
                    </div>
                    
                    <button className={`w-full py-2 rounded-xl font-medium transition-all duration-200 ${
                      theme === 'dark'
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                    }`}>
                      Join Group
                    </button>
                  </motion.div>
                ))}
              </div>
            )}

            {selectedTab === 'discussions' && (
              <div className="text-center py-16">
                <FiMessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Discussions Coming Soon</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Join book discussions and reading groups
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Social;
