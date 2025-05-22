import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface StorySlideProps {
  index: number;
  title: string;
  subtitle: string;
  description: string;
  color: string;
  blur: string;
  isActive: boolean;
}

export default function StorySlide({
  index,
  title,
  subtitle,
  description,
  color,
  blur,
  isActive
}: StorySlideProps) {
  const slideRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(slideRef, { once: false, amount: 0.5 });
  
  // Oblicz opóźnienie dla animacji wejścia
  const getAnimationDelay = (order: number) => 0.1 + (order * 0.15);
  
  return (
    <div
      ref={slideRef}
      className="fixed inset-0 h-screen flex items-center justify-center px-4 md:px-6"
      style={{
        opacity: isActive ? 1 : 0,
        visibility: isActive ? 'visible' : 'hidden',
        transition: 'opacity 0.5s ease, visibility 0.5s ease'
      }}
    >
      {/* Abstract background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className={`absolute top-1/4 left-1/4 w-1/2 aspect-square rounded-full bg-gradient-to-br ${color} ${blur} animate-pulse`} 
             style={{ animationDuration: '10s' }} />
        <div className={`absolute bottom-1/4 right-1/3 w-1/3 aspect-square rounded-full bg-gradient-to-tr ${color} ${blur} animate-pulse`}
             style={{ animationDuration: '15s', animationDelay: '1s' }} />
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNjB2NjBIMHoiLz48cGF0aCBkPSJNMzAgMzBoMzB2MzBIMzB6IiBzdHJva2U9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiIHN0cm9rZS13aWR0aD0iLjUiLz48cGF0aCBkPSJNMCAzMGgzMHYzMEgweiIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDMpIiBzdHJva2Utd2lkdGg9Ii41Ii8+PC9nPjwvc3ZnPg==')] opacity-30" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Step indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: getAnimationDelay(0) }}
          className="mb-6"
        >
          <span className="inline-block py-1 px-4 rounded-full bg-blue-500/20 text-blue-400 text-sm font-medium">
            Krok {index + 1}
          </span>
        </motion.div>
        
        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.7, delay: getAnimationDelay(1) }}
          className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 font-montserrat"
        >
          {title}
        </motion.h1>
        
        {/* Subtitle */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.7, delay: getAnimationDelay(2) }}
          className="text-xl md:text-2xl text-blue-100 mb-6 font-light max-w-2xl mx-auto"
        >
          {subtitle}
        </motion.h2>
        
        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.7, delay: getAnimationDelay(3) }}
          className="text-lg md:text-xl text-blue-200/80 max-w-xl mx-auto"
        >
          {description}
        </motion.p>
      </div>
      
      {/* Scroll indicator (tylko na ostatnim slajdzie) */}
      {index === 3 && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.7, delay: getAnimationDelay(4) }}
          className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-center"
        >
          <div className="flex flex-col items-center">
            <p className="text-blue-300 mb-2 text-sm">Kontynuuj</p>
            <motion.div
              animate={{ y: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400">
                <path d="M7 13l5 5 5-5"/>
                <path d="M7 6l5 5 5-5"/>
              </svg>
            </motion.div>
          </div>
        </motion.div>
      )}
    </div>
  );
} 