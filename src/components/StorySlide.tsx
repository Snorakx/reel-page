import React, { useRef, useEffect } from 'react';
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
  
  // Force reset of slide visibility when no longer active
  useEffect(() => {
    if (!isActive && slideRef.current) {
      const slideElement = slideRef.current;
      slideElement.style.opacity = '0';
      slideElement.style.visibility = 'hidden';
      slideElement.style.display = 'none'; // Add display none to completely remove from rendering
      slideElement.classList.remove('story-slide-visible');
    } else if (isActive && slideRef.current) {
      const slideElement = slideRef.current;
      slideElement.style.opacity = '1';
      slideElement.style.visibility = 'visible';
      slideElement.style.display = 'flex'; // Restore display
      slideElement.classList.add('story-slide-visible');
    }
  }, [isActive]);
  
  // Additional listener for scroll direction, to clear slide when scrolling back up
  useEffect(() => {
    let prevScrollY = window.scrollY;
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const isScrollingUp = currentScrollY < prevScrollY;
      prevScrollY = currentScrollY;
      
      // If we're scrolling up and this slide should be hidden, or we're near the top of the page
      if ((isScrollingUp && !isActive && slideRef.current) || currentScrollY < window.innerHeight * 0.7) {
        const slideElement = slideRef.current;
        if (slideElement) {
          slideElement.style.opacity = '0';
          slideElement.style.visibility = 'hidden';
          slideElement.style.display = 'none';
          slideElement.classList.remove('story-slide-visible');
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isActive]);
  
  // Add a special check for hero section visibility
  useEffect(() => {
    const heroObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        // If hero section is visible, force hide this slide
        if (entry.isIntersecting && slideRef.current) {
          const slideElement = slideRef.current;
          slideElement.style.opacity = '0';
          slideElement.style.visibility = 'hidden';
          slideElement.style.display = 'none';
          slideElement.classList.remove('story-slide-visible');
        }
      });
    }, { 
      threshold: 0.2 // Even slight visibility of hero should hide slides
    });
    
    const heroSection = document.getElementById('hero');
    if (heroSection) {
      heroObserver.observe(heroSection);
    }
    
    return () => {
      if (heroSection) {
        heroObserver.disconnect();
      }
    };
  }, []);
  
  // Oblicz opóźnienie dla animacji wejścia
  const getAnimationDelay = (order: number) => 0.1 + (order * 0.15);
  
  return (
    <div
      ref={slideRef}
      className={`fixed inset-0 h-screen flex items-center justify-center px-4 md:px-6 transition-all duration-500 ${isActive ? 'story-slide-visible' : ''}`}
      style={{
        opacity: isActive ? 1 : 0,
        visibility: isInView && isActive ? 'visible' : 'hidden',
        display: isActive ? 'flex' : 'none', // Add display none when not active
        pointerEvents: isActive ? 'auto' : 'none',
        zIndex: isActive ? 10 : -1  // Add z-index to prevent overlap issues
      }}
      data-slide-index={index}
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
          animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
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
          animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.7, delay: getAnimationDelay(1) }}
          className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 font-montserrat"
        >
          {title}
        </motion.h1>
        
        {/* Subtitle */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.7, delay: getAnimationDelay(2) }}
          className="text-xl md:text-2xl text-blue-100 mb-6 font-light max-w-2xl mx-auto"
        >
          {subtitle}
        </motion.h2>
        
        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
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
          animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
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