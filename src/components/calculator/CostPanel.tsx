import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ProjectType, SelectedAddon } from '../../types/ProjectCalculator';

interface CostPanelProps {
  projectType: ProjectType | null;
  basePrice: number;
  selectedAddons: SelectedAddon[];
  totalCost: number;
  formatPrice: (price: number) => string;
  isVisible: boolean;
  onRemoveAddon?: (addon: SelectedAddon) => void;
}

const CostPanel: React.FC<CostPanelProps> = ({
  projectType,
  basePrice,
  selectedAddons,
  totalCost,
  formatPrice,
  isVisible,
  onRemoveAddon
}) => {
  const [isMinimized, setIsMinimized] = useState(false);

  const getProjectTypeName = (type: ProjectType) => {
    const names = {
      website: 'Strona wizytówkowa',
      ecommerce: 'Strona dla urzędu',
      ai_tools: 'Narzędzia AI',
      erp_systems: 'Systemy ERP'
    };
    return names[type];
  };

  const addonsPrice = selectedAddons.reduce((sum, addon) => sum + addon.price, 0);
  const hasAddons = selectedAddons.length > 0;

  if (!isVisible || !projectType) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="hidden lg:block fixed top-0 right-0 h-full w-80 bg-gray-900/95 backdrop-blur-sm border-l border-gray-800 z-50 shadow-2xl"
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <h2 className="text-xl font-medium text-white">
            Szacunkowy koszt netto
          </h2>
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="w-8 h-8 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center transition-colors duration-300"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              className={`text-gray-400 transition-transform duration-300 ${isMinimized ? 'rotate-180' : ''}`}
            >
              <path
                d="M6 9l6 6 6-6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <AnimatePresence>
          {!isMinimized && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="flex-1 overflow-y-auto"
            >
              <div className="p-6">
                {/* Project type */}
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-white mb-2">
                    Typ projektu
                  </h3>
                  <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">
                        {getProjectTypeName(projectType)}
                      </span>
                      <span className="text-emerald-400 font-medium">
                        {formatPrice(basePrice)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Selected addons */}
                {hasAddons && (
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-white mb-2">
                      Dodatki ({selectedAddons.length})
                    </h3>
                    <div className="space-y-2">
                      <AnimatePresence>
                        {selectedAddons.map((addon) => (
                          <motion.div
                            key={addon.id}
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="bg-gray-800/50 border border-gray-700 rounded-lg p-3 group"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1 min-w-0">
                                <span className="text-gray-300 text-sm font-medium block truncate">
                                  {addon.label}
                                </span>
                                <span className="text-emerald-400 text-sm font-medium">
                                  {formatPrice(addon.price)}
                                </span>
                              </div>
                              
                              {onRemoveAddon && (
                                <button
                                  onClick={() => onRemoveAddon(addon)}
                                  className="ml-2 w-6 h-6 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/40 rounded-full flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100"
                                >
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="text-red-400">
                                    <path
                                      d="M18 6L6 18M6 6l12 12"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                  </svg>
                                </button>
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>
                )}

                {/* Summary */}
                <div className="border-t border-gray-800 pt-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-gray-300">
                      <span>Projekt podstawowy</span>
                      <span>{formatPrice(basePrice)}</span>
                    </div>
                    
                    {hasAddons && (
                      <div className="flex items-center justify-between text-gray-300">
                        <span>Dodatki ({selectedAddons.length})</span>
                        <span>{formatPrice(addonsPrice)}</span>
                      </div>
                    )}
                    
                    <div className="border-t border-gray-700 pt-3">
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-medium text-white">
                          Razem netto
                        </span>
                        <motion.span
                          key={totalCost}
                          initial={{ scale: 1.1, color: '#10B981' }}
                          animate={{ scale: 1, color: '#10B981' }}
                          transition={{ duration: 0.3 }}
                          className="text-2xl font-semibold text-emerald-400"
                        >
                          {formatPrice(totalCost)}
                        </motion.span>
                      </div>
                      
                      <div className="text-sm text-gray-500 mt-1">
                        lub przy płatności miesięcznej {formatPrice(Math.round(totalCost / 10))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment info */}
                <div className="mt-6 bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-emerald-400 mb-2">
                    💰 Opcje płatności
                  </h4>
                  <div className="text-xs text-gray-400 space-y-1">
                    <p>• Płatność jednorazowa z 5% rabatem</p>
                    <p>• Płatność w ratach 10 x {formatPrice(Math.round(totalCost / 10))}</p>
                    <p>• 50% zaliczka, 50% przy odbiorze</p>
                  </div>
                </div>

                {/* Guarantee */}
                <div className="mt-4 bg-gray-800/30 border border-gray-700 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-white mb-2">
                    ✅ Gwarancja
                  </h4>
                  <div className="text-xs text-gray-400 space-y-1">
                    <p>• 30 dni na darmowe poprawki</p>
                    <p>• 12 miesięcy wsparcia technicznego</p>
                    <p>• Zwrot kosztów przy braku satysfakcji</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <div className="border-t border-gray-800 p-6">
          <div className="text-center">
            <div className="text-sm text-gray-500 mb-2">
              Ostatecznie aktualizowane
            </div>
            <div className="text-xs text-gray-600">
              {new Date().toLocaleString('pl-PL')}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CostPanel; 