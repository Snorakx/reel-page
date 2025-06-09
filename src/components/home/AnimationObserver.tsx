import { useEffect } from 'react';

export default function AnimationObserver() {
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const element = entry.target as HTMLElement;
          
          // Restart animations by removing and re-adding animation classes
          const animationClasses = Array.from(element.classList).filter(cls => 
            cls.startsWith('animate-')
          );
          
          if (animationClasses.length > 0) {
            animationClasses.forEach(cls => element.classList.remove(cls));
            
            // Force reflow
            element.offsetHeight;
            
            requestAnimationFrame(() => {
              animationClasses.forEach(cls => element.classList.add(cls));
            });
          }
        }
      });
    }, observerOptions);

    // Observe all elements with animation classes
    const animatedElements = document.querySelectorAll(
      '.animate-slide-up, .animate-fade-in, .animate-float, .animate-scroll-dot, .animate-progress, .animate-pulse-glow'
    );
    
    animatedElements.forEach(el => observer.observe(el));

    return () => {
      observer.disconnect();
    };
  }, []);

  return null; // This component doesn't render anything
} 