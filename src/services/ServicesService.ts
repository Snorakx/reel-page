import { ServicesRepository, type ServiceData } from '../repositories/ServicesRepository';

export class ServicesService {
  private repository: ServicesRepository;

  constructor() {
    this.repository = ServicesRepository.getInstance();
  }



  async getAllServices(translations?: any): Promise<ServiceData[]> {
    try {
      const services = await this.repository.getServices(translations);
      return this.processServicesData(services);
    } catch (error) {
      console.error('Error fetching services:', error);
      return [];
    }
  }

  async getServiceBySlug(slug: string): Promise<ServiceData | null> {
    try {
      return await this.repository.getServiceById(slug);
    } catch (error) {
      console.error('Error fetching service by slug:', error);
      return null;
    }
  }

  private processServicesData(services: ServiceData[]): ServiceData[] {
    return services.map(service => ({
      ...service,
      title: this.formatTitle(service.title),
      description: this.truncateDescription(service.description, 150)
    }));
  }

  private formatTitle(title: string): string {
    return title.trim();
  }

  private truncateDescription(description: string, maxLength: number): string {
    if (description.length <= maxLength) return description;
    return description.substring(0, maxLength).trim() + '...';
  }

  trackServiceView(serviceId: string): void {
    try {
      const viewData = {
        serviceId,
        timestamp: new Date().toISOString(),
        userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : ''
      };
      
      this.repository.saveToLocalStorage(`service_view_${serviceId}`, viewData);
    } catch (error) {
      console.error('Error tracking service view:', error);
    }
  }

  getServiceViewHistory(): any[] {
    try {
      const history: any[] = [];
      if (typeof window !== 'undefined') {
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith('service_view_')) {
            const data = this.repository.getFromLocalStorage(key);
            if (data) history.push(data);
          }
        }
      }
      return history.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    } catch (error) {
      console.error('Error getting service view history:', error);
      return [];
    }
  }

  validateServiceData(service: Partial<ServiceData>): boolean {
    return !!(
      service.id &&
      service.title &&
      service.description &&
      service.counter &&
      service.ctaText &&
      service.iconType
    );
  }

  generateServiceSchema(service: ServiceData): object {
    return {
      "@type": "Service",
      "name": service.title,
      "description": service.description,
      "provider": {
        "@type": "Organization",
        "name": "Coderno"
      },
      "areaServed": "PL",
      "serviceType": service.title
    };
  }
} 