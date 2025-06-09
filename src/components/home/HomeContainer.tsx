import { useState, useEffect } from 'react';
import Navigation from './Navigation.tsx';
import Reel1Hero from './Reel1Hero.tsx';
import Reel2Services from './Reel2Services.tsx';
import Reel3Process from './Reel3Process.tsx';
import Reel4Contact from './Reel4Contact.tsx';
import SocialLinks from './SocialLinks.tsx';
import ReelIndicators from './ReelIndicators.tsx';


interface HomeContainerProps {
  lang?: string;
}

export default function HomeContainer({ lang = 'pl' }: HomeContainerProps) {
  const [currentReel, setCurrentReel] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [showFooter, setShowFooter] = useState(false);
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
    // Footer pokazuje się po ostatnim reel (Contact)
    setShowFooter(currentReel === totalReels - 1);
  }, [currentReel, totalReels]);

  useEffect(() => {
    // Wheel scroll handling
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      
      if (isScrolling) return;
      
      // Sprawdź czy footer jest widoczny w viewport
      const footerElement = document.querySelector('footer');
      const isActuallyInFooter = showFooter && footerElement && 
        footerElement.getBoundingClientRect().top < window.innerHeight * 0.8;
      
      if (e.deltaY > 0 && currentReel < totalReels - 1) {
        scrollToSection(currentReel + 1);
      } else if (e.deltaY < 0) {
        if (isActuallyInFooter) {
          // Jeśli footer jest widoczny i scrollujemy w górę, wróć do ostatniego reel (Contact)
          scrollToSection(totalReels - 1);
        } else if (currentReel > 0) {
          scrollToSection(currentReel - 1);
        }
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
        // Sprawdź czy footer jest widoczny w viewport
        const footerElement = document.querySelector('footer');
        const isActuallyInFooter = showFooter && footerElement && 
          footerElement.getBoundingClientRect().top < window.innerHeight * 0.8;
        
        if (diff > 0 && currentReel < totalReels - 1) {
          scrollToSection(currentReel + 1);
        } else if (diff < 0) {
          if (isActuallyInFooter) {
            // Jeśli footer jest widoczny i swipe w dół, wróć do ostatniego reel (Contact)
            scrollToSection(totalReels - 1);
          } else if (currentReel > 0) {
            scrollToSection(currentReel - 1);
          }
        }
      }
    };

    // Keyboard navigation
    const handleKeydown = (e: KeyboardEvent) => {
      // Sprawdź czy footer jest widoczny w viewport
      const footerElement = document.querySelector('footer');
      const isActuallyInFooter = showFooter && footerElement && 
        footerElement.getBoundingClientRect().top < window.innerHeight * 0.8;
      
      if (e.key === 'ArrowDown' && currentReel < totalReels - 1) {
        scrollToSection(currentReel + 1);
      } else if (e.key === 'ArrowUp') {
        if (isActuallyInFooter) {
          // Jeśli footer jest widoczny i strzałka w górę, wróć do ostatniego reel (Contact)
          scrollToSection(totalReels - 1);
        } else if (currentReel > 0) {
          scrollToSection(currentReel - 1);
        }
      }
    };

    // Add event listeners
    document.addEventListener('wheel', handleWheel, { passive: false });
    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchend', handleTouchEnd);
    document.addEventListener('keydown', handleKeydown);

    // Make scrollToSection available globally for footer navigation
    (window as any).scrollToSection = scrollToSection;
    
    // Make showFooter available globally
    (window as any).shouldShowFooter = showFooter;

    // Cleanup
    return () => {
      document.removeEventListener('wheel', handleWheel);
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
      document.removeEventListener('keydown', handleKeydown);
    };
  }, [currentReel, isScrolling, showFooter]);

  return (
    <>
      <Navigation scrollToSection={scrollToSection} lang={lang} />
      <Reel1Hero lang={lang} />
      <Reel2Services lang={lang} />
      <Reel3Process lang={lang} />
      <Reel4Contact lang={lang} />
      <SocialLinks />
      <ReelIndicators currentReel={currentReel} scrollToSection={scrollToSection} />
    </>
  );
} 