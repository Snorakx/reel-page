import { languages, useTranslations } from '../../i18n/config';

interface HeaderProps {
  lang?: string;
  scrollToSection?: (index: number) => void;
}

export default function Header({ lang = 'pl', scrollToSection }: HeaderProps) {
  const t = useTranslations(lang);

  const switchLanguage = (newLang: string) => {
    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname;
      const isLangPath = currentPath.startsWith('/en');
      
      // URL mapping between Polish and English
      const urlMappings = {
        pl: {
          '/ai-automatyzacja': '/en/ai-automation',
          '/mvp-development': '/en/mvp-development',
          '/optymalizacja-procesow': '/en/process-optimization',
          '/': '/en/'
        },
        en: {
          '/en/ai-automation': '/ai-automatyzacja',
          '/en/mvp-development': '/mvp-development',
          '/en/process-optimization': '/optymalizacja-procesow',
          '/en/': '/'
        }
      };
      
      let newPath: string;
      if (newLang === 'pl') {
        // Switch from English to Polish
        newPath = urlMappings.en[currentPath as keyof typeof urlMappings.en] || '/';
      } else {
        // Switch from Polish to English
        newPath = urlMappings.pl[currentPath as keyof typeof urlMappings.pl] || '/en/';
      }
      
      window.location.href = newPath;
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 p-6 md:p-8 mix-blend-difference">
      <nav className="flex justify-between items-center">
        {scrollToSection ? (
          <button 
            onClick={() => scrollToSection(0)}
            className="text-2xl font-black tracking-wider text-white hover:scale-105 transition-transform duration-300 cursor-pointer"
          >
            {t('nav.brand')}
          </button>
        ) : (
          <a 
            href={`/${lang === 'pl' ? '' : lang + '/'}`}
            className="text-2xl font-black tracking-wider text-white hover:scale-105 transition-transform duration-300"
          >
            {t('nav.brand')}
          </a>
        )}
        
        <div className="flex items-center space-x-6">
          {/* Main Navigation */}
          <div className="hidden md:flex space-x-8 text-xs font-bold uppercase tracking-[3px] text-white">
            <a href={lang === 'pl' ? '/ai-automatyzacja' : '/en/ai-automation'} className="nav-link hover:text-cyan-400 transition-colors">
              {t('nav.ai')}
            </a>
            <a href={lang === 'pl' ? '/optymalizacja-procesow' : '/en/process-optimization'} className="nav-link hover:text-cyan-400 transition-colors">
              {t('nav.processes')}
            </a>
            <a href={lang === 'pl' ? '/mvp-development' : '/en/mvp-development'} className="nav-link hover:text-cyan-400 transition-colors">
              {t('nav.mvp')}
            </a>
            {scrollToSection ? (
              <button 
                className="nav-link hover:text-cyan-400 transition-colors" 
                onClick={() => scrollToSection(3)}
              >
                {t('nav.contact')}
              </button>
            ) : (
              <a href={`/${lang === 'pl' ? '' : lang + '/'}`} className="nav-link hover:text-cyan-400 transition-colors">
                {t('nav.contact')}
              </a>
            )}
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
      </nav>
    </header>
  );
} 