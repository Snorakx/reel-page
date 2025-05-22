import { languages, defaultLanguage } from '../i18n/config';

/**
 * Helper function to generate static paths for language-based routes
 * @returns Array of language-based paths for Astro's getStaticPaths
 */
export function generateLanguagePaths() {
  return Object.keys(languages).map(lang => ({
    params: { lang },
    props: { lang },
  }));
}

/**
 * Helper function to validate if a language is supported
 * @param lang Language code to validate
 * @returns Boolean indicating if the language is supported
 */
export function isValidLanguage(lang: string): boolean {
  return Object.keys(languages).includes(lang);
}

/**
 * Helper function to get the language name from language code
 * @param lang Language code
 * @returns Language name or default language name if not found
 */
export function getLanguageName(lang: string): string {
  return lang in languages 
    ? languages[lang as keyof typeof languages] 
    : languages[defaultLanguage as keyof typeof languages];
} 