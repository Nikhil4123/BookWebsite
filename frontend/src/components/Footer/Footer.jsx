/* eslint-disable no-unused-vars */
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FiMail, FiPhone, FiMapPin, FiBookOpen, FiHeart, FiUsers, FiStar, FiArrowRight, FiInstagram, FiTwitter, FiFacebook, FiYoutube, FiLinkedin } from 'react-icons/fi';

const Footer = () => {
  const { theme } = useSelector((state) => state.ui);
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  const footerSections = [
    {
      title: "Explore",
      links: [
        { name: "All Books", path: "/all-books" },
        { name: "New Releases", path: "/new-releases" },
        { name: "Best Sellers", path: "/best-sellers" },
        { name: "Coming Soon", path: "/coming-soon" }
      ]
    },
    {
      title: "Categories",
      links: [
        { name: "Fiction", path: "/category/fiction" },
        { name: "Non-Fiction", path: "/category/non-fiction" },
        { name: "Science Fiction", path: "/category/sci-fi" },
        { name: "Mystery", path: "/category/mystery" }
      ]
    },
    {
      title: "Community",
      links: [
        { name: "Book Clubs", path: "/book-clubs" },
        { name: "Reading Challenges", path: "/challenges" },
        { name: "Author Events", path: "/events" },
        { name: "Discussion Forums", path: "/forums" }
      ]
    },
    {
      title: "Support",
      links: [
        { name: "Help Center", path: "/help" },
        { name: "Contact Us", path: "/contact" },
        { name: "Shipping Info", path: "/shipping" },
        { name: "Returns", path: "/returns" }
      ]
    }
  ];

  const socialLinks = [
    { icon: FiInstagram, href: "#", label: "Instagram", color: "from-pink-500 to-purple-500" },
    { icon: FiTwitter, href: "#", label: "Twitter", color: "from-blue-400 to-cyan-500" },
    { icon: FiFacebook, href: "#", label: "Facebook", color: "from-blue-600 to-indigo-600" },
    { icon: FiYoutube, href: "#", label: "YouTube", color: "from-red-500 to-pink-500" },
    { icon: FiLinkedin, href: "#", label: "LinkedIn", color: "from-blue-700 to-indigo-700" }
  ];

  // const stats = [
  //   { number: "50K+", label: "Books Available", icon: FiBookOpen, color: "from-amber-400 to-orange-500" },
  //   { number: "10K+", label: "Happy Readers", icon: FiHeart, color: "from-pink-400 to-rose-500" },
  //   { number: "100+", label: "Book Clubs", icon: FiUsers, color: "from-purple-400 to-indigo-500" },
  //   { number: "95%", label: "Satisfaction", icon: FiStar, color: "from-green-400 to-emerald-500" }
  // ];

  return (
    <footer className={`relative overflow-hidden ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white' 
        : 'bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 text-white'
    }`}>
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full blur-3xl"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full blur-2xl"></div>
        <div className="absolute bottom-20 left-1/4 w-20 h-20 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full blur-xl"></div>
      </div>

      {/* Main footer content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
        {/* Top section with logo and newsletter */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Logo and description */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-2xl">
                  <FiBookOpen className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                  BookVerse
                </h2>
                <p className="text-gray-400 text-sm">Your Literary Universe</p>
              </div>
            </div>
            
            <p className="text-gray-300 text-lg leading-relaxed max-w-md">
              Embark on literary journeys that ignite imagination, challenge perspectives, and create lasting memories. Your next favorite book awaits in our vast collection.
            </p>

            {/* Contact info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-gray-300">
                <FiMail className="w-5 h-5 text-amber-400" />
                <span>hello@bookverse.com</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-300">
                <FiPhone className="w-5 h-5 text-amber-400" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-300">
                <FiMapPin className="w-5 h-5 text-amber-400" />
                <span>123 Literary Lane, Book City, BC 12345</span>
              </div>
            </div>
          </motion.div>

          {/* Newsletter subscription */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">Stay Updated</h3>
              <p className="text-gray-300">Get the latest book releases, author interviews, and literary news delivered to your inbox.</p>
            </div>

            <form onSubmit={handleNewsletterSubmit} className="space-y-4">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full px-6 py-4 bg-gray-800 border border-gray-700 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
                  required
                />
                <FiMail className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full px-6 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-2xl hover:from-amber-600 hover:to-orange-600 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
              >
                <span>Subscribe to Newsletter</span>
                <FiArrowRight className="w-5 h-5" />
              </motion.button>
            </form>

            {/* Success message */}
            <AnimatePresence>
              {isSubscribed && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl text-center font-medium"
                >
                  🎉 Successfully subscribed! Welcome to the BookVerse family.
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Stats section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
        >
          {/* {stats.map((stat, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -5 }}
              className="text-center group"
            >
              <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${stat.color} rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                <stat.icon className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-white mb-2">{stat.number}</div>
              <div className="text-gray-400 text-sm">{stat.label}</div>
            </motion.div>
          ))} */}
        </motion.div>

        {/* Footer links */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12"
        >
          {footerSections.map((section, index) => (
            <div key={index} className="space-y-4">
              <h4 className="text-lg font-semibold text-white">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link
                      to={link.path}
                      className="text-gray-400 hover:text-amber-400 transition-colors duration-200 text-sm flex items-center group"
                    >
                      <span className="group-hover:translate-x-1 transition-transform duration-200">
                        {link.name}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </motion.div>

        {/* Bottom section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
          className="border-t border-gray-800 pt-8"
        >
          <div className="flex flex-col lg:flex-row items-center justify-between space-y-6 lg:space-y-0">
            {/* Copyright */}
            <div className="text-gray-400 text-sm text-center lg:text-left">
              <p>&copy; 2024 BookVerse. All rights reserved. Made with ❤️ for book lovers.</p>
            </div>

            {/* Social links */}
            <div className="flex items-center space-x-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  className={`w-10 h-10 bg-gradient-to-br ${social.color} rounded-xl flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all duration-200`}
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom wave decoration */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-auto">
          <path
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
            opacity=".1"
            fill="currentColor"
            className="text-amber-500"
          ></path>
        </svg>
      </div>
    </footer>
  );
};

export default Footer;