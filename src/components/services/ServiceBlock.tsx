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
      className="relative flex-shrink-0 w-full max-w-6xl h-full snap-center"
      variants={blockVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      {/* Simple background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-5 rounded-3xl blur-3xl`} />

      {/* Main content container */}
      <div className="relative h-full max-h-[60vh] min-h-[500px] md:min-h-[600px] p-8 md:p-12 lg:p-16 flex flex-col justify-between bg-gradient-to-br from-zinc-900/50 to-black/50 rounded-3xl border border-white/10 backdrop-blur-sm shadow-2xl overflow-hidden">
        
        {/* Header section */}
        <div className="flex items-start justify-between mb-8">
          <div className="text-6xl md:text-8xl lg:text-9xl font-black text-white/10 font-mono leading-none select-none">
            {service.counter}
          </div>
          
          <ServiceIcon 
            type={service.iconType}
            isActive={isActive}
            className="flex-shrink-0"
          />
        </div>

        {/* Content section */}
        <div className="flex-1 flex flex-col justify-center max-w-[60ch]">
          <h3
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight tracking-tight"
            style={{
              fontFamily: "ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'"
            }}
          >
            {service.title}
          </h3>

          <p
            className="text-lg md:text-xl text-white/70 mb-8 leading-relaxed"
            style={{
              fontFamily: "ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'"
            }}
          >
            {service.description}
          </p>
        </div>

        {/* CTA section */}
        <div>
          <a
            href={service.ctaLink}
            className="group inline-flex items-center gap-3 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-full border border-white/20 hover:border-white/30 transition-all duration-300 backdrop-blur-sm"
          >
            <span className="text-base font-medium">{service.ctaText}</span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              className="text-white/80 group-hover:text-white transition-colors"
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
        <div className="absolute top-4 right-4 w-2 h-2 bg-white/20 rounded-full" />
        <div className="absolute bottom-4 left-4 w-1 h-1 bg-white/30 rounded-full" />
      </div>
    </motion.div>
  );
};

export default ServiceBlock; 