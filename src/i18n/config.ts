import plTranslations from './translations/pl.json';
import enTranslations from './translations/en.json';

export const languages = {
  en: 'English',
  pl: 'Polski',
};

export const defaultLanguage = 'pl';

// Load translations from JSON files
const translations: Record<string, any> = {
  pl: plTranslations,
  en: enTranslations,
};

export function getLanguageFromURL(url: URL): string {
  const [, lang] = url.pathname.split('/');
  if (lang in languages) {
    return lang;
  }
  return defaultLanguage;
}

export function useTranslations(lang: string = defaultLanguage) {
  return function t(key: string, params?: Record<string, any>): string {
    const keys = key.split('.');
    let translation = translations[lang] || translations[defaultLanguage];
    
    // Navigate through nested object
    for (const k of keys) {
      translation = translation?.[k];
      if (translation === undefined) break;
    }
    
    // Fallback to default language if not found
    if (translation === undefined) {
      translation = translations[defaultLanguage];
      for (const k of keys) {
        translation = translation?.[k];
        if (translation === undefined) break;
      }
    }
    
    // If still not found, return the key itself
    if (translation === undefined) {
      return key;
    }
    
    // Handle string interpolation
    if (typeof translation === 'string' && params) {
      return translation.replace(/\{(\w+)\}/g, (match, paramKey) => {
        return params[paramKey] !== undefined ? String(params[paramKey]) : match;
      });
    }
    
    return String(translation);
  };
}

// Get language from current URL (client-side)
export function getCurrentLanguage(): string {
  if (typeof window !== 'undefined') {
    return getLanguageFromURL(new URL(window.location.href));
  }
  return defaultLanguage;
}

// Generate language-specific paths for static generation
export function generateLanguagePaths() {
  return Object.keys(languages).map(lang => ({ params: { lang } }));
}

// Get localized URL
export function getLocalizedUrl(path: string, lang: string): string {
  if (lang === defaultLanguage) {
    return path === '/' ? '/' : path;
  }
  return `/${lang}${path === '/' ? '' : path}`;
}

// Detect language from browser
export function detectBrowserLanguage(): string {
  if (typeof navigator !== 'undefined') {
    const browserLang = navigator.language.split('-')[0];
    return Object.keys(languages).includes(browserLang) ? browserLang : defaultLanguage;
  }
  return defaultLanguage;
}

 