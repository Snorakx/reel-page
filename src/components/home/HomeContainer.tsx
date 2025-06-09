import { useState, useEffect } from 'react';
import Navigation from './Navigation.tsx';
import Reel1Hero from './Reel1Hero.tsx';
import Reel2Services from './Reel2Services.tsx';
import Reel3Process from './Reel3Process.tsx';
import Reel4Contact from './Reel4Contact.tsx';
import SocialLinks from './SocialLinks.tsx';
import ReelIndicators from './ReelIndicators.tsx';

export default function HomeContainer() {
  const [currentReel, setCurrentReel] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const totalReels = 4;

  const scrollToSection = (index: number) => {
    if (isScrolling) return;
    
    setIsScrolling(true);
    const newReel = Math.max(0, Math.min(index, totalReels - 1));
    setCurrentReel(newReel);
    
    const targetElement = document.querySelector(`.reel-${newReel + 1}`) as HTMLElement;
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
      
      setTimeout(() => {
        setIsScrolling(false);
      }, 1000);
    }
  };

  useEffect(() => {
    // Show/hide footer based on current reel with a small delay to ensure DOM is ready
    const updateFooter = () => {
      const footer = document.querySelector('footer') as HTMLElement;
      if (footer) {
        if (currentReel === totalReels - 1) {
          footer.style.display = 'block';
          footer.style.opacity = '1';
        } else {
          footer.style.display = 'none';
          footer.style.opacity = '0';
        }
      }
    };
    
    // Small delay to ensure DOM is fully rendered
    setTimeout(updateFooter, 100);
  }, [currentReel]);

  useEffect(() => {
    // Wheel scroll handling
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      
      if (isScrolling) return;
      
      if (e.deltaY > 0 && currentReel < totalReels - 1) {
        scrollToSection(currentReel + 1);
      } else if (e.deltaY < 0 && currentReel > 0) {
        scrollToSection(currentReel - 1);
      }
    };

    // Touch handling for mobile
    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const touchEndY = e.changedTouches[0].clientY;
      const diff = touchStartY - touchEndY;
      
      if (Math.abs(diff) > 50) {
        if (diff > 0 && currentReel < totalReels - 1) {
          scrollToSection(currentReel + 1);
        } else if (diff < 0 && currentReel > 0) {
          scrollToSection(currentReel - 1);
        }
      }
    };

    // Keyboard navigation
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' && currentReel < totalReels - 1) {
        scrollToSection(currentReel + 1);
      } else if (e.key === 'ArrowUp' && currentReel > 0) {
        scrollToSection(currentReel - 1);
      }
    };

    // Add event listeners
    document.addEventListener('wheel', handleWheel, { passive: false });
    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchend', handleTouchEnd);
    document.addEventListener('keydown', handleKeydown);

    // Initialize footer with proper delay
    const initializeFooter = () => {
      const footer = document.querySelector('footer') as HTMLElement;
      if (footer) {
        footer.style.transition = 'opacity 0.3s ease-in-out';
        if (currentReel === totalReels - 1) {
          footer.style.display = 'block';
          footer.style.opacity = '1';
        } else {
          footer.style.display = 'none';
          footer.style.opacity = '0';
        }
      }
    };
    
    // Delay to ensure footer is in DOM
    setTimeout(initializeFooter, 500);

    // Make scrollToSection available globally for footer navigation
    (window as any).scrollToSection = scrollToSection;

    // Cleanup
    return () => {
      document.removeEventListener('wheel', handleWheel);
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
      document.removeEventListener('keydown', handleKeydown);
    };
  }, [currentReel, isScrolling]);

  return (
    <>
      <Navigation scrollToSection={scrollToSection} />
      <Reel1Hero />
      <Reel2Services />
      <Reel3Process />
      <Reel4Contact />
      <SocialLinks />
      <ReelIndicators currentReel={currentReel} scrollToSection={scrollToSection} />
    </>
  );
} 