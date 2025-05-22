import React from 'react';
import { motion } from 'framer-motion';

interface ProcessCardProps {
  step: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  delay?: number;
}

export default function ProcessCard({
  step,
  title,
  description,
  icon,
  delay = 0
}: ProcessCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ 
        duration: 0.6, 
        delay,
        ease: [0.22, 1, 0.36, 1]
      }}
      className="bg-[#121A2B] p-6 sm:p-8 rounded-2xl shadow-lg backdrop-blur-sm border border-blue-900/20 h-full flex flex-col"
    >
      <div className="flex items-center mb-5">
        <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center text-blue-400 mr-4">
          {icon}
        </div>
        <span className="text-blue-400 text-sm font-medium">Krok {step}</span>
      </div>
      
      <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">{title}</h3>
      
      <p className="text-blue-100/80 text-base mb-5 flex-grow">{description}</p>
      
      <motion.div 
        className="mt-auto w-full h-1 bg-gradient-to-r from-blue-500/30 to-transparent rounded-full"
        initial={{ scaleX: 0, originX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: delay + 0.3 }}
      />
    </motion.div>
  );
} 