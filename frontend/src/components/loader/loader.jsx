import React from 'react';
import { motion } from 'framer-motion';

const Loader = ({ size = 'default', variant = 'spinner', text = 'Loading...' }) => {
  // Size variants
  const sizeVariants = {
    small: 'w-6 h-6',
    default: 'w-12 h-12',
    large: 'w-16 h-16',
    xlarge: 'w-24 h-24'
  };

  // Spinner variant
  const SpinnerLoader = () => (
    <motion.div
      className={`${sizeVariants[size]} border-2 border-gray-200 border-t-blue-600 rounded-full`}
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: "linear"
      }}
    />
  );

  // Pulse variant
  const PulseLoader = () => (
    <motion.div
      className={`${sizeVariants[size]} bg-blue-600 rounded-full`}
      animate={{
        scale: [1, 1.2, 1],
        opacity: [1, 0.7, 1]
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
  );

  // Dots variant
  const DotsLoader = () => (
    <div className="flex space-x-2">
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          className="w-3 h-3 bg-blue-600 rounded-full"
          animate={{
            y: [0, -10, 0],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: index * 0.2,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );

  // Bars variant
  const BarsLoader = () => (
    <div className="flex space-x-1">
      {[0, 1, 2, 3, 4].map((index) => (
        <motion.div
          key={index}
          className="w-1 bg-blue-600 rounded-full"
          animate={{
            height: [20, 40, 20],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: index * 0.1,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );

  // Wave variant
  const WaveLoader = () => (
    <div className="flex space-x-1">
      {[0, 1, 2, 3, 4].map((index) => (
        <motion.div
          key={index}
          className="w-2 bg-gradient-to-t from-blue-600 to-purple-600 rounded-full"
          animate={{
            y: [0, -15, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: index * 0.1,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );

  // Book variant (custom for BookHub)
  const BookLoader = () => (
    <motion.div
      className="flex items-center space-x-2"
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 2, repeat: Infinity }}
    >
      <motion.div
        className="w-8 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-l-md"
        animate={{
          rotateY: [0, 15, 0],
          scale: [1, 1.05, 1]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="w-8 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-r-md"
        animate={{
          rotateY: [0, -15, 0],
          scale: [1, 1.05, 1]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5
        }}
      />
    </motion.div>
  );

  // Render the appropriate loader variant
  const renderLoader = () => {
    switch (variant) {
      case 'spinner':
        return <SpinnerLoader />;
      case 'pulse':
        return <PulseLoader />;
      case 'dots':
        return <DotsLoader />;
      case 'bars':
        return <BarsLoader />;
      case 'wave':
        return <WaveLoader />;
      case 'book':
        return <BookLoader />;
      default:
        return <SpinnerLoader />;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      {renderLoader()}
      {text && (
        <motion.p
          className="text-gray-600 font-medium text-center"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {text}
        </motion.p>
      )}
    </div>
  );
};

// Page Loader component for full-page loading
export const PageLoader = ({ text = 'Loading BookHub...' }) => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
    <div className="text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </motion.div>
      <Loader variant="book" size="large" text={text} />
    </div>
  </div>
);

// Inline Loader component for small loading states
export const InlineLoader = ({ size = 'small', variant = 'dots' }) => (
  <Loader size={size} variant={variant} text="" />
);

// Button Loader component for button loading states
export const ButtonLoader = ({ size = 'small' }) => (
  <motion.div
    className={`${sizeVariants[size]} border-2 border-white border-t-transparent rounded-full`}
    animate={{ rotate: 360 }}
    transition={{
      duration: 1,
      repeat: Infinity,
      ease: "linear"
    }}
  />
);

export default Loader;