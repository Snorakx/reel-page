import React from 'react';
import { motion } from 'framer-motion';
import type { ServiceData } from '../../repositories/ServicesRepository';
import ServiceIcon from './ServiceIcon';

interface ServiceBlockProps {
  service: ServiceData;
  isActive: boolean;
  index: number;
  onView: (serviceId: string) => void;
}

const ServiceBlock: React.FC<ServiceBlockProps> = ({ service, isActive, index, onView }) => {
  const blockVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  // Simplified - removed complex animations for better performance

  React.useEffect(() => {
    if (isActive) {
      onView(service.id);
    }
  }, [isActive, service.id, onView]);

  return (
    <motion.div
      className="relative flex-shrink-0 w-full max-w-6xl h-full flex items-center justify-center"
      variants={blockVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      {/* Simple background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-5 rounded-3xl blur-3xl`} />

      {/* Main content container */}
      <div className="relative w-full h-[280px] min-[400px]:h-[320px] sm:h-[420px] md:h-[480px] lg:h-[520px] xl:h-[580px] max-w-5xl p-3 min-[400px]:p-4 sm:p-6 md:p-8 lg:p-12 flex flex-col justify-between bg-gradient-to-br from-zinc-900/50 to-black/50 rounded-xl min-[400px]:rounded-2xl md:rounded-3xl border border-white/10 backdrop-blur-sm shadow-2xl overflow-hidden">
        
        {/* Header section */}
        <div className="flex items-start justify-between mb-2 min-[400px]:mb-3 sm:mb-4 md:mb-6 flex-shrink-0">
          <div className="text-2xl min-[400px]:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-white/10 font-mono leading-none select-none">
            {service.counter}
          </div>
          
          <ServiceIcon 
            type={service.iconType}
            isActive={isActive}
            className="flex-shrink-0"
          />
        </div>

        {/* Content section - fixed flex-1 for consistent spacing */}
        <div className="flex-1 flex flex-col justify-center max-w-[60ch] min-h-0">
          <h3
            className="text-lg min-[400px]:text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-1 min-[400px]:mb-2 sm:mb-3 md:mb-4 leading-tight tracking-tight"
            style={{
              fontFamily: "ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'"
            }}
          >
            {service.title}
          </h3>

          <p
            className="text-xs min-[400px]:text-sm sm:text-base md:text-lg text-white/70 mb-2 min-[400px]:mb-3 sm:mb-4 md:mb-6 leading-relaxed line-clamp-3 min-[400px]:line-clamp-4"
            style={{
              fontFamily: "ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'"
            }}
          >
            {service.description}
          </p>
        </div>

        {/* CTA section */}
        <div className="flex-shrink-0">
          <a
            href={service.ctaLink}
            className="group inline-flex items-center gap-1 min-[400px]:gap-2 sm:gap-3 px-2 min-[400px]:px-3 sm:px-4 md:px-5 py-1.5 min-[400px]:py-2 sm:py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-full border border-white/20 hover:border-white/30 transition-all duration-300 backdrop-blur-sm"
          >
            <span className="text-xs min-[400px]:text-sm md:text-base font-medium">{service.ctaText}</span>
            <svg
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="none"
              className="text-white/80 group-hover:text-white transition-colors min-[400px]:w-3 min-[400px]:h-3 sm:w-3 sm:h-3 md:w-4 md:h-4"
            >
              <path
                d="M7 17L17 7M17 7H7M17 7V17"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>

        {/* Simple decorative elements */}
        <div className="absolute top-2 sm:top-3 md:top-4 right-2 sm:right-3 md:right-4 w-1 sm:w-1.5 md:w-2 h-1 sm:h-1.5 md:h-2 bg-white/20 rounded-full" />
        <div className="absolute bottom-2 sm:bottom-3 md:bottom-4 left-2 sm:left-3 md:left-4 w-0.5 sm:w-1 h-0.5 sm:h-1 bg-white/30 rounded-full" />
      </div>
    </motion.div>
  );
};

export default ServiceBlock; 