import React, { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useServices, useServiceScroll } from '../../hooks/useServices';
import { useLanguage } from '../../hooks/useLanguage';
import ServiceBlock from '../services/ServiceBlock';

interface Reel2ServicesProps {
  lang?: string;
}

export default function Reel2Services({ lang = 'pl' }: Reel2ServicesProps) {
  const { t, currentLang } = useLanguage();
  const { services, loading, error, trackServiceView } = useServices();
  const { scrollProgress, activeServiceIndex, handleScroll, setActiveServiceIndex } = useServiceScroll();
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

    // Keyboard navigation with arrow keys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        const newIndex = Math.max(0, activeServiceIndex - 1);
        setActiveServiceIndex(newIndex);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        const newIndex = Math.min(services.length - 1, activeServiceIndex + 1);
        setActiveServiceIndex(newIndex);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeServiceIndex, services.length]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const backgroundOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.3, 0.8, 0.8, 0.3]);

  // Optional: Auto-scroll through services (disabled to avoid conflicts)
  useEffect(() => {
    // Auto-scroll disabled to work with main navigation system
    // Could be re-enabled with proper integration if needed
  }, [activeServiceIndex, services.length]);

  if (loading) {
    return (
      <section className="relative min-h-screen bg-gradient-to-br from-black to-zinc-900 flex items-center justify-center">
        <motion.div
          className="flex items-center gap-4 text-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <span className="text-lg">Loading services...</span>
        </motion.div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="relative min-h-screen bg-gradient-to-br from-black to-zinc-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Error loading services</h2>
          <p className="text-white/70">{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section 
      ref={containerRef}
      className="reel reel-2 relative min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black overflow-hidden"
    >
      {/* Animated background */}
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.03),transparent_50%)]"
        style={{ 
          y: backgroundY,
          opacity: backgroundOpacity
        }}
      />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[100px_100px]" />

      {/* Section header */}
      <div className="relative z-10 pt-8 md:pt-16 pb-4 md:pb-8 px-4 md:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true }}
        >
          <motion.h2
            className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-white mb-4 md:mb-6 leading-none tracking-tight"
            style={{
              fontFamily: "ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'"
            }}
          >
            {t('services.new_section.title')}
          </motion.h2>
          <motion.p
            className="text-lg md:text-xl lg:text-2xl text-white/60 max-w-3xl mx-auto px-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            {t('services.new_section.subtitle')}
          </motion.p>
        </motion.div>
      </div>

      {/* Content container - zapewniam zawsze widoczną nawigację */}
      <div className="relative flex-1 flex flex-col min-h-0">
        {/* Service Block Container - flex-1 ale z max-height */}
        <div className="flex-1 px-4 md:px-6 lg:px-12 flex items-center justify-center min-h-0 py-4 relative">
          <div className="w-full max-w-6xl h-full max-h-[calc(100vh-300px)] flex items-center justify-center">
            <ServiceBlock
              key={services[activeServiceIndex]?.id}
              service={services[activeServiceIndex]}
              isActive={true}
              index={activeServiceIndex}
              onView={trackServiceView}
            />
          </div>

          {/* Left arrow - bliżej środka */}
          {activeServiceIndex > 0 && (
            <button
              onClick={() => {
                const newIndex = Math.max(0, activeServiceIndex - 1);
                setActiveServiceIndex(newIndex);
              }}
              className="absolute left-[100px] md:left-[120px] lg:left-[150px] top-1/2 transform -translate-y-1/2 z-10 group transition-all duration-300 hover:scale-110"
            >
              <svg 
                width="32" 
                height="32" 
                viewBox="0 0 24 24" 
                fill="none" 
                className="text-white/70 group-hover:text-white transition-all duration-300 group-hover:-translate-x-2 drop-shadow-lg"
              >
                <path 
                  d="M15 18L9 12L15 6" 
                  stroke="currentColor" 
                  strokeWidth="2.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )}

          {/* Right arrow - bliżej środka z pulsowaniem */}
          {activeServiceIndex < services.length - 1 && (
            <motion.button
              onClick={() => {
                const newIndex = Math.min(services.length - 1, activeServiceIndex + 1);
                setActiveServiceIndex(newIndex);
              }}
              className="absolute right-[100px] md:right-[120px] lg:right-[150px] top-1/2 transform -translate-y-1/2 z-10 group transition-all duration-300 hover:scale-110"
              initial={{ scale: 1 }}
              animate={{ 
                scale: activeServiceIndex === 0 ? [1, 1.1, 1] : 1 
              }}
              transition={{ 
                duration: 2, 
                repeat: activeServiceIndex === 0 ? Infinity : 0,
                ease: "easeInOut" 
              }}
            >
              <svg 
                width="32" 
                height="32" 
                viewBox="0 0 24 24" 
                fill="none" 
                className="text-white/70 group-hover:text-white transition-all duration-300 group-hover:translate-x-2 drop-shadow-lg"
              >
                <path 
                  d="M9 18L15 12L9 6" 
                  stroke="currentColor" 
                  strokeWidth="2.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
            </motion.button>
          )}
        </div>
        
        {/* Navigation area - tylko hint i mobile progress */}
        <div className="flex-shrink-0 px-6 md:px-8 lg:px-12 py-4 md:py-6 bg-gradient-to-t from-black/20 to-transparent">
          {/* Hint text */}
          <div className="text-center mb-3 md:mb-4">
            <p className="text-white/40 text-xs md:text-sm">
              {activeServiceIndex < services.length - 1 
                ? t('services.new_section.hint_next') || "Przesuń dalej, aby odkryć więcej usług"
                : t('services.new_section.hint_complete') || "Poznałeś wszystkie nasze usługi!"
              }
            </p>
          </div>
          
          {/* Mobile progress indicator */}
          <div className="flex md:hidden justify-center">
            <div className="flex items-center gap-2">
              {services.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full border transition-all duration-300 hover:scale-125 ${
                    activeServiceIndex === index
                      ? 'bg-white border-white'
                      : 'bg-transparent border-white/30'
                  }`}
                  onClick={() => setActiveServiceIndex(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>



      {/* Progress indicator - ukryty na mobile, widoczny na większych ekranach */}
      <div className="hidden md:block relative z-10 flex-shrink-0 py-4 md:py-6 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center gap-3 md:gap-4 mb-3 md:mb-4">
            {services.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full border-2 transition-all duration-300 hover:scale-110 ${
                  activeServiceIndex === index
                    ? 'bg-white border-white'
                    : 'bg-transparent border-white/30 hover:border-white/50'
                }`}
                onClick={() => setActiveServiceIndex(index)}
              />
            ))}
          </div>

          {/* Progress bar */}
          <div className="w-full max-w-md mx-auto h-1 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-white/50 to-white rounded-full transition-all duration-300"
              style={{ 
                width: `${((activeServiceIndex + 1) / services.length) * 100}%`
              }}
            />
          </div>
          
          {/* Service counter */}
          <div className="text-center mt-3 md:mt-4">
            <span className="text-white/50 text-xs md:text-sm">
              {t('services.new_section.counter')
                .replace('{current}', (activeServiceIndex + 1).toString())
                .replace('{total}', services.length.toString())}
            </span>
          </div>
        </div>
      </div>

    </section>
  );
} 