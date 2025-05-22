export const languages = {
  en: 'English',
  pl: 'Polski',
  de: 'Deutsch',
  fr: 'Français',
};

export const defaultLanguage = 'en';

export function getLanguageFromURL(url: URL): string {
  const [, lang] = url.pathname.split('/');
  if (lang in languages) {
    return lang;
  }
  return defaultLanguage;
}

export function useTranslations(lang: string) {
  return function t(key: string): string {
    return translations[lang]?.[key] || translations[defaultLanguage][key] || key;
  };
}

// Simple translations dictionary
const translations: Record<string, Record<string, string>> = {
  en: {
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'hero.title': 'Welcome to our Animation Showcase',
    'hero.subtitle': 'Experience the power of modern web animations',
  },
  pl: {
    'nav.home': 'Strona główna',
    'nav.about': 'O nas',
    'nav.contact': 'Kontakt',
    'hero.title': 'Witamy w naszej Galerii Animacji',
    'hero.subtitle': 'Doświadcz mocy nowoczesnych animacji webowych',
  },
  de: {
    'nav.home': 'Startseite',
    'nav.about': 'Über uns',
    'nav.contact': 'Kontakt',
    'hero.title': 'Willkommen in unserer Animations-Galerie',
    'hero.subtitle': 'Erleben Sie die Kraft moderner Web-Animationen',
  },
  fr: {
    'nav.home': 'Accueil',
    'nav.about': 'À propos',
    'nav.contact': 'Contact',
    'hero.title': 'Bienvenue dans notre Galerie d\'Animation',
    'hero.subtitle': 'Découvrez la puissance des animations web modernes',
  },
}; 