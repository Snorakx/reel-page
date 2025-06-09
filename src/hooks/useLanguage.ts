import { useState, useEffect } from 'react';
import { useTranslations, defaultLanguage } from '../i18n/config';

export function useLanguage() {
  const [currentLang, setCurrentLang] = useState(defaultLanguage);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Only run on client-side
    if (typeof window !== 'undefined') {
      // Get language from URL
      const path = window.location.pathname;
      const langFromPath = path.startsWith('/en') ? 'en' : defaultLanguage;
      
      setCurrentLang(langFromPath);
    }
    setIsLoading(false);
  }, []);

  const t = useTranslations(currentLang);

  const switchLanguage = (newLang: string) => {
    setCurrentLang(newLang);
    
    // Update URL if different from default
    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname;
      const isLangPath = currentPath.startsWith('/en');
      
      let newPath: string;
      if (newLang === defaultLanguage) {
        // Remove language prefix for default language
        newPath = isLangPath ? currentPath.substring(3) || '/' : currentPath;
      } else {
        // Add language prefix
        newPath = isLangPath 
          ? `/${newLang}${currentPath.substring(3) || ''}`
          : `/${newLang}${currentPath}`;
      }
      
      window.history.replaceState({}, '', newPath);
      window.location.reload(); // Force reload to update all components
    }
  };

  return {
    currentLang,
    t,
    switchLanguage,
    isLoading
  };
} 