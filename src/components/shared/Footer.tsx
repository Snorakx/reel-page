import { useTranslations } from '../../i18n/config';

interface FooterProps {
  lang?: string;
}

export default function Footer({ lang = 'pl' }: FooterProps) {
  const t = useTranslations(lang);

  const scrollToTop = () => {
    // Universal scroll to top - works on any page
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Also trigger the reel navigation if available (for home page)
    if (typeof window !== 'undefined' && (window as any).scrollToSection) {
      (window as any).scrollToSection(0);
    }
  };

  return (
    <footer className="bg-zinc-900 text-zinc-400 py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Logo i opis firmy */}
          <div className="md:col-span-1">
            <button 
              onClick={scrollToTop}
              className="text-2xl font-bold text-white mb-4 hover:text-cyan-400 transition-colors cursor-pointer"
            >
              {t('footer.brand')}
            </button>
            <p className="text-gray-400 mb-4">
              {t('footer.description')}
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-white transition-colors" aria-label="Twitter">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                </svg>
              </a>
              <a href="#" className="hover:text-white transition-colors" aria-label="LinkedIn">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a href="#" className="hover:text-white transition-colors" aria-label="GitHub">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path>
                </svg>
              </a>
            </div>
          </div>

          {/* Usługi */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">{t('footer.services.title')}</h4>
            <ul className="space-y-2">
              <li>
                <a href={`/${lang === 'pl' ? '' : lang + '/'}ai-automatyzacja`} className="hover:text-white transition-colors">
                  {t('footer.services.ai_automation')}
                </a>
              </li>
              <li>
                <a href={`/${lang === 'pl' ? '' : lang + '/'}optymalizacja-procesow`} className="hover:text-white transition-colors">
                  {t('footer.services.process_optimization')}
                </a>
              </li>
              <li>
                <a href={`/${lang === 'pl' ? '' : lang + '/'}mvp-development`} className="hover:text-white transition-colors">
                  {t('footer.services.mvp_development')}
                </a>
              </li>
              <li>
                <a href={`/${lang === 'pl' ? '' : lang + '/'}`} className="hover:text-white transition-colors">
                  {t('footer.services.software_development')}
                </a>
              </li>
              <li>
                <a href={`/${lang === 'pl' ? '' : lang + '/'}`} className="hover:text-white transition-colors">
                  {t('footer.services.it_consulting')}
                </a>
              </li>
            </ul>
          </div>

          {/* Technologie */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">{t('footer.technologies.title')}</h4>
            <ul className="space-y-2">
              <li>
                <span className="text-gray-400">React & Next.js</span>
              </li>
              <li>
                <span className="text-gray-400">Node.js & Python</span>
              </li>
              <li>
                <span className="text-gray-400">AI & Machine Learning</span>
              </li>
              <li>
                <span className="text-gray-400">Cloud (AWS, Azure)</span>
              </li>
              <li>
                <span className="text-gray-400">Mobile (React Native)</span>
              </li>
            </ul>
          </div>

          {/* Kontakt */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">{t('footer.contact.title')}</h4>
            <ul className="space-y-2">
              <li>
                <a href="mailto:kontakt@coderno.pl" className="hover:text-white transition-colors">
                  kontakt@coderno.pl
                </a>
              </li>
              <li>
                <a href="tel:+48453418428" className="hover:text-white transition-colors">
                +48 453 418 428
                </a>
              </li>
              <li>
                <span className="text-gray-400">{t('footer.contact.location')}</span>
              </li>
              <li>
                <span className="text-gray-400">NIP: 664-215-07-38</span>
              </li>
              <li>
                <button 
                  onClick={scrollToTop}
                  className="hover:text-white transition-colors text-cyan-400 cursor-pointer"
                >
                  {t('footer.contact.scroll_top')}
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Dolna część footer */}
        <div className="border-t border-zinc-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p>&copy; {new Date().getFullYear()} Coderno. {t('footer.legal.copyright')}</p>
            </div>
            <div className="flex space-x-6 text-sm">
              <a href={`/${lang === 'pl' ? '' : lang + '/'}polityka-prywatnosci`} className="hover:text-white transition-colors">
                {t('footer.legal.privacy_policy')}
              </a>
              <a href={`/${lang === 'pl' ? '' : lang + '/'}regulamin`} className="hover:text-white transition-colors">
                {t('footer.legal.terms')}
              </a>
              <a href={`/${lang === 'pl' ? '' : lang + '/'}rodo`} className="hover:text-white transition-colors">
                {t('footer.legal.gdpr')}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 