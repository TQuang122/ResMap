import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PageTransitionProps {
  children: React.ReactNode;
  mode?: 'wait' | 'sync' | 'popLayout';
  animation?: 'fade' | 'slide' | 'scale' | 'slideUp' | 'slideDown';
  duration?: number;
  className?: string;
}

const animations = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  slide: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
  },
  scale: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.02 },
  },
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  },
  slideDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
  },
};

export const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  mode = 'wait',
  animation = 'fade',
  duration = 0.3,
  className = '',
}) => {
  const selectedAnimation = animations[animation];

  return (
    <AnimatePresence mode={mode}>
      <motion.div
        className={className}
        initial={selectedAnimation.initial}
        animate={selectedAnimation.animate}
        exit={selectedAnimation.exit}
        transition={{
          duration,
          ease: 'easeOut',
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export const FadeTransition: React.FC<{
  children: React.ReactNode;
  duration?: number;
  className?: string;
}> = ({ children, duration = 0.3, className = '' }) => (
  <PageTransition
    animation="fade"
    duration={duration}
    className={className}
  >
    {children}
  </PageTransition>
);

export const SlideTransition: React.FC<{
  children: React.ReactNode;
  direction?: 'left' | 'right';
  duration?: number;
  className?: string;
}> = ({ children, direction = 'left', duration = 0.3, className = '' }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, x: direction === 'left' ? -20 : 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: direction === 'left' ? 20 : -20 }}
    transition={{ duration, ease: 'easeOut' }}
  >
    {children}
  </motion.div>
);

export const ScaleTransition: React.FC<{
  children: React.ReactNode;
  duration?: number;
  className?: string;
}> = ({ children, duration = 0.3, className = '' }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 1.02 }}
    transition={{ duration, ease: 'easeOut' }}
  >
    {children}
  </motion.div>
);

export const SlideUpTransition: React.FC<{
  children: React.ReactNode;
  duration?: number;
  className?: string;
}> = ({ children, duration = 0.3, className = '' }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration, ease: 'easeOut' }}
  >
    {children}
  </motion.div>
);

export const RouteTransition: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.25, ease: 'easeOut' }}
  >
    {children}
  </motion.div>
);

export const StaggerContainer: React.FC<{
  children: React.ReactNode;
  staggerDelay?: number;
  className?: string;
}> = ({ children, staggerDelay = 0.1, className = '' }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
      },
    },
  };

  const childVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className={className}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {React.Children.map(children, (child) => (
        <motion.div variants={childVariants}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
};

export const EnterAnimation: React.FC<{
  children: React.ReactNode;
  delay?: number;
  className?: string;
}> = ({ children, delay = 0, className = '' }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{
      duration: 0.4,
      delay,
      ease: [0.25, 0.46, 0.45, 0.94],
    }}
  >
    {children}
  </motion.div>
);

export default PageTransition;
