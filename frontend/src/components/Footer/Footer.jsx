/* eslint-disable no-unused-vars */
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FiBookOpen, 
  FiMail, 
  FiPhone, 
  FiMapPin, 
  FiFacebook, 
  FiTwitter, 
  FiInstagram, 
  FiLinkedin,
  FiGithub,
  FiHeart
} from 'react-icons/fi';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  // Footer sections data
  const footerSections = [
    {
      title: 'BookHub',
      description: 'Your gateway to a world of knowledge, imagination, and literary adventures.',
      icon: FiBookOpen,
      links: [
        { name: 'About Us', to: '/about' },
        { name: 'Our Mission', to: '/mission' },
        { name: 'Team', to: '/team' },
        { name: 'Careers', to: '/careers' },
      ]
    },
    {
      title: 'Explore',
      links: [
        { name: 'All Books', to: '/books' },
        { name: 'Categories', to: '/categories' },
        { name: 'Authors', to: '/authors' },
        { name: 'Publishers', to: '/publishers' },
        { name: 'New Releases', to: '/new-releases' },
        { name: 'Bestsellers', to: '/bestsellers' },
      ]
    },
    {
      title: 'Community',
      links: [
        { name: 'Book Clubs', to: '/book-clubs' },
        { name: 'Reviews', to: '/reviews' },
        { name: 'Discussions', to: '/discussions' },
        { name: 'Events', to: '/events' },
        { name: 'Blog', to: '/blog' },
        { name: 'Newsletter', to: '/newsletter' },
      ]
    },
    {
      title: 'Support',
      links: [
        { name: 'Help Center', to: '/help' },
        { name: 'Contact Us', to: '/contact' },
        { name: 'FAQ', to: '/faq' },
        { name: 'Shipping Info', to: '/shipping' },
        { name: 'Returns', to: '/returns' },
        { name: 'Privacy Policy', to: '/privacy' },
      ]
    }
  ];

  // Social media links
  const socialLinks = [
    { name: 'Facebook', icon: FiFacebook, href: '#', color: 'hover:text-blue-600' },
    { name: 'Twitter', icon: FiTwitter, href: '#', color: 'hover:text-blue-400' },
    { name: 'Instagram', icon: FiInstagram, href: '#', color: 'hover:text-pink-600' },
    { name: 'LinkedIn', icon: FiLinkedin, href: '#', color: 'hover:text-blue-700' },
    { name: 'GitHub', icon: FiGithub, href: '#', color: 'hover:text-gray-700' },
  ];

  // Contact info
  const contactInfo = [
    { icon: FiMail, text: 'hello@bookhub.com', href: 'mailto:hello@bookhub.com' },
    { icon: FiPhone, text: '+1 (555) 123-4567', href: 'tel:+15551234567' },
    { icon: FiMapPin, text: '123 Book Street, Literary City, LC 12345', href: '#' },
  ];

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
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8"
        >
          {/* Company Info */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                <FiBookOpen className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold">BookHub</span>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Your gateway to a world of knowledge, imagination, and literary adventures. 
              Discover your next favorite book and connect with fellow readers.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              {contactInfo.map((contact, index) => (
                <motion.a
                  key={index}
                  href={contact.href}
                  variants={itemVariants}
                  className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors duration-300"
                >
                  <contact.icon className="w-4 h-4 text-blue-400" />
                  <span className="text-sm">{contact.text}</span>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Footer Sections */}
          {footerSections.slice(1).map((section, index) => (
            <motion.div key={index} variants={itemVariants}>
              <h3 className="text-lg font-semibold mb-4 text-white">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link
                      to={link.to}
                      className="text-gray-300 hover:text-white transition-colors duration-300 text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        {/* Newsletter Section */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="mt-16 pt-8 border-t border-gray-800"
        >
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-4">
              Stay Updated with BookHub
            </h3>
            <p className="text-gray-300 mb-6 max-w-md mx-auto">
              Get the latest book recommendations, author interviews, and literary news delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Subscribe
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-gray-400 text-sm"
            >
              © {currentYear} BookHub. All rights reserved. Made with{' '}
              <FiHeart className="inline w-4 h-4 text-red-500" /> by the BookHub team.
            </motion.div>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex space-x-4"
            >
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  className={`w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 transition-all duration-300 ${social.color}`}
                  aria-label={social.name}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;