import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { ProjectAddon, ProjectType } from '../../types/ProjectCalculator';

interface AddonStepProps {
  projectType: ProjectType;
  selectedAddons: ProjectAddon[];
  availableAddons: ProjectAddon[];
  onToggleAddon: (addon: ProjectAddon) => void;
  onNext: () => void;
  onBack: () => void;
  formatPrice: (price: number) => string;
}

const AddonStep: React.FC<AddonStepProps> = ({
  projectType,
  selectedAddons,
  availableAddons,
  onToggleAddon,
  onNext,
  onBack,
  formatPrice
}) => {
  const [hoveredAddon, setHoveredAddon] = useState<string | null>(null);
  const [showTooltip, setShowTooltip] = useState<string | null>(null);

  const isAddonSelected = (addon: ProjectAddon) => {
    return selectedAddons.some(selected => selected.label === addon.label);
  };

  const getProjectTypeName = (type: ProjectType) => {
    const names = {
      website: 'Strona wizytówkowa typu klasycznego',
      ecommerce: 'Strona dla urzędu lub instytucji',
      ai_tools: 'Narzędzia AI i Automatyzacja',
      erp_systems: 'Systemy ERP'
    };
    return names[type];
  };

  const selectedAddonsCount = selectedAddons.length;
  const totalAddonsPrice = selectedAddons.reduce((sum, addon) => sum + addon.price, 0);

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background gradient blobs */}
      <div className="absolute top-0 right-0 w-[40%] h-full">
        <div className="absolute top-1/4 right-0 w-[300px] h-[300px] bg-gradient-to-br from-green-400 via-emerald-400 to-teal-400 rounded-full blur-3xl opacity-40 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[200px] h-[200px] bg-gradient-to-br from-blue-500 via-cyan-400 to-yellow-400 rounded-full blur-3xl opacity-30 animate-pulse animation-delay-2s"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-7xl mx-auto px-8 md:px-16 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-gray-800 border border-gray-700 rounded-full px-4 py-2 mb-8">
            <span className="text-emerald-400 text-sm font-medium">Krok 2</span>
            <span className="text-gray-400 text-sm">Wybór dodatków</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-light text-white mb-4">
            Jakie dodatkowe elementy mamy przygotować?
          </h1>
          
          <p className="text-xl text-gray-400 font-light max-w-2xl mx-auto mb-4">
            Projekt: <span className="text-emerald-400">{getProjectTypeName(projectType)}</span>
          </p>

          {selectedAddonsCount > 0 && (
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-2">
              <span className="text-emerald-400 text-sm font-medium">
                {selectedAddonsCount} dodatk{selectedAddonsCount === 1 ? '' : selectedAddonsCount < 5 ? 'i' : 'ów'} • {formatPrice(totalAddonsPrice)}
              </span>
            </div>
          )}
        </motion.div>

        {/* Addons grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {availableAddons.map((addon, index) => {
            const isSelected = isAddonSelected(addon);
            const addonId = `addon-${index}`;
            
            return (
              <motion.div
                key={addon.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative"
                onMouseEnter={() => setHoveredAddon(addonId)}
                onMouseLeave={() => setHoveredAddon(null)}
              >
                <div
                  className={`relative bg-gray-900/50 border border-gray-800 rounded-xl p-6 cursor-pointer transition-all duration-300 hover:border-emerald-500/50 ${
                    isSelected 
                      ? 'border-emerald-500 bg-emerald-500/5' 
                      : 'hover:bg-gray-900/70'
                  }`}
                  onClick={() => onToggleAddon(addon)}
                >
                  {/* Selection indicator */}
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all duration-300 ${
                      isSelected 
                        ? 'bg-emerald-500 border-emerald-500' 
                        : 'border-gray-600 hover:border-emerald-500'
                    }`}>
                      {isSelected && (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-white">
                          <path
                            d="M20 6L9 17l-5-5"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </div>

                    {/* Info button */}
                    <button
                      className="relative w-6 h-6 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center transition-colors duration-300"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowTooltip(showTooltip === addonId ? null : addonId);
                      }}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="text-gray-300">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                        <path d="M9,9h0a3,3,0,0,1,6,0c0,2-3,3-3,3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12,17h0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>

                      {/* Tooltip */}
                      {showTooltip === addonId && (
                        <div className="absolute top-8 right-0 w-80 bg-gray-800 border border-gray-700 rounded-lg p-4 shadow-xl z-50">
                          <div className="text-sm text-gray-300">
                            {addon.description}
                          </div>
                          <div className="absolute -top-2 right-4 w-4 h-4 bg-gray-800 border-l border-t border-gray-700 rotate-45"></div>
                        </div>
                      )}
                    </button>
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-medium text-white mb-3 leading-tight">
                    {addon.label}
                  </h3>

                  <p className="text-gray-400 text-sm mb-4 leading-relaxed line-clamp-3">
                    {addon.description}
                  </p>

                  {/* Price */}
                  <div className="flex items-center justify-between">
                    <div className="text-xl font-light text-emerald-400">
                      {formatPrice(addon.price)}
                    </div>
                    <div className="text-xs text-gray-500">
                      jednorazowo
                    </div>
                  </div>

                  {/* Hover effect */}
                  {hoveredAddon === addonId && (
                    <div className="absolute inset-0 bg-emerald-500/5 rounded-xl pointer-events-none"></div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Empty state */}
        {availableAddons.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center py-16"
          >
            <div className="text-gray-600 text-6xl mb-4">📦</div>
            <h3 className="text-xl text-gray-400 font-light mb-2">
              Brak dostępnych dodatków
            </h3>
            <p className="text-gray-500">
              Dla wybranego typu projektu nie ma dodatkowych opcji.
            </p>
          </motion.div>
        )}

        {/* Info section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-gray-900/30 border border-gray-800 rounded-lg p-6 mb-8"
        >
          <h3 className="text-lg font-medium text-white mb-2">
            ℹ️ Informacja
          </h3>
          <p className="text-gray-400 text-sm">
            Wszystkie dodatki są opcjonalne. Możesz je wybrać teraz lub dodać później podczas realizacji projektu. 
            Każdy dodatek ma stałą cenę i nie wpływa na czas realizacji podstawowego projektu.
          </p>
        </motion.div>

        {/* Navigation buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex items-center justify-between"
        >
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-300"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M19 12H5M12 19l-7-7 7-7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Wróć
          </button>

          <div className="flex items-center gap-4">
            <button
              onClick={onNext}
              className="flex items-center gap-2 px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-emerald-500/25"
            >
              Następny krok
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M5 12h14m-7-7 7 7-7 7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AddonStep; 