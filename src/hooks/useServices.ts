import { useState, useEffect, useCallback } from 'react';
import { ServicesService } from '../services/ServicesService';
import { useLanguage } from './useLanguage';
import type { ServiceData } from '../repositories/ServicesRepository';
import plTranslations from '../i18n/translations/pl.json';
import enTranslations from '../i18n/translations/en.json';

interface UseServicesReturn {
  services: ServiceData[];
  loading: boolean;
  error: string | null;
  currentServiceIndex: number;
  setCurrentServiceIndex: (index: number) => void;
  trackServiceView: (serviceId: string) => void;
  getServiceBySlug: (slug: string) => Promise<ServiceData | null>;
  refetch: () => Promise<void>;
}

export const useServices = (): UseServicesReturn => {
  const { currentLang } = useLanguage();
  const [services, setServices] = useState<ServiceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentServiceIndex, setCurrentServiceIndex] = useState(0);
  const [servicesService] = useState(() => new ServicesService());

  const fetchServices = useCallback(async (currentLang: string) => {
    try {
      setLoading(true);
      setError(null);
      // Pobierz pełny obiekt tłumaczeń na podstawie języka
      const translations = currentLang === 'en' ? enTranslations : plTranslations;
      const servicesData = await servicesService.getAllServices(translations);
      setServices(servicesData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch services';
      setError(errorMessage);
      console.error('Error in useServices:', err);
    } finally {
      setLoading(false);
    }
  }, [servicesService]);

  const trackServiceView = useCallback((serviceId: string) => {
    servicesService.trackServiceView(serviceId);
  }, [servicesService]);

  const getServiceBySlug = useCallback(async (slug: string): Promise<ServiceData | null> => {
    try {
      return await servicesService.getServiceBySlug(slug);
    } catch (err) {
      console.error('Error getting service by slug:', err);
      return null;
    }
  }, [servicesService]);

  const refetch = useCallback(async () => {
    await fetchServices(currentLang);
  }, [fetchServices, currentLang]);

  useEffect(() => {
    fetchServices(currentLang);
  }, [fetchServices, currentLang]); // Używamy currentLang zamiast funkcji t

  return {
    services,
    loading,
    error,
    currentServiceIndex,
    setCurrentServiceIndex,
    trackServiceView,
    getServiceBySlug,
    refetch
  };
};

export const useServiceScroll = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeServiceIndex, setActiveServiceIndex] = useState(0);

  // Lightweight scroll handler - minimal calculations
  const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    const container = event.currentTarget;
    const scrollLeft = container.scrollLeft;
    const scrollWidth = container.scrollWidth - container.clientWidth;
    
    if (scrollWidth > 0) {
      const progress = scrollLeft / scrollWidth;
      setScrollProgress(progress);
    }
  }, []);

  return {
    scrollProgress,
    activeServiceIndex,
    handleScroll,
    setActiveServiceIndex
  };
}; 