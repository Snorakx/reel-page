import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import StorySlide from './StorySlide.tsx';

// Dane dla kroków procesu
const storySteps = [
  {
    id: 'ziarno',
    title: 'Ziarno',
    subtitle: 'Masz pomysł. Albo tylko jego cień.',
    description: 'Możemy zbudować coś z niczego. Dosłownie.',
    color: 'from-blue-600/20 to-indigo-900/30',
    blur: 'blur-[120px]'
  },
  {
    id: 'zrozumienie',
    title: 'Zrozumienie',
    subtitle: 'Zadajemy pytania. Piszemy na Miro, rozrysowujemy.',
    description: 'Nie musisz wiedzieć, co to MVP – zrozumiesz po rozmowie.',
    color: 'from-purple-600/20 to-blue-900/30',
    blur: 'blur-[150px]'
  },
  {
    id: 'prototyp',
    title: 'Prototyp',
    subtitle: 'Interaktywna makieta do klikania, nie PDF do śnienia.',
    description: 'Testujesz z klientami lub inwestorem już za chwilę.',
    color: 'from-indigo-600/20 to-purple-900/30',
    blur: 'blur-[130px]'
  },
  {
    id: 'start',
    title: 'Start',
    subtitle: 'Kodujemy. Szybko, ale czysto.',
    description: 'Twój pomysł staje się prawdziwym produktem.',
    color: 'from-cyan-600/20 to-blue-900/30',
    blur: 'blur-[140px]'
  }
];

export default function StorytellingSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const isInView = useInView(containerRef, { amount: 0.3 });
  const [hasEntered, setHasEntered] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [heroHeight, setHeroHeight] = useState(0);
  const [sectionOffsetTop, setSectionOffsetTop] = useState(0);
  const [firstRender, setFirstRender] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [shouldRenderSlides, setShouldRenderSlides] = useState(false);
  
  // Inicjalizacja po załadowaniu komponentu
  useEffect(() => {
    // Krótkie opóźnienie, aby upewnić się, że układ DOM jest stabilny
    const timer = setTimeout(() => {
      setIsInitialized(true);
      setHasEntered(true);
      
      // Get hero section height
      const heroSection = document.getElementById('hero');
      if (heroSection) {
        setHeroHeight(heroSection.offsetHeight);
      }
      
      // Get the storytelling section's offset from top of document
      const jakPracujemySection = document.getElementById('jak-pracujemy');
      if (jakPracujemySection) {
        setSectionOffsetTop(jakPracujemySection.offsetTop);
      }
      
      // Force first slide to be active on first render
      setActiveIndex(0);
      
      // Store initial scroll position
      setLastScrollY(window.scrollY);

      // Check if we should render slides based on initial position
      const initialScrollY = window.scrollY;
      const viewportHeight = window.innerHeight;
      const initialSectionOffset = jakPracujemySection?.offsetTop || 0;
      
      // Only render slides if we're near the storytelling section
      setShouldRenderSlides(initialScrollY > initialSectionOffset - viewportHeight);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Listen for events from Astro component
  useEffect(() => {
    // Function to update measurements from event
    const handleMeasurementsUpdate = (event: CustomEvent<{sectionOffsetTop: number, heroHeight: number}>) => {
      const { sectionOffsetTop, heroHeight } = event.detail;
      setSectionOffsetTop(sectionOffsetTop);
      setHeroHeight(heroHeight);
    };
    
    // Listen for visibility event
    const handleSectionVisible = (event: CustomEvent<{sectionOffsetTop: number, heroHeight: number}>) => {
      handleMeasurementsUpdate(event);
      setIsVisible(true);
      setShouldRenderSlides(true);
      
      // Reset to first slide when section becomes visible
      setActiveIndex(0);
      setFirstRender(true);
    };
    
    // Type assertion for event handlers
    const handleMeasurementsUpdateTyped = handleMeasurementsUpdate as EventListener;
    const handleSectionVisibleTyped = handleSectionVisible as EventListener;
    
    // Add event listeners
    window.addEventListener('storytelling-measurements-updated', handleMeasurementsUpdateTyped);
    window.addEventListener('storytelling-section-visible', handleSectionVisibleTyped);
    
    return () => {
      // Remove event listeners on cleanup
      window.removeEventListener('storytelling-measurements-updated', handleMeasurementsUpdateTyped);
      window.removeEventListener('storytelling-section-visible', handleSectionVisibleTyped);
    };
  }, []);
  
  // Track if the section is in viewport
  useEffect(() => {
    setIsVisible(isInView);
    
    // If section leaves view while scrolling up, explicitly hide all slides
    if (!isInView && window.scrollY < lastScrollY) {
      const slides = document.querySelectorAll('.story-slide-visible');
      slides.forEach(slide => {
        (slide as HTMLElement).style.opacity = '0';
        (slide as HTMLElement).style.visibility = 'hidden';
        slide.classList.remove('story-slide-visible');
      });
      
      // If scrolling up towards hero, don't render slides at all
      if (window.scrollY < sectionOffsetTop - window.innerHeight) {
        setShouldRenderSlides(false);
      }
    }
  }, [isInView, lastScrollY, sectionOffsetTop]);
  
  // Listen for reset signal from the hero section observer
  useEffect(() => {
    if (!containerRef.current) return;
    
    const handleAttributeChange = () => {
      const container = containerRef.current;
      if (container?.getAttribute('data-reset') === 'true') {
        setIsVisible(false);
        setShouldRenderSlides(false);
        
        // Explicitly hide all slides
        const slides = container.querySelectorAll('div[style*="visibility"]');
        slides.forEach(slide => {
          (slide as HTMLElement).style.opacity = '0';
          (slide as HTMLElement).style.visibility = 'hidden';
        });
        
        container.setAttribute('data-reset', 'false');
      }
    };
    
    // Set up mutation observer to watch for attribute changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'data-reset') {
          handleAttributeChange();
        }
      });
    });
    
    observer.observe(containerRef.current, { attributes: true });
    
    return () => observer.disconnect();
  }, [isInitialized]);
  
  // Get section attributes directly from DOM if state values aren't available
  const getSectionOffset = () => {
    if (sectionOffsetTop > 0) return sectionOffsetTop;
    
    const jakPracujemySection = document.getElementById('jak-pracujemy');
    if (jakPracujemySection) {
      const offset = jakPracujemySection.offsetTop;
      if (offset > 0) return offset;
      
      // Try to get from data attribute
      const offsetFromAttr = jakPracujemySection.getAttribute('data-offset-top');
      return offsetFromAttr ? parseInt(offsetFromAttr, 10) : 0;
    }
    return 0;
  };
  
  // Obsługa progres bara i śledzenie aktywnego slajdu
  useEffect(() => {
    // Zatrzymaj obsługę przewijania, jeśli sekcja nie jest jeszcze zainicjalizowana
    if (!isInitialized || !containerRef.current) return;
    
    const handleScroll = () => {
      if (!containerRef.current) return;
      
      // Track scroll direction
      const currentScrollY = window.scrollY;
      const isScrollingUp = currentScrollY < lastScrollY;
      setLastScrollY(currentScrollY);
      
      const container = containerRef.current;
      const containerRect = container.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const scrollY = window.scrollY;
      const containerHeight = container.offsetHeight;
      const slideHeight = containerHeight / storySteps.length;
      
      // Get section offset taking into account the hero section
      const sectionStartPos = getSectionOffset();
      
      // Return early if we still couldn't determine offset
      if (sectionStartPos <= 0) return;
      
      // Check if we're in the section's viewport range (between start and end of section)
      // Use window.innerHeight as buffer to start showing first slide as we approach the section
      const sectionTop = sectionStartPos - windowHeight;
      const isInSectionRange = scrollY >= sectionTop && 
                               scrollY <= sectionStartPos + containerHeight;
      
      // Update shouldRenderSlides state based on scroll position
      const shouldRender = scrollY >= sectionTop - windowHeight * 0.5;
      if (shouldRender !== shouldRenderSlides) {
        setShouldRenderSlides(shouldRender);
      }
      
      // If scrolling up and approaching the hero section, force hide all slides
      if (isScrollingUp && scrollY < sectionStartPos - (windowHeight * 0.3)) {
        setIsVisible(false);
        setShouldRenderSlides(false);
        
        // Force hide all slides when scrolling up towards hero
        document.querySelectorAll('.story-slide-visible').forEach(el => {
          (el as HTMLElement).style.opacity = '0';
          (el as HTMLElement).style.visibility = 'hidden';
          el.classList.remove('story-slide-visible');
        });
        return;
      }
      
      if (isInSectionRange) {
        setIsVisible(true);
        setShouldRenderSlides(true);
        
        // Calculate scroll position relative to the section start
        const relativeScrollPos = scrollY - sectionStartPos + windowHeight;
        
        // Make sure the first point is properly triggered - don't go negative
        const adjustedScrollPos = Math.max(0, relativeScrollPos);
        
        // Special handling for the first render and first slide
        if (firstRender && scrollY < sectionStartPos + (slideHeight * 0.5)) {
          // Keep showing the first slide until user has scrolled enough
          setActiveIndex(0);
          return;
        }
        
        // Now we're definitely past the first render phase
        if (firstRender) {
          setFirstRender(false);
        }
        
        // Use increased threshold for first slide to make it "sticky"
        // We want the first slide to remain visible longer before transitioning to second slide
        const firstSlideThreshold = slideHeight * 1.2; // 20% more space for first slide
        
        let currentIndex = 0;
        
        if (adjustedScrollPos < firstSlideThreshold) {
          currentIndex = 0;
        } else {
          // For slides beyond the first one, use regular calculation
          const slideProgress = (adjustedScrollPos - firstSlideThreshold) / 
                                (slideHeight * (storySteps.length - 1)) * (storySteps.length - 1);
          currentIndex = Math.min(
            Math.max(1, Math.floor(1 + slideProgress)), // Start from 1 (second slide)
            storySteps.length - 1
          );
        }
        
        setActiveIndex(currentIndex);
      } else {
        // Not in viewport
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Inicjalne ustawienie

    return () => window.removeEventListener('scroll', handleScroll);
  }, [isInitialized, firstRender, lastScrollY, shouldRenderSlides]);

  // Listen for window visibility changes to handle hidden tabs
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Page is not visible
        return;
      }
      
      // Page became visible again, check position
      const scrollY = window.scrollY;
      const sectionPos = getSectionOffset();
      
      // If we're not near the storytelling section, don't render slides
      if (scrollY < sectionPos - window.innerHeight) {
        setShouldRenderSlides(false);
        setIsVisible(false);
      }
    };
    
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  // Progres bar
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Jeśli nie jest zainicjalizowany, zwróć pusty div aby nie blokować renderowania
  if (!isInitialized) {
    return <div ref={containerRef} style={{ height: `${storySteps.length * 100}vh` }}></div>;
  }

  return (
    <div 
      ref={containerRef} 
      id="storytelling-container"
      className="relative bg-[#0B0F1A] overflow-hidden"
      style={{ height: `${storySteps.length * 100}vh` }}
      data-reset="false"
    >
      {/* Progress bar - tylko gdy sekcja jest w widoku */}
      {hasEntered && isVisible && (
        <div className="fixed top-0 left-0 w-full z-50 px-4 py-2">
          <div className="h-1 bg-gray-800/50 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-blue-500"
              style={{ 
                scaleX: scrollYProgress,
                transformOrigin: "left" 
              }}
            />
          </div>
          
          {/* Progress indicators */}
          <div className="hidden md:flex items-center justify-center space-x-2 mt-2">
            {storySteps.map((step, index) => (
              <div 
                key={step.id}
                className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                  index <= activeIndex ? 'bg-blue-500' : 'bg-gray-700'
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Only render slides when necessary - critical fix for overlap issues */}
      {shouldRenderSlides && (
        <>
          {storySteps.map((step, index) => (
            <StorySlide
              key={step.id}
              index={index}
              title={step.title}
              subtitle={step.subtitle}
              description={step.description}
              color={step.color}
              blur={step.blur}
              isActive={hasEntered && isVisible && index === activeIndex}
            />
          ))}
        </>
      )}
    </div>
  );
} 