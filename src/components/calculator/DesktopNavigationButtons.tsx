import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface DesktopNavigationButtonsProps {
  onNext?: () => void;
  onBack?: () => void;
  onSubmit?: () => void;
  nextDisabled?: boolean;
  submitDisabled?: boolean;
  isSubmitting?: boolean;
  showNext?: boolean;
  showBack?: boolean;
  showSubmit?: boolean;
  nextLabel?: string;
  backLabel?: string;
  submitLabel?: string;
  showCostPanel?: boolean;
}

const DesktopNavigationButtons: React.FC<DesktopNavigationButtonsProps> = ({
  onNext,
  onBack,
  onSubmit,
  nextDisabled = false,
  submitDisabled = false,
  isSubmitting = false,
  showNext = false,
  showBack = false,
  showSubmit = false,
  nextLabel = "Dalej",
  backLabel = "Wróć", 
  submitLabel = "Prześlij zapytanie",
  showCostPanel = false
}) => {
  return (
    <div className={`hidden lg:block fixed bottom-0 left-0 bg-gray-900/95 backdrop-blur-sm border-t border-gray-800 z-30 px-8 py-6 ${showCostPanel ? 'right-80' : 'right-0'}`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Back button */}
        <div className="flex-1">
          <AnimatePresence>
            {showBack && onBack && (
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onClick={onBack}
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-300 px-4 py-2 rounded-lg hover:bg-gray-800/50"
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
                <span>{backLabel}</span>
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Center info */}
        <div className="flex-1 text-center">
          <div className="text-sm text-gray-500">
            Skorzystaj z panelu kosztorysu po prawej →
          </div>
        </div>

        {/* Next/Submit buttons */}
        <div className="flex-1 flex justify-end">
          <AnimatePresence>
            {showNext && onNext && (
              <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onClick={onNext}
                disabled={nextDisabled}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                  nextDisabled
                    ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg hover:shadow-emerald-500/25'
                }`}
              >
                <span>{nextLabel}</span>
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

            {showSubmit && onSubmit && (
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                onClick={onSubmit}
                disabled={submitDisabled || isSubmitting}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
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
                    <span>{submitLabel}</span>
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
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default DesktopNavigationButtons; 