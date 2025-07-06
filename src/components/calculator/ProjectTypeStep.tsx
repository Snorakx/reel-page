import React from 'react';
import { motion } from 'framer-motion';
import type { ProjectType } from '../../types/ProjectCalculator';

interface ProjectTypeStepProps {
  selectedType: ProjectType | null;
  onSelectType: (type: ProjectType) => void;
  onNext: () => void;
  onBack: () => void;
}

const ProjectTypeStep: React.FC<ProjectTypeStepProps> = ({
  selectedType,
  onSelectType,
  onNext,
  onBack
}) => {
  const projectTypes = [
    {
      id: 'website' as ProjectType,
      name: 'Strona wizytówkowa typu klasycznego',
      description: 'Jest to najbardziej popularny typ strony internetowej. Składa się z wielu niezależnych podstron oraz wielopoziomowego menu.',
      basePrice: 14990,
      gradient: 'from-purple-500 to-pink-500',
      icon: '🌐'
    },
    {
      id: 'ecommerce' as ProjectType,
      name: 'Strona dla urzędu lub instytucji',
      description: 'Zapewniamy specjalistyczne podejście i dopracowanie elementów strony do formalnej komunikacji z odwiedzającymi.',
      basePrice: 19900,
      gradient: 'from-blue-500 to-cyan-500',
      icon: '🏛️'
    },
    {
      id: 'ai_tools' as ProjectType,
      name: 'Narzędzia AI i Automatyzacja',
      description: 'Zaawansowane rozwiązania wykorzystujące sztuczną inteligencję do automatyzacji procesów biznesowych.',
      basePrice: 24990,
      gradient: 'from-green-500 to-emerald-500',
      icon: '🤖'
    },
    {
      id: 'erp_systems' as ProjectType,
      name: 'Systemy ERP',
      description: 'Kompleksowe systemy do zarządzania zasobami przedsiębiorstwa i procesami biznesowymi.',
      basePrice: 39990,
      gradient: 'from-orange-500 to-red-500',
      icon: '⚙️'
    }
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: 'PLN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background gradient blobs */}
      <div className="absolute top-0 right-0 w-[40%] h-full">
        <div className="absolute top-1/4 right-0 w-[300px] h-[300px] bg-gradient-to-br from-blue-500 via-cyan-400 to-yellow-400 rounded-full blur-3xl opacity-40 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[200px] h-[200px] bg-gradient-to-br from-green-400 via-emerald-400 to-teal-400 rounded-full blur-3xl opacity-30 animate-pulse animation-delay-2s"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 lg:px-16 py-6 md:py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 md:mb-16"
        >
          <div className="hidden lg:inline-flex items-center gap-2 bg-gray-800 border border-gray-700 rounded-full px-4 py-2 mb-8">
            <span className="text-emerald-400 text-sm font-medium">Krok 1</span>
            <span className="text-gray-400 text-sm">Wybór typu projektu</span>
          </div>
          
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-light text-white mb-4">
            Jaki typ projektu Cię interesuje?
          </h1>
          
          <p className="text-lg md:text-xl text-gray-400 font-light max-w-2xl mx-auto">
            Wybierz kategorię, która najlepiej opisuje Twój projekt
          </p>
        </motion.div>

        {/* Project type cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 mb-6 md:mb-16">
          {projectTypes.map((type, index) => (
            <motion.div
              key={type.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative"
            >
              <div
                className={`relative bg-gray-900/50 border border-gray-800 rounded-xl p-6 md:p-8 cursor-pointer transition-all duration-300 hover:border-emerald-500/50 min-h-[120px] md:min-h-auto ${
                  selectedType === type.id 
                    ? 'border-emerald-500 bg-emerald-500/5' 
                    : 'hover:bg-gray-900/70'
                }`}
                onClick={() => onSelectType(type.id)}
              >
                {/* Gradient background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${type.gradient} opacity-5 rounded-xl`}></div>

                {/* Selection indicator */}
                {selectedType === type.id && (
                  <div className="absolute top-4 right-4 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-white">
                      <path
                        d="M20 6L9 17l-5-5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                )}

                {/* Icon */}
                <div className="text-3xl md:text-4xl mb-3 md:mb-4">{type.icon}</div>

                {/* Content */}
                <h3 className="text-lg md:text-2xl font-light text-white mb-2 md:mb-3">
                  {type.name}
                </h3>

                <p className="text-gray-400 mb-4 md:mb-6 leading-relaxed text-sm md:text-base line-clamp-3 md:line-clamp-none">
                  {type.description}
                </p>

                {/* Price */}
                <div className="flex items-center justify-between">
                  <div className="text-lg md:text-2xl font-light text-emerald-400">
                    od {formatPrice(type.basePrice)}
                  </div>
                  <div className="text-xs text-gray-500">
                    cena podstawowa
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>


      </div>
    </div>
  );
};

export default ProjectTypeStep; 