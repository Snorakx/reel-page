import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { languages } from '../i18n/config';

interface NavigationProps {
  currentLang: string;
  t: (key: string) => string;
}

export default function Navigation({ currentLang, t }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <a href={`/${currentLang}`} className="text-xl font-bold">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            AnimationHub
          </motion.div>
        </a>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <motion.a 
            href={`/${currentLang}`}
            className="hover:text-indigo-500 transition-colors"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {t('nav.home')}
          </motion.a>
          <motion.a 
            href={`/${currentLang}/about`}
            className="hover:text-indigo-500 transition-colors"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {t('nav.about')}
          </motion.a>
          <motion.a 
            href={`/${currentLang}/contact`}
            className="hover:text-indigo-500 transition-colors"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {t('nav.contact')}
          </motion.a>
          
          {/* Language Selector */}
          <div className="relative ml-4">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center space-x-1 px-3 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800"
            >
              <span>{currentLang.toUpperCase()}</span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            <AnimatePresence>
              {isOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-40 bg-white dark:bg-zinc-800 rounded-md shadow-lg overflow-hidden z-50"
                >
                  <div className="py-1">
                    {Object.entries(languages).map(([code, name]) => (
                      <a
                        key={code}
                        href={`/${code}${window.location.pathname.substring(currentLang.length + 1)}`}
                        className={`block px-4 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-700 ${
                          code === currentLang ? 'bg-zinc-100 dark:bg-zinc-700' : ''
                        }`}
                      >
                        {name}
                      </a>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-6 w-6" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>
      
      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white dark:bg-zinc-900 border-t dark:border-zinc-800"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
              <a href={`/${currentLang}`} className="hover:text-indigo-500 transition-colors">
                {t('nav.home')}
              </a>
              <a href={`/${currentLang}/about`} className="hover:text-indigo-500 transition-colors">
                {t('nav.about')}
              </a>
              <a href={`/${currentLang}/contact`} className="hover:text-indigo-500 transition-colors">
                {t('nav.contact')}
              </a>
              
              {/* Language Options */}
              <div className="border-t dark:border-zinc-800 pt-4 mt-2">
                <p className="text-sm text-zinc-500 mb-2">Language</p>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(languages).map(([code, name]) => (
                    <a
                      key={code}
                      href={`/${code}${window.location.pathname.substring(currentLang.length + 1)}`}
                      className={`px-3 py-2 text-sm rounded-md ${
                        code === currentLang 
                          ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300' 
                          : 'bg-zinc-100 dark:bg-zinc-800'
                      }`}
                    >
                      {name}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
} 