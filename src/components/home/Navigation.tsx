import { languages, useTranslations } from '../../i18n/config';

interface NavigationProps {
  scrollToSection: (index: number) => void;
  lang?: string;
}

export default function Navigation({ scrollToSection, lang = 'pl' }: NavigationProps) {
  const t = useTranslations(lang);

  const switchLanguage = (newLang: string) => {
    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname;
      const isLangPath = currentPath.startsWith('/en');
      
      let newPath: string;
      if (newLang === 'pl') {
        // Remove language prefix for default language
        newPath = isLangPath ? currentPath.substring(3) || '/' : currentPath;
      } else {
        // Add language prefix
        newPath = isLangPath 
          ? `/${newLang}${currentPath.substring(3) || ''}`
          : `/${newLang}${currentPath}`;
      }
      
      window.location.href = newPath;
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 p-6 md:p-8 mix-blend-difference">
      <div className="flex justify-between items-center">
        <button 
          onClick={() => scrollToSection(0)}
          className="text-2xl font-black tracking-wider text-white hover:scale-105 transition-transform duration-300 cursor-pointer"
        >
          {t('nav.brand')}
        </button>
        
        <div className="flex items-center space-x-6">
          {/* Main Navigation */}
          <div className="hidden md:flex space-x-8 text-xs font-bold uppercase tracking-[3px] text-white">
            <a href={`/${lang === 'pl' ? '' : lang + '/'}ai-automatyzacja`} className="nav-link">
              {t('nav.ai')}
            </a>
            <a href={`/${lang === 'pl' ? '' : lang + '/'}optymalizacja-procesow`} className="nav-link">
              {t('nav.processes')}
            </a>
            <a href={`/${lang === 'pl' ? '' : lang + '/'}mvp-development`} className="nav-link">
              {t('nav.mvp')}
            </a>
            <button 
              className="nav-link" 
              onClick={() => scrollToSection(3)}
            >
              {t('nav.contact')}
            </button>
          </div>
          
          {/* Language Switcher */}
          <div className="flex items-center space-x-2 text-xs font-bold">
            {Object.entries(languages).map(([langCode, name]) => (
              <button
                key={langCode}
                onClick={() => switchLanguage(langCode)}
                className={`px-2 py-1 rounded transition-all duration-300 ${
                  lang === langCode 
                    ? 'bg-white text-black' 
                    : 'text-white hover:bg-white/20'
                }`}
              >
                {langCode.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
} 