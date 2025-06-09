import { useEffect, useState, useRef } from 'react';
import { useTranslations } from '../../i18n/config';

interface Reel2ServicesProps {
  lang?: string;
}

export default function Reel2Services({ lang = 'pl' }: Reel2ServicesProps) {
  const t = useTranslations(lang);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const progressRef = useRef(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Intersection Observer to detect when section is in view
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsActive(entry.isIntersecting && entry.intersectionRatio > 0.1);
        });
      },
      { 
        threshold: [0, 0.1, 0.5, 0.9, 1],
        rootMargin: '-10% 0px -10% 0px'
      }
    );

    observer.observe(section);

    const handleWheel = (e: WheelEvent) => {
      // Only handle wheel events when section is active
      if (!isActive) return;
      
      // ALWAYS prevent default scroll when section is active and progress < 100%
      if (progressRef.current < 1) {
        e.preventDefault();
        e.stopPropagation();
        
        // Update progress based on scroll direction
        const delta = e.deltaY > 0 ? 0.02 : -0.02;
        progressRef.current = Math.max(0, Math.min(1, progressRef.current + delta));
        setScrollProgress(progressRef.current);
        
        return; // Don't allow any scroll until 100%
      }
      
      // If progress is 100% but animation not complete, still block
      if (progressRef.current >= 1 && !animationComplete) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      
      // Only allow scroll when animation is completely done
      if (progressRef.current >= 1 && animationComplete) {
        // Allow natural scroll to continue to next section
        return;
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isActive) return;
      
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        if (progressRef.current < 1) {
          e.preventDefault();
          progressRef.current = Math.min(1, progressRef.current + 0.1);
          setScrollProgress(progressRef.current);
        }
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        if (progressRef.current > 0) {
          e.preventDefault();
          progressRef.current = Math.max(0, progressRef.current - 0.1);
          setScrollProgress(progressRef.current);
          setAnimationComplete(false); // Reset animation complete state when going back
        }
      }
    };

    // Add event listeners with capture phase to ensure we catch the event first
    document.addEventListener('wheel', handleWheel, { passive: false, capture: true });
    document.addEventListener('keydown', handleKeyDown, { capture: true });

    return () => {
      observer.disconnect();
      document.removeEventListener('wheel', handleWheel, { capture: true });
      document.removeEventListener('keydown', handleKeyDown, { capture: true });
    };
  }, [isActive, animationComplete]);

  // Check if animation is complete with delay
  useEffect(() => {
    if (scrollProgress >= 1) {
      // Wait for all card animations to complete (2 seconds delay)
      const timer = setTimeout(() => {
        setAnimationComplete(true);
      }, 2000);

      return () => clearTimeout(timer);
    } else {
      setAnimationComplete(false);
    }
  }, [scrollProgress]);

  // Handle card click to set as "clicked" state
  const handleCardClick = (cardIndex: number) => {
    // Only allow clicking if card is revealed enough
    const cardProgress = getCardProgress(cardIndex);
    if (cardProgress > 0.3) {
      if (activeCard === cardIndex) {
        // If clicking the same active card, deactivate it
        setActiveCard(null);
        setHoveredCard(null);
      } else {
        // Activate new card and immediately set it as hovered (since mouse is likely on it)
        setActiveCard(cardIndex);
        setHoveredCard(cardIndex);
      }
    }
  };

  // Handle mouse enter - only works if card is already in "clicked" state
  const handleCardMouseEnter = (cardIndex: number) => {
    const cardProgress = getCardProgress(cardIndex);
    if (cardProgress > 0.3 && activeCard === cardIndex) {
      // Only allow hover effect if card is in "clicked" state
      setHoveredCard(cardIndex);
    }
  };

  // Handle mouse leave - reset clicked state and hover
  const handleCardMouseLeave = (cardIndex: number) => {
    setHoveredCard(null);
    
    // Remove "clicked" state when mouse leaves the clicked card
    if (activeCard === cardIndex) {
      setActiveCard(null);
    }
  };

  // Calculate individual card reveal progress
  const getCardProgress = (cardIndex: number) => {
    const totalCards = 3;
    const cardStart = cardIndex / totalCards;
    const cardEnd = (cardIndex + 1) / totalCards;
    
    if (scrollProgress < cardStart) return 0;
    if (scrollProgress > cardEnd) return 1;
    
    return (scrollProgress - cardStart) / (cardEnd - cardStart);
  };

  const getCardTransform = (cardIndex: number, progress: number) => {
    const baseY = cardIndex * 24; // Base stacking offset
    const baseX = cardIndex * -12;
    const baseRotate = (cardIndex - 1) * 1.5;
    
    // Reveal animation
    const revealY = (1 - progress) * 200; // Start 200px below
    const revealX = (1 - progress) * 100 * (cardIndex % 2 === 0 ? 1 : -1); // Alternate sides
    const revealRotate = (1 - progress) * 45 * (cardIndex % 2 === 0 ? 1 : -1); // Spinning in
    const revealScale = 0.5 + (progress * 0.5); // Scale from 50% to 100%
    
    // Active card effect - only if card is clicked AND hovered
    let activeY = 0;
    let activeX = 0;
    let activeRotate = 0;
    let activeScale = 1;
    let activeZ = 10 + cardIndex;
    
    // Card goes to front only if it's clicked AND currently hovered
    if (activeCard === cardIndex && hoveredCard === cardIndex) {
      activeY = -30; // Float above other cards
      activeX = 0; // Center it
      activeRotate = 0; // Straighten it
      activeScale = 1.05; // Slightly bigger
      activeZ = 100; // Bring to absolute front
    }
    
    return {
      transform: `
        translateY(${baseY + revealY + activeY}px) 
        translateX(${baseX + revealX + activeX}px) 
        rotate(${baseRotate + revealRotate + activeRotate}deg) 
        scale(${(revealScale) * activeScale})
        rotateY(${(1 - progress) * 180}deg)
      `,
      opacity: progress,
      zIndex: activeZ + Math.floor(progress * 10),
      transition: (activeCard === cardIndex && hoveredCard === cardIndex) 
        ? 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)' 
        : 'all 1s ease-out'
    };
  };

  return (
    <section 
      ref={sectionRef}
      className={`reel reel-2 h-screen w-full bg-black text-white relative overflow-hidden ${
        isActive && progressRef.current < 1 ? 'scroll-locked' : ''
      }`}
      style={{
        // Ensure section captures scroll events
        position: 'relative',
        zIndex: isActive && progressRef.current < 1 ? 100 : 'auto'
      }}
    >
      {/* Enhanced dark background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-800"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIiBzdHJva2Utd2lkdGg9IjAuNSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20"></div>
        
        {/* Floating particles that respond to scroll */}
        <div 
          className="absolute top-1/4 left-1/4 w-2 h-2 bg-cyan-400 rounded-full animate-pulse opacity-40"
          style={{ transform: `translateY(${scrollProgress * 50}px) rotate(${scrollProgress * 360}deg)` }}
        ></div>
        <div 
          className="absolute top-3/4 right-1/4 w-1 h-1 bg-purple-400 rounded-full animate-pulse delay-1000 opacity-40"
          style={{ transform: `translateY(${-scrollProgress * 30}px) rotate(${-scrollProgress * 180}deg)` }}
        ></div>
        <div 
          className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse delay-2000 opacity-40"
          style={{ transform: `translateX(${scrollProgress * 40}px) rotate(${scrollProgress * 270}deg)` }}
        ></div>
      </div>
      
      {/* Cool terminal header */}
      <div className="absolute top-0 left-0 right-0 h-8 bg-gray-900 border-b border-cyan-400/30 flex items-center px-4 z-50">
        <div className="flex space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-full shadow-[0_0_10px_rgba(239,68,68,0.8)]"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full shadow-[0_0_10px_rgba(234,179,8,0.8)]"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.8)]"></div>
        </div>
        <div className="ml-4 text-xs text-cyan-400 font-mono">
          coderno.exe --services --3d --shuffle [{Math.floor(scrollProgress * 100)}%] 
          {isActive ? (scrollProgress < 1 ? t('services.terminal.locked') : t('services.terminal.active')) : t('services.terminal.standby')} 
          {scrollProgress >= 1 && !animationComplete && ` ${t('services.terminal.finalizing')}`}
          {animationComplete && ` ${t('services.terminal.complete')}`}
          {activeCard !== null && ` ${t('services.terminal.card_clicked', { 0: activeCard + 1 })}`}
          {hoveredCard !== null && ` ${t('services.terminal.hover', { 0: hoveredCard + 1 })}`}
        </div>
      </div>
      
      <div className="max-w-none w-full px-6 z-10 reel-content pt-16 h-full flex flex-col justify-center">
        
        {/* Main Title with scroll-based animation */}
        <div 
          className="text-center mb-8"
          style={{ 
            opacity: Math.min(1, scrollProgress * 3 + 0.3),
            transform: `translateY(${(1 - Math.min(1, scrollProgress * 2)) * 30}px)`
          }}
        >
          <h3 className="text-4xl md:text-6xl font-black mb-4 tracking-tighter">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-white to-purple-400">
              {t('services.title')}
            </span>
          </h3>
          <p className="text-lg text-gray-300 font-light">
            {t('services.subtitle')}
          </p>
        </div>
        
        {/* Large 3D Cards Container with shuffling animation */}
        <div className="relative flex justify-center items-center min-h-[600px] perspective-1000">
          
          {/* Card Stack with progressive reveal */}
          <div className="relative w-[70vw] max-w-4xl h-[500px]" style={{ perspective: '1000px' }}>
            
            {/* Card 1 - AI (Reveals first) */}
            <div 
              className="group absolute inset-0 ease-out cursor-pointer"
              style={getCardTransform(0, getCardProgress(0))}
              onClick={() => handleCardClick(0)}
              onMouseEnter={() => handleCardMouseEnter(0)}
              onMouseLeave={() => handleCardMouseLeave(0)}
            >
              <div className="relative w-full h-full group-hover:rotate-y-12 group-hover:-translate-y-4 group-hover:translate-x-12 transition-all duration-700 ease-out" style={{ transformStyle: 'preserve-3d' }}>
                
                {/* Card Front */}
                <div className="absolute inset-0 w-full h-full backface-hidden rounded-3xl bg-gradient-to-br from-gray-800 via-gray-900 to-black border border-cyan-500/30 shadow-2xl shadow-cyan-500/20 p-12">
                  
                  {/* Card number */}
                  <div className="absolute top-6 right-6 text-sm text-cyan-400 font-mono">UC_001</div>
                  
                  {/* Glowing border effect - only shows when clicked AND hovered */}
                  <div className={`absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-blue-500/10 rounded-3xl transition-opacity duration-700 ${
                    (activeCard === 0 && hoveredCard === 0) ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                  }`}></div>
                  
                  {/* Clicked state indicator */}
                  {activeCard === 0 && (
                    <div className="absolute top-6 left-6">
                      <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(6,182,212,0.8)]"></div>
                    </div>
                  )}
                  
                  {/* Content */}
                  <div className="relative z-10 h-full flex flex-col justify-between">
                    <div>
                      <div className="w-20 h-20 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
                        <svg className="w-12 h-12 text-cyan-400" viewBox="0 0 100 100" fill="none">
                          <path d="M25 40 Q50 20 75 40 Q80 50 75 60 Q50 80 25 60 Q20 50 25 40 Z" stroke="currentColor" strokeWidth="4" fill="none" className="animate-pulse"/>
                          <circle cx="40" cy="45" r="3" fill="currentColor" className="animate-bounce"/>
                          <circle cx="60" cy="45" r="3" fill="currentColor" className="animate-bounce delay-300"/>
                          <path d="M35 58 Q50 68 65 58" stroke="currentColor" strokeWidth="3"/>
                          <circle cx="20" cy="25" r="2" fill="currentColor" className="animate-ping"/>
                          <circle cx="80" cy="25" r="2" fill="currentColor" className="animate-ping delay-500"/>
                          <circle cx="50" cy="20" r="2" fill="currentColor" className="animate-ping delay-1000"/>
                          <path d="M20 25 Q35 30 50 20 Q65 30 80 25" stroke="currentColor" strokeWidth="2" className="opacity-60"/>
                        </svg>
                      </div>
                      
                      <h4 className="text-3xl font-bold text-cyan-400 mb-4">{t('services.cards.ai.title')}</h4>
                      <p className="text-xl text-gray-300 leading-relaxed">
                        {t('services.cards.ai.description')}
                      </p>
                    </div>
                    
                    <div className="text-base text-gray-400 border-t border-gray-700 pt-6">
                      {t('services.cards.ai.tagline')}
                    </div>
                  </div>
                </div>
                
                {/* Card Back */}
                <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-3xl bg-gradient-to-br from-cyan-900 via-black to-cyan-800 border border-cyan-400/50 shadow-2xl p-12">
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-6xl mb-4">🤖</div>
                      <h5 className="text-2xl font-bold text-cyan-400 mb-4">{t('services.cards.ai.back_title')}</h5>
                      <p className="text-gray-300">{t('services.cards.ai.back_subtitle')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Card 2 - Optimization (Reveals second) */}
            <div 
              className="group absolute inset-0 ease-out cursor-pointer"
              style={getCardTransform(1, getCardProgress(1))}
              onClick={() => handleCardClick(1)}
              onMouseEnter={() => handleCardMouseEnter(1)}
              onMouseLeave={() => handleCardMouseLeave(1)}
            >
              <div className="relative w-full h-full group-hover:rotate-y-12 group-hover:-translate-y-6 group-hover:translate-x-8 transition-all duration-700 ease-out" style={{ transformStyle: 'preserve-3d' }}>
                
                {/* Card Front */}
                <div className="absolute inset-0 w-full h-full backface-hidden rounded-3xl bg-gradient-to-br from-gray-800 via-gray-900 to-black border border-green-500/30 shadow-2xl shadow-green-500/20 p-12">
                  
                  {/* Card number */}
                  <div className="absolute top-6 right-6 text-sm text-green-400 font-mono">UC_002</div>
                  
                  {/* Glowing border effect */}
                  <div className={`absolute inset-0 bg-gradient-to-br from-green-500/10 via-transparent to-emerald-500/10 rounded-3xl transition-opacity duration-700 ${
                    (activeCard === 1 && hoveredCard === 1) ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                  }`}></div>
                  
                  {/* Clicked state indicator */}
                  {activeCard === 1 && (
                    <div className="absolute top-6 left-6">
                      <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.8)]"></div>
                    </div>
                  )}
                  
                  {/* Content */}
                  <div className="relative z-10 h-full flex flex-col justify-between">
                    <div>
                      <div className="w-20 h-20 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
                        <svg className="w-12 h-12 text-green-400" viewBox="0 0 100 100" fill="none">
                          <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="4" fill="none"/>
                          <path d="M30 50 A20 20 0 0 1 70 50" stroke="currentColor" strokeWidth="6" strokeLinecap="round"/>
                          <circle cx="50" cy="50" r="4" fill="currentColor"/>
                          <path d="M50 50 L68 32" stroke="currentColor" strokeWidth="4" strokeLinecap="round" className="animate-pulse"/>
                          <path d="M25 50 L30 50 M35 30 L40 35 M50 20 L50 25 M65 30 L60 35 M75 50 L70 50" stroke="currentColor" strokeWidth="3"/>
                          <path d="M75 32 L80 27 L85 32 M80 25 L85 20 L90 25" stroke="currentColor" strokeWidth="2" fill="none" className="animate-bounce"/>
                        </svg>
                      </div>
                      
                      <h4 className="text-3xl font-bold text-green-400 mb-4">{t('services.cards.optimization.title')}</h4>
                      <p className="text-xl text-gray-300 leading-relaxed">
                        {t('services.cards.optimization.description')}
                      </p>
                    </div>
                    
                    <div className="text-base text-gray-400 border-t border-gray-700 pt-6">
                      {t('services.cards.optimization.tagline')}
                    </div>
                  </div>
                </div>
                
                {/* Card Back */}
                <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-3xl bg-gradient-to-br from-green-900 via-black to-green-800 border border-green-400/50 shadow-2xl p-12">
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-6xl mb-4">⚡</div>
                      <h5 className="text-2xl font-bold text-green-400 mb-4">{t('services.cards.optimization.back_title')}</h5>
                      <p className="text-gray-300">{t('services.cards.optimization.back_subtitle')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Card 3 - MVP (Reveals last) */}
            <div 
              className="group absolute inset-0 ease-out cursor-pointer"
              style={getCardTransform(2, getCardProgress(2))}
              onClick={() => handleCardClick(2)}
              onMouseEnter={() => handleCardMouseEnter(2)}
              onMouseLeave={() => handleCardMouseLeave(2)}
            >
              <div className="relative w-full h-full group-hover:rotate-y-12 group-hover:-translate-y-8 group-hover:-translate-x-12 transition-all duration-700 ease-out" style={{ transformStyle: 'preserve-3d' }}>
                
                {/* Card Front */}
                <div className="absolute inset-0 w-full h-full backface-hidden rounded-3xl bg-gradient-to-br from-gray-800 via-gray-900 to-black border border-purple-500/30 shadow-2xl shadow-purple-500/20 p-12">
                  
                  {/* Card number */}
                  <div className="absolute top-6 right-6 text-sm text-purple-400 font-mono">UC_003</div>
                  
                  {/* Glowing border effect */}
                  <div className={`absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-pink-500/10 rounded-3xl transition-opacity duration-700 ${
                    (activeCard === 2 && hoveredCard === 2) ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                  }`}></div>
                  
                  {/* Clicked state indicator */}
                  {activeCard === 2 && (
                    <div className="absolute top-6 left-6">
                      <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(168,85,247,0.8)]"></div>
                    </div>
                  )}
                  
                  {/* Content */}
                  <div className="relative z-10 h-full flex flex-col justify-between">
                    <div>
                      <div className="w-20 h-20 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
                        <svg className="w-12 h-12 text-purple-400" viewBox="0 0 100 100" fill="none">
                          <ellipse cx="50" cy="40" rx="15" ry="25" fill="currentColor"/>
                          <path d="M42 15 L50 5 L58 15" fill="currentColor"/>
                          <circle cx="50" cy="35" r="4" fill="white"/>
                          <path d="M35 55 L25 75 L35 70 Z" fill="currentColor"/>
                          <path d="M65 55 L75 75 L65 70 Z" fill="currentColor"/>
                          <path d="M40 70 Q50 90 60 70" fill="url(#mvpFlame)" className="animate-pulse"/>
                          
                          <defs>
                            <linearGradient id="mvpFlame" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#F97316"/>
                              <stop offset="50%" stopColor="#EF4444"/>
                              <stop offset="100%" stopColor="#EC4899"/>
                            </linearGradient>
                          </defs>
                        </svg>
                      </div>
                      
                      <h4 className="text-3xl font-bold text-purple-400 mb-4">{t('services.cards.mvp.title')}</h4>
                      <p className="text-xl text-gray-300 leading-relaxed">
                        {t('services.cards.mvp.description')}
                      </p>
                    </div>
                    
                    <div className="text-base text-gray-400 border-t border-gray-700 pt-6">
                      {t('services.cards.mvp.tagline')}
                    </div>
                  </div>
                </div>
                
                {/* Card Back - 3D flip effect */}
                <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-3xl bg-gradient-to-br from-purple-900 via-black to-purple-800 border border-purple-400/50 shadow-2xl p-12">
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-6xl mb-4">🚀</div>
                      <h5 className="text-2xl font-bold text-purple-400 mb-4">{t('services.cards.mvp.back_title')}</h5>
                      <p className="text-gray-300">{t('services.cards.mvp.back_subtitle')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
          </div>
          
        </div>
        
        {/* Enhanced bottom hint with progress indicator */}
        <div 
          className="text-center mt-8"
          style={{ 
            opacity: Math.min(1, scrollProgress * 2 + 0.3),
            transform: `translateY(${(1 - Math.min(1, scrollProgress * 1.5)) * 20}px)`
          }}
        >
          <p className="text-sm text-gray-400 mb-4">
            {scrollProgress < 1 
              ? t('services.scroll.locked', { 0: Math.floor(scrollProgress * 100) })
              : animationComplete
                ? t('services.scroll.unlocked')
                : t('services.scroll.finalizing')
            }
          </p>
          {scrollProgress >= 0.3 && scrollProgress < 1 && (
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <p className="text-xs text-white font-medium animate-pulse">
                {t('services.hints.click_card')}
              </p>
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            </div>
          )}
          {activeCard !== null && (
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce"></div>
              <p className="text-xs text-green-400 font-medium">
                {t('services.hints.hover_card')}
              </p>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce"></div>
            </div>
          )}
          <div className="flex justify-center space-x-3 mb-4">
            <div 
              className={`w-3 h-3 rounded-full transition-all duration-500 ${
                getCardProgress(0) > 0.5 ? 'bg-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.8)]' : 'bg-gray-600'
              } ${activeCard === 0 ? 'animate-pulse scale-125' : ''}`}
            ></div>
            <div 
              className={`w-3 h-3 rounded-full transition-all duration-500 ${
                getCardProgress(1) > 0.5 ? 'bg-green-400 shadow-[0_0_10px_rgba(34,197,94,0.8)]' : 'bg-gray-600'
              } ${activeCard === 1 ? 'animate-pulse scale-125' : ''}`}
            ></div>
            <div 
              className={`w-3 h-3 rounded-full transition-all duration-500 ${
                getCardProgress(2) > 0.5 ? 'bg-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.8)]' : 'bg-gray-600'
              } ${activeCard === 2 ? 'animate-pulse scale-125' : ''}`}
            ></div>
          </div>
          {/* Progress bar */}
          <div className="w-48 h-1 bg-gray-800 rounded-full mx-auto overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-cyan-400 via-green-400 to-purple-400 transition-all duration-300 ease-out"
              style={{ width: `${scrollProgress * 100}%` }}
            ></div>
          </div>
          
          {/* Animation completion indicator */}
          {scrollProgress >= 1 && (
            <div className="mt-4">
              <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs ${
                animationComplete 
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                  : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                  animationComplete ? 'bg-green-400' : 'bg-yellow-400 animate-pulse'
                }`}></div>
                <span>{animationComplete ? t('services.completion.ready') : t('services.completion.finalizing')}</span>
              </div>
            </div>
          )}
        </div>
        
      </div>
    </section>
  );
}