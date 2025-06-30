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
      <div className="relative z-10 pt-16 pb-8 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true }}
        >
          <motion.h2
            className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6 leading-none tracking-tight"
            style={{
              fontFamily: "ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'"
            }}
          >
            {t('services.new_section.title')}
          </motion.h2>
          <motion.p
            className="text-xl md:text-2xl text-white/60 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            {t('services.new_section.subtitle')}
          </motion.p>
        </motion.div>
      </div>

            {/* Content container - zwiększona wysokość */}
      <div className="relative flex-1 min-h-[70vh] pb-24">
        <div className="relative h-full flex flex-col">
          {/* Showing one service at a time */}
          <div className="flex-1 px-6 md:px-12 flex items-center justify-center">
            <ServiceBlock
              key={services[activeServiceIndex]?.id}
              service={services[activeServiceIndex]}
              isActive={true}
              index={activeServiceIndex}
              onView={trackServiceView}
            />
          </div>
          
          {/* Navigation arrows pod kartą na szerokość contentu */}
          <div className="px-6 md:px-12 py-6">
            <div className="max-w-6xl mx-auto flex items-center justify-between">
              <button
                onClick={() => {
                  const newIndex = Math.max(0, activeServiceIndex - 1);
                  setActiveServiceIndex(newIndex);
                }}
                disabled={activeServiceIndex === 0}
                className="group disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300"
              >
                <div className="flex items-center gap-2 md:gap-3 text-white/70 hover:text-white group-disabled:text-white/30">
                  <svg 
                    width="20" 
                    height="20" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    className="transition-transform group-hover:-translate-x-1 md:w-6 md:h-6"
                  >
                    <path 
                      d="M19 12H5M5 12L12 19M5 12L12 5" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="hidden md:inline text-lg font-medium tracking-wide">{t('services.new_section.navigation.prev')}</span>
                </div>
              </button>
              
              <button
                onClick={() => {
                  const newIndex = Math.min(services.length - 1, activeServiceIndex + 1);
                  setActiveServiceIndex(newIndex);
                }}
                disabled={activeServiceIndex === services.length - 1}
                className="group disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300"
              >
                <div className="flex items-center gap-2 md:gap-3 text-white/70 hover:text-white group-disabled:text-white/30">
                  <span className="hidden md:inline text-lg font-medium tracking-wide">{t('services.new_section.navigation.next')}</span>
                  <svg 
                    width="20" 
                    height="20" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    className="transition-transform group-hover:translate-x-1 md:w-6 md:h-6"
                  >
                    <path 
                      d="M5 12H19M19 12L12 5M19 12L12 19" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </button>
            </div>
          </div>
         </div>
        </div>

      {/* Progress indicator - przeniesione wyżej */}
      <div className="relative z-10 py-6 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center gap-4 mb-4">
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
          <div className="text-center mt-4">
            <span className="text-white/50 text-sm">
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