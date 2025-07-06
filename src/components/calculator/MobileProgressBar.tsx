import React from 'react';
import { motion } from 'framer-motion';

interface MobileProgressBarProps {
  currentStep: number;
  totalSteps: number;
  stepLabels: string[];
}

const MobileProgressBar: React.FC<MobileProgressBarProps> = ({
  currentStep,
  totalSteps,
  stepLabels
}) => {
  // Calculate progress percentage
  const progressPercentage = ((currentStep) / totalSteps) * 100;
  
  return (
    <div className="lg:hidden fixed top-0 left-0 right-0 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 z-40 px-4 py-4 safe-area-top">
      {/* Step indicator */}
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm text-gray-400">
          Krok {currentStep + 1} z {totalSteps}
        </div>
        <div className="text-sm font-medium text-white">
          {stepLabels[currentStep] || 'Krok'}
        </div>
      </div>
      
      {/* Progress bar */}
      <div className="relative w-full h-2 bg-gray-800 rounded-full overflow-hidden">
        <motion.div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ 
            duration: 0.6, 
            ease: "easeOut" 
          }}
        />
        
        {/* Progress dots */}
        <div className="absolute top-0 left-0 right-0 h-full flex items-center justify-between px-1">
          {Array.from({ length: totalSteps }, (_, index) => (
            <motion.div
              key={index}
              className={`w-2 h-2 rounded-full border-2 ${
                index <= currentStep 
                  ? 'bg-emerald-400 border-emerald-400' 
                  : 'bg-gray-800 border-gray-600'
              }`}
              initial={{ scale: 0.8 }}
              animate={{ 
                scale: index === currentStep ? 1.2 : 0.8,
                backgroundColor: index <= currentStep ? '#10B981' : '#1F2937'
              }}
              transition={{ duration: 0.3 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MobileProgressBar; 