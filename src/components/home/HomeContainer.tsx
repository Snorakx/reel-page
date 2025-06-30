import { useState, useEffect } from 'react';
import Header from '../shared/Header.tsx';
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
  const [lastScrollTime, setLastScrollTime] = useState(0);
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
      }, 800); // Reduced timeout for better responsiveness
    }
  };

  useEffect(() => {
    // Footer pokazuje się po ostatnim reel (Contact)
    setShowFooter(currentReel === totalReels - 1);
  }, [currentReel, totalReels]);

  useEffect(() => {
    // Wheel handling z debouncing dla MacBook touchpad
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      
      const now = Date.now();
      const timeSinceLastScroll = now - lastScrollTime;
      
      // Debouncing - ignoruj szybkie wheel eventy (typowe dla MacBook touchpad)
      if (timeSinceLastScroll < 100) return;
      
      // Jeśli już scrollujemy, nie rób nic
      if (isScrolling) return;
      
      // Ignoruj bardzo małe delta (przypadkowe doknięcia)
      if (Math.abs(e.deltaY) < 5) return;
      
      setLastScrollTime(now);
      
      // Zwykła nawigacja w górę/dół między sekcjami - tylko jedna sekcja na gest
      if (e.deltaY > 0 && currentReel < totalReels - 1) {
        scrollToSection(currentReel + 1);
      } else if (e.deltaY < 0 && currentReel > 0) {
        scrollToSection(currentReel - 1);
      }
    };

    // Touch handling z throttling
    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const now = Date.now();
      const timeSinceLastScroll = now - lastScrollTime;
      
      // Throttling dla touch events
      if (timeSinceLastScroll < 200) return;
      
      if (isScrolling) return;
      
      const touchEndY = e.changedTouches[0].clientY;
      const diffY = touchStartY - touchEndY;
      
      // Swipe navigation - tylko jeśli wystarczająco duży ruch
      if (Math.abs(diffY) > 50) {
        setLastScrollTime(now);
        
        if (diffY > 0 && currentReel < totalReels - 1) {
          scrollToSection(currentReel + 1);
        } else if (diffY < 0 && currentReel > 0) {
          scrollToSection(currentReel - 1);
        }
      }
    };

    // Keyboard navigation z throttling
    const handleKeydown = (e: KeyboardEvent) => {
      const now = Date.now();
      const timeSinceLastScroll = now - lastScrollTime;
      
      // Throttling dla keyboard events
      if (timeSinceLastScroll < 150) return;
      
      if (isScrolling) return;
      
      if (e.key === 'ArrowDown' && currentReel < totalReels - 1) {
        setLastScrollTime(now);
        scrollToSection(currentReel + 1);
      } else if (e.key === 'ArrowUp' && currentReel > 0) {
        setLastScrollTime(now);
        scrollToSection(currentReel - 1);
      }
    };

    // Add event listeners - TYLKO dla non-scrollable areas
    document.addEventListener('wheel', handleWheel, { passive: false });
    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });
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
  }, [currentReel, isScrolling, showFooter, lastScrollTime]);

  return (
    <>
      <Header scrollToSection={scrollToSection} lang={lang} />
      <Reel1Hero lang={lang} />
      <Reel2Services lang={lang} />
      <Reel3Process lang={lang} />
      <Reel4Contact lang={lang} />
      <SocialLinks />
      <ReelIndicators currentReel={currentReel} scrollToSection={scrollToSection} />
    </>
  );
} 