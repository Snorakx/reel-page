import React from 'react';
import { motion } from 'framer-motion';

interface ServiceIconProps {
  type: 'development' | 'ai' | 'optimization' | 'consultation';
  isActive?: boolean;
  className?: string;
}

const ServiceIcon: React.FC<ServiceIconProps> = ({ type, isActive = false, className = '' }) => {
  const iconVariants = {
    idle: {
      rotate: 0,
      scale: 1,
      opacity: 0.8
    },
    active: {
      rotate: [0, 5, -5, 0],
      scale: [1, 1.05, 1],
      opacity: 1,
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: "reverse" as const
      }
    }
  };

  const glitchVariants = {
    idle: { x: 0, y: 0 },
    active: {
      x: [0, 2, -2, 0],
      y: [0, -1, 1, 0],
      transition: {
        duration: 0.2,
        repeat: Infinity,
        repeatDelay: 3
      }
    }
  };

  const renderIcon = () => {
    switch (type) {
      case 'development':
        return (
          <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
            <motion.path
              d="M7 8L3 12L7 16M17 8L21 12L17 16M14 4L10 20"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, ease: "easeInOut" }}
            />
          </svg>
        );
      
      case 'ai':
        return (
          <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
            <motion.circle
              cx="12"
              cy="12"
              r="3"
              stroke="currentColor"
              strokeWidth="2"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1 }}
            />
            <motion.path
              d="M12 1V3M12 21V23M4.22 4.22L5.64 5.64M18.36 18.36L19.78 19.78M1 12H3M21 12H23M4.22 19.78L5.64 18.36M18.36 5.64L19.78 4.22"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </svg>
        );
      
      case 'optimization':
        return (
          <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
            <motion.path
              d="M3 3V21L21 12L3 3Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinejoin="round"
              fill="currentColor"
              fillOpacity="0.1"
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
            <motion.circle
              cx="21"
              cy="12"
              r="2"
              fill="currentColor"
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              transition={{ delay: 1, duration: 0.5 }}
            />
          </svg>
        );
      
      case 'consultation':
        return (
          <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
            <motion.path
              d="M21 15A2 2 0 0 1 19 17H7L4 20V5A2 2 0 0 1 6 3H19A2 2 0 0 1 21 5Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.5 }}
            />
            <motion.circle
              cx="12"
              cy="11"
              r="1"
              fill="currentColor"
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1, 0] }}
              transition={{ delay: 1.5, duration: 1, repeat: Infinity }}
            />
            <motion.circle
              cx="8"
              cy="11"
              r="1"
              fill="currentColor"
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1, 0] }}
              transition={{ delay: 1.7, duration: 1, repeat: Infinity }}
            />
            <motion.circle
              cx="16"
              cy="11"
              r="1"
              fill="currentColor"
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1, 0] }}
              transition={{ delay: 1.9, duration: 1, repeat: Infinity }}
            />
          </svg>
        );
      
      default:
        return null;
    }
  };

  return (
    <motion.div
      className={`relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-32 lg:h-32 ${className}`}
      variants={glitchVariants}
      animate={isActive ? 'active' : 'idle'}
    >
      <motion.div
        className="w-full h-full text-white/80"
        variants={iconVariants}
        animate={isActive ? 'active' : 'idle'}
      >
        {renderIcon()}
      </motion.div>
      
      {/* Glitch overlay effect */}
      {isActive && (
        <motion.div
          className="absolute inset-0 w-full h-full text-cyan-400/30"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: [0, 0.3, 0],
            x: [0, 2, -2, 0],
            y: [0, -1, 1, 0]
          }}
          transition={{
            duration: 0.1,
            repeat: Infinity,
            repeatDelay: 4
          }}
        >
          {renderIcon()}
        </motion.div>
      )}
    </motion.div>
  );
};

export default ServiceIcon; 