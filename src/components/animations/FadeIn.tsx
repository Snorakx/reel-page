import React, { useEffect, useRef } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';

interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  className?: string;
}

export default function FadeIn({
  children,
  delay = 0,
  duration = 0.5,
  direction = 'up',
  className = '',
}: FadeInProps) {
  const controls = useAnimation();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  
  const getDirectionOffset = () => {
    switch (direction) {
      case 'up': return { y: 20 };
      case 'down': return { y: -20 };
      case 'left': return { x: 20 };
      case 'right': return { x: -20 };
      default: return {};
    }
  };

  useEffect(() => {
    if (isInView) {
      controls.start({
        opacity: 1,
        ...getDirectionOffset(),
        transition: {
          duration,
          delay,
          ease: [0.25, 0.1, 0.25, 1],
        },
      });
    }
  }, [isInView, controls, delay, duration, direction]);

  return (
    <motion.div
      ref={ref}
      initial={{ 
        opacity: 0,
        ...getDirectionOffset(),
      }}
      animate={controls}
      className={className}
    >
      {children}
    </motion.div>
  );
} 