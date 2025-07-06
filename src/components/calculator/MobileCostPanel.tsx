import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ProjectType, SelectedAddon } from '../../types/ProjectCalculator';

interface MobileCostPanelProps {
  projectType: ProjectType | null;
  basePrice: number;
  selectedAddons: SelectedAddon[];
  totalCost: number;
  formatPrice: (price: number) => string;
  isOpen: boolean;
  onClose: () => void;
  onRemoveAddon?: (addon: SelectedAddon) => void;
}

const MobileCostPanel: React.FC<MobileCostPanelProps> = ({
  projectType,
  basePrice,
  selectedAddons,
  totalCost,
  formatPrice,
  isOpen,
  onClose,
  onRemoveAddon
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragY, setDragY] = useState(0);

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

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  // Handle drag to close
  const handleDragEnd = (event: any, info: any) => {
    if (info.offset.y > 100) {
      onClose();
    }
    setIsDragging(false);
    setDragY(0);
  };

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDrag = (event: any, info: any) => {
    if (info.offset.y > 0) {
      setDragY(info.offset.y);
    }
  };

  if (!projectType) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 lg:hidden"
            onClick={onClose}
          />

          {/* Bottom Sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ 
              type: "spring", 
              damping: 25, 
              stiffness: 300,
              mass: 0.8
            }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.1}
            onDragStart={handleDragStart}
            onDrag={handleDrag}
            onDragEnd={handleDragEnd}
            style={{
              y: isDragging ? dragY : 0
            }}
            className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-sm border-t border-gray-800 z-50 lg:hidden max-h-[85vh] overflow-hidden"
          >
            {/* Drag Handle */}
            <div className="flex justify-center pt-4 pb-2">
              <div className="w-10 h-1 bg-gray-600 rounded-full"></div>
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-4 py-4 border-b border-gray-800">
              <h2 className="text-xl font-medium text-white">
                Kosztorys projektu
              </h2>
              <button
                onClick={onClose}
                className="w-8 h-8 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center transition-colors duration-300"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-gray-400">
                  <path
                    d="M18 6L6 18M6 6l12 12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="overflow-y-auto max-h-[calc(85vh-120px)]">
              <div className="p-4 pb-8">
                {/* Project type */}
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-white mb-3">
                    Typ projektu
                  </h3>
                  <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300 text-sm">
                        {getProjectTypeName(projectType)}
                      </span>
                      <span className="text-emerald-400 font-medium text-lg">
                        {formatPrice(basePrice)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Selected addons */}
                {hasAddons && (
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-white mb-3">
                      Dodatki ({selectedAddons.length})
                    </h3>
                    <div className="space-y-3">
                      <AnimatePresence>
                        {selectedAddons.map((addon) => (
                          <motion.div
                            key={addon.id}
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 group"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1 min-w-0 pr-3">
                                <span className="text-gray-300 text-sm font-medium block">
                                  {addon.label}
                                </span>
                                <span className="text-emerald-400 text-lg font-medium">
                                  {formatPrice(addon.price)}
                                </span>
                              </div>
                              
                              {onRemoveAddon && (
                                <button
                                  onClick={() => onRemoveAddon(addon)}
                                  className="w-8 h-8 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/40 rounded-full flex items-center justify-center transition-all duration-300"
                                >
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-red-400">
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
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-gray-300">
                      <span className="text-base">Projekt podstawowy</span>
                      <span className="text-lg">{formatPrice(basePrice)}</span>
                    </div>
                    
                    {hasAddons && (
                      <div className="flex items-center justify-between text-gray-300">
                        <span className="text-base">Dodatki ({selectedAddons.length})</span>
                        <span className="text-lg">{formatPrice(addonsPrice)}</span>
                      </div>
                    )}
                    
                    <div className="border-t border-gray-700 pt-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-medium text-white">
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
                      
                      <div className="text-sm text-gray-500 mt-2">
                        lub przy płatności miesięcznej {formatPrice(Math.round(totalCost / 10))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment info */}
                <div className="mt-6 bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
                  <h4 className="text-base font-medium text-emerald-400 mb-3">
                    💰 Opcje płatności
                  </h4>
                  <div className="text-sm text-gray-400 space-y-2">
                    <p>• Płatność jednorazowa z 5% rabatem</p>
                    <p>• Płatność w 3 ratach 0% prowizji</p>
                    <p>• Płatność miesięczna przez 10 miesięcy</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileCostPanel; 