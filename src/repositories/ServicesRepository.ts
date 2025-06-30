export interface ServiceData {
  id: string;
  counter: string;
  title: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  iconType: 'development' | 'ai' | 'optimization' | 'consultation';
  color: string;
}

export class ServicesRepository {
  private static instance: ServicesRepository;
  private services: ServiceData[] = [];
  private currentLang: string = 'pl';

  static getInstance(): ServicesRepository {
    if (!ServicesRepository.instance) {
      ServicesRepository.instance = new ServicesRepository();
    }
    return ServicesRepository.instance;
  }

  setLanguage(lang: string): void {
    if (this.currentLang !== lang) {
      this.currentLang = lang;
      this.services = []; // Clear cache when language changes
    }
  }



  async getServices(translations?: any): Promise<ServiceData[]> {
    // Always fetch fresh data when translations are provided (language might have changed)
    if (translations) {
      this.services = await this.fetchServicesData(translations);
    } else if (this.services.length === 0) {
      this.services = await this.fetchServicesData(translations);
    }
    return this.services;
  }

  private async fetchServicesData(translations?: any): Promise<ServiceData[]> {
    const baseData = [
      {
        id: 'mvp-development',
        counter: '01',
        ctaLink: '/mvp-development',
        iconType: 'development' as const,
        color: 'from-purple-500 to-pink-500'
      },
      {
        id: 'ai-automation',
        counter: '02', 
        ctaLink: '/ai-automatyzacja',
        iconType: 'ai' as const,
        color: 'from-blue-500 to-cyan-500'
      },
      {
        id: 'process-optimization',
        counter: '03',
        ctaLink: '/optymalizacja-procesow',
        iconType: 'optimization' as const,
        color: 'from-green-500 to-emerald-500'
      },
      {
        id: 'tech-consultation',
        counter: '04',
        ctaLink: '/consultation',
        iconType: 'consultation' as const,
        color: 'from-orange-500 to-red-500'
      }
    ];

    // Używaj tłumaczeń jeśli są dostępne
    if (translations?.services?.new_section?.services) {
      const translatedServices = translations.services.new_section.services;
      return baseData.map((base, index) => ({
        ...base,
        title: translatedServices[index]?.title || `Service ${index + 1}`,
        description: translatedServices[index]?.description || 'Description not available',
        ctaText: translatedServices[index]?.ctaText || 'Learn more'
      }));
    }

    // Fallback do angielskich tekstów
    const fallbackTexts = [
      {
        title: 'MVP Development',
        description: 'Transform your vision into a working product. We build scalable MVPs that validate your business idea and accelerate time-to-market with modern tech stack.',
        ctaText: 'See how we do it'
      },
      {
        title: 'AI Automation',
        description: 'Leverage artificial intelligence to automate repetitive tasks, enhance decision-making, and unlock new business capabilities with custom AI solutions.',
        ctaText: 'Explore AI solutions'
      },
      {
        title: 'Process Optimization',
        description: 'Streamline your business operations with data-driven insights and custom software solutions that eliminate bottlenecks and boost efficiency.',
        ctaText: 'Optimize processes'
      },
      {
        title: 'Tech Consultation',
        description: 'Get expert guidance on technology strategy, architecture decisions, and digital transformation to make informed choices for your business growth.',
        ctaText: 'Book consultation'
      }
    ];

    return baseData.map((base, index) => ({
      ...base,
      ...fallbackTexts[index]
    }));
  }

  async getServiceById(id: string): Promise<ServiceData | null> {
    const services = await this.getServices();
    return services.find(service => service.id === id) || null;
  }

  saveToLocalStorage(key: string, data: any): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, JSON.stringify(data));
    }
  }

  getFromLocalStorage<T>(key: string): T | null {
    if (typeof window !== 'undefined') {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    }
    return null;
  }
} 