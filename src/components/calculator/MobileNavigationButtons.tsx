import React from 'react';
import { motion } from 'framer-motion';

interface MobileNavigationButtonsProps {
  onNext?: () => void;
  onBack?: () => void;
  onSubmit?: () => void;
  nextDisabled?: boolean;
  submitDisabled?: boolean;
  isSubmitting?: boolean;
  showNext?: boolean;
  showBack?: boolean;
  showSubmit?: boolean;
  showCostButton?: boolean;
  totalCost?: number;
  formatPrice?: (price: number) => string;
  onShowCost?: () => void;
}

const MobileNavigationButtons: React.FC<MobileNavigationButtonsProps> = ({
  onNext,
  onBack,
  onSubmit,
  nextDisabled = false,
  submitDisabled = false,
  isSubmitting = false,
  showNext = false,
  showBack = false,
  showSubmit = false,
  showCostButton = false,
  totalCost = 0,
  formatPrice,
  onShowCost
}) => {
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-sm border-t border-gray-800 z-40 p-4 safe-area-bottom">
      <div className="flex items-center gap-3">
        {/* Back button */}
        {showBack && (
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            onClick={onBack}
            className="flex items-center justify-center w-12 h-12 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl transition-colors duration-300"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-gray-400">
              <path
                d="M19 12H5M12 19l-7-7 7-7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.button>
        )}

        {/* Cost button */}
        {showCostButton && totalCost > 0 && formatPrice && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            onClick={onShowCost}
            className="flex items-center gap-2 px-4 py-3 bg-emerald-600/20 border border-emerald-600/40 hover:bg-emerald-600/30 rounded-xl transition-colors duration-300 text-emerald-400 font-medium"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-sm">
              {formatPrice(totalCost)}
            </span>
          </motion.button>
        )}

        {/* Next button */}
        {showNext && (
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            onClick={onNext}
            disabled={nextDisabled}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-medium transition-all duration-300 min-h-[48px] ${
              nextDisabled
                ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg hover:shadow-emerald-500/25'
            }`}
          >
            <span>Dalej</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M5 12h14m-7-7 7 7-7 7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.button>
        )}

        {/* Submit button */}
        {showSubmit && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={onSubmit}
            disabled={submitDisabled || isSubmitting}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-medium transition-all duration-300 min-h-[48px] ${
              submitDisabled || isSubmitting
                ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg hover:shadow-emerald-500/25'
            }`}
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Wysyłam...</span>
              </>
            ) : (
              <>
                <span>Prześlij zapytanie</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </>
            )}
          </motion.button>
        )}
      </div>
    </div>
  );
};

export default MobileNavigationButtons; 