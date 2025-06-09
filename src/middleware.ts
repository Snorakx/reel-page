import { defineMiddleware } from 'astro:middleware';
import { defaultLanguage, languages } from './i18n/config';

export const onRequest = defineMiddleware((context, next) => {
  const url = new URL(context.request.url);
  const pathname = url.pathname;
  
  // Check if the path already has a language prefix
  const hasLangPrefix = Object.keys(languages).some(lang => 
    pathname.startsWith(`/${lang}/`) || pathname === `/${lang}`
  );
  
  // If already has language prefix or is the root, continue
  if (hasLangPrefix || pathname === '/') {
    return next();
  }
  
  // Check if it's a static asset or API route
  if (pathname.startsWith('/assets/') || 
      pathname.startsWith('/api/') || 
      pathname.includes('.')) {
    return next();
  }
  
  // For other routes without language prefix, detect language
  const acceptLanguage = context.request.headers.get('accept-language') || '';
  const browserLang = acceptLanguage.split(',')[0]?.split('-')[0];
  
  // If browser language is supported and not default, redirect
  if (browserLang && browserLang in languages && browserLang !== defaultLanguage) {
    const newUrl = new URL(`/${browserLang}${pathname}`, url.origin);
    return Response.redirect(newUrl.toString(), 302);
  }
  
  return next();
}); 