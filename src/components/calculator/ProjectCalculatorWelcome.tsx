import React from 'react';
import { motion } from 'framer-motion';

interface ProjectCalculatorWelcomeProps {
  onStart: () => void;
}

const ProjectCalculatorWelcome: React.FC<ProjectCalculatorWelcomeProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center">
      {/* Background gradient blobs */}
      <div className="absolute top-0 right-0 w-[60%] h-full">
        <div className="absolute top-1/4 right-0 w-[500px] h-[400px] bg-gradient-to-br from-blue-500 via-cyan-400 to-yellow-400 rounded-full blur-3xl opacity-60 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-gradient-to-br from-green-400 via-emerald-400 to-teal-400 rounded-full blur-3xl opacity-40 animate-pulse animation-delay-2s"></div>
        <div className="absolute top-1/2 right-1/3 w-[200px] h-[200px] bg-gradient-to-br from-purple-400 to-pink-400 rounded-full blur-2xl opacity-30 animate-pulse animation-delay-4s"></div>
      </div>

      {/* Small accent dots */}
      <div className="absolute top-1/3 right-20 w-2 h-2 bg-white rounded-full opacity-60"></div>
      <div className="absolute bottom-1/3 right-32 w-1 h-1 bg-cyan-400 rounded-full opacity-80"></div>

      {/* Main content */}
      <div className="relative z-10 max-w-7xl w-full px-8 md:px-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl"
        >
          {/* Pill badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-gray-800 border border-gray-700 rounded-full px-4 py-2 mb-8"
          >
            <span className="text-emerald-400 text-sm font-medium">Coderno</span>
            <span className="text-gray-400 text-sm">Kalkulator Projektowy</span>
          </motion.div>

          {/* Main heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-5xl md:text-7xl lg:text-8xl font-light text-white mb-8 leading-tight"
          >
            Zapewniamy{' '}
            <span className="text-emerald-400">software</span>,{' '}
            <br className="hidden md:block" />
            którego potrzebujesz
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-xl md:text-2xl font-light text-gray-400 mb-12 max-w-3xl leading-relaxed"
          >
            Skonfiguruj swój projekt w kilku prostych krokach. Wybierz typ aplikacji, dodatki i otrzymaj spersonalizowaną wycenę w kilka minut.
          </motion.p>

          {/* Key benefits */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          >
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
              <span className="text-gray-300 font-light">Wycena w 5 minut</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
              <span className="text-gray-300 font-light">Transparentne ceny</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span className="text-gray-300 font-light">Bez ukrytych kosztów</span>
            </div>
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            <button
              onClick={onStart}
              className="group bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-lg font-medium transition-all duration-300 text-lg inline-flex items-center gap-3 shadow-lg hover:shadow-emerald-500/25"
            >
              <span>Rozpocznij konfigurację</span>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                className="text-white group-hover:translate-x-1 transition-transform duration-300"
              >
                <path
                  d="M7 17L17 7M17 7H7M17 7V17"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </motion.div>

          {/* Secondary info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="mt-8 text-sm text-gray-500 font-light"
          >
            <p>✓ Bez zobowiązań &nbsp;•&nbsp; ✓ Natychmiastowa wycena &nbsp;•&nbsp; ✓ Profesjonalne doradztwo</p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProjectCalculatorWelcome; 