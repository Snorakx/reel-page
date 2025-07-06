import React, { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useServices, useServiceScroll } from '../../hooks/useServices';
import { useLanguage } from '../../hooks/useLanguage';
import ServiceBlock from './ServiceBlock';

interface WhatWeDoSectionProps {
  className?: string;
}

const WhatWeDoSection: React.FC<WhatWeDoSectionProps> = ({ className = '' }) => {
  const { t } = useLanguage();
  const { services, loading, error, trackServiceView } = useServices();
  const { scrollProgress, activeServiceIndex, handleScroll } = useServiceScroll();
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const backgroundOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.3, 0.8, 0.8, 0.3]);

  // Auto-scroll effect (optional)
  useEffect(() => {
    const interval = setInterval(() => {
      if (scrollRef.current && services.length > 0) {
        const container = scrollRef.current;
        const serviceWidth = container.clientWidth * 0.9;
        const nextIndex = (activeServiceIndex + 1) % services.length;
        
        container.scrollTo({
          left: nextIndex * serviceWidth,
          behavior: 'smooth'
        });
      }
    }, 10000); // Auto-scroll every 10 seconds

    return () => clearInterval(interval);
  }, [activeServiceIndex, services.length]);

  if (loading) {
    return (
      <section className={`relative min-h-[100dvh] bg-gradient-to-br from-black to-zinc-900 flex items-center justify-center ${className}`}>
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
      <section className={`relative min-h-[100dvh] bg-gradient-to-br from-black to-zinc-900 flex items-center justify-center ${className}`}>
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
      className={`relative min-h-[100dvh] bg-gradient-to-br from-black via-zinc-900 to-black overflow-hidden ${className}`}
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

      {/* Horizontal scrolling container */}
      <div className="relative h-[80vh] md:h-[85vh]">
        <motion.div
          ref={scrollRef}
          className="flex h-full overflow-x-auto scrollbar-hide gap-6 px-6 md:px-12"
          onScroll={handleScroll}
          style={{
            scrollSnapType: 'x mandatory',
            scrollPadding: '0 24px',
            scrollBehavior: 'smooth'
          }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          viewport={{ once: true }}
        >
          {services.map((service, index) => (
            <ServiceBlock
              key={service.id}
              service={service}
              isActive={activeServiceIndex === index}
              index={index}
              onView={trackServiceView}
            />
          ))}
        </motion.div>
      </div>

      {/* Progress indicator */}
      <div className="relative z-10 py-8 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="flex items-center justify-center gap-4 mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            {services.map((_, index) => (
              <motion.button
                key={index}
                className={`w-3 h-3 rounded-full border-2 transition-all duration-300 ${
                  activeServiceIndex === index
                    ? 'bg-white border-white'
                    : 'bg-transparent border-white/30 hover:border-white/50'
                }`}
                onClick={() => {
                  if (scrollRef.current) {
                    const serviceWidth = scrollRef.current.clientWidth * 0.9;
                    scrollRef.current.scrollTo({
                      left: index * serviceWidth,
                      behavior: 'smooth'
                    });
                  }
                }}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              />
            ))}
          </motion.div>

          {/* Progress bar */}
          <motion.div
            className="w-full max-w-md mx-auto h-1 bg-white/10 rounded-full overflow-hidden"
            initial={{ opacity: 0, scaleX: 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <motion.div
              className="h-full bg-gradient-to-r from-white/50 to-white rounded-full"
              style={{ 
                scaleX: scrollProgress,
                transformOrigin: "left"
              }}
            />
          </motion.div>
        </div>
      </div>

      {/* Scroll hint */}
      <motion.div
        className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white/40 text-sm flex items-center gap-2"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.6 }}
        animate={{
          y: [0, 5, 0],
        }}
      >
        <span className="hidden md:inline">Scroll horizontally to explore</span>
        <span className="md:hidden">Swipe to explore</span>
        <motion.svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          className="rotate-90"
          animate={{ x: [0, 4, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <path
            d="M7 17L17 7M17 7H7M17 7V17"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </motion.svg>
      </motion.div>

      {/* Mobile responsiveness: Convert to vertical on small screens */}
      <style>{`
        @media (max-width: 768px) {
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        }
      `}</style>
    </section>
  );
};

export default WhatWeDoSection; 