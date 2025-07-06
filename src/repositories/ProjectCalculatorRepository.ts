import type { 
  ProjectCalculatorData, 
  ProjectAddon, 
  ProjectType, 
  ProjectTypeConfig,
  LeadData 
} from '../types/ProjectCalculator';
import emailjs from '@emailjs/browser';

export class ProjectCalculatorRepository {
  private static instance: ProjectCalculatorRepository;
  private calculatorData: ProjectCalculatorData | null = null;
  private projectTypeConfig: ProjectTypeConfig = {
    website: {
      name: 'Strona wizytówkowa typu klasycznego',
      description: 'Jest to najbardziej popularny typ strony internetowej. Składa się z wielu niezależnych podstron oraz wielopoziomowego menu.',
      basePrice: 14990,
      features: ['Responsywny design', 'Szybkie ładowanie', 'SEO-friendly', 'Formularz kontaktowy'],
      icon: 'website',
      gradient: 'from-purple-500 to-pink-500'
    },
    ecommerce: {
      name: 'Strona dla urzędu lub instytucji',
      description: 'Zapewniamy specjalistyczne podejście i dopracowanie elementów strony do formalnej komunikacji z odwiedzającymi.',
      basePrice: 19900,
      features: ['Koszyk i płatności', 'Zarządzanie produktami', 'Panel administracyjny', 'Integracje'],
      icon: 'store',
      gradient: 'from-blue-500 to-cyan-500'
    },
    ai_tools: {
      name: 'Narzędzia AI i Automatyzacja',
      description: 'Zaawansowane rozwiązania wykorzystujące sztuczną inteligencję do automatyzacji procesów biznesowych.',
      basePrice: 24990,
      features: ['Integracja AI', 'Automatyzacja', 'Analityka', 'API'],
      icon: 'ai',
      gradient: 'from-green-500 to-emerald-500'
    },
    erp_systems: {
      name: 'Systemy ERP',
      description: 'Kompleksowe systemy do zarządzania zasobami przedsiębiorstwa i procesami biznesowymi.',
      basePrice: 39990,
      features: ['Moduły ERP', 'Zarządzanie', 'Raporty', 'Integracje'],
      icon: 'system',
      gradient: 'from-orange-500 to-red-500'
    }
  };

  static getInstance(): ProjectCalculatorRepository {
    if (!ProjectCalculatorRepository.instance) {
      ProjectCalculatorRepository.instance = new ProjectCalculatorRepository();
    }
    return ProjectCalculatorRepository.instance;
  }

  async getCalculatorData(): Promise<ProjectCalculatorData> {
    if (!this.calculatorData) {
      this.calculatorData = await this.fetchCalculatorData();
    }
    return this.calculatorData;
  }

  private async fetchCalculatorData(): Promise<ProjectCalculatorData> {
    try {
      // Dynamic import to load JSON data
      const data = await import('../full_project_calculator_addons.json');
      return data.default as ProjectCalculatorData;
    } catch (error) {
      console.error('Error loading calculator data:', error);
      // Fallback data
      return {
        website: [],
        ecommerce: [],
        ai_tools: [],
        erp_systems: []
      };
    }
  }

  async getProjectTypeAddons(projectType: ProjectType): Promise<ProjectAddon[]> {
    const data = await this.getCalculatorData();
    return data[projectType] || [];
  }

  getProjectTypeConfig(projectType: ProjectType) {
    return this.projectTypeConfig[projectType];
  }

  getAllProjectTypes(): ProjectType[] {
    return Object.keys(this.projectTypeConfig) as ProjectType[];
  }

  calculateTotalCost(projectType: ProjectType, selectedAddons: ProjectAddon[]): number {
    const basePrice = this.projectTypeConfig[projectType]?.basePrice || 0;
    const addonsPrice = selectedAddons.reduce((sum, addon) => sum + addon.price, 0);
    return basePrice + addonsPrice;
  }

  async sendLead(leadData: LeadData): Promise<boolean> {
    try {
      // EmailJS configuration from environment variables
      const SERVICE_ID = import.meta.env.PUBLIC_EMAILJS_SERVICE_ID;
      const TEMPLATE_ID = import.meta.env.PUBLIC_EMAILJS_TEMPLATE_ID;
      const PUBLIC_KEY = import.meta.env.PUBLIC_EMAILJS_PUBLIC_KEY;
      
      // Validate configuration
      if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
        console.error('EmailJS configuration missing. Check your .env.local file.');
        throw new Error('EmailJS configuration is not set up properly');
      }
      
      // Initialize EmailJS
      emailjs.init(PUBLIC_KEY);
      
      // Project type names
      const projectTypeNames = {
        website: 'Strona wizytówkowa typu klasycznego',
        ecommerce: 'Strona dla urzędu lub instytucji', 
        ai_tools: 'Narzędzia AI i Automatyzacja',
        erp_systems: 'Systemy ERP'
      };

      // Prepare email data
      const templateParams = {
        project_type: projectTypeNames[leadData.projectType],
        total_cost: this.formatPrice(leadData.totalCost),
        first_name: leadData.contactData.firstName,
        email: leadData.contactData.email,
        phone: leadData.contactData.phone,
        notes: leadData.notes || 'Brak uwag',
        addons: leadData.selectedAddons.length > 0 
          ? leadData.selectedAddons.map(addon => `${addon.label} - ${this.formatPrice(addon.price)}`).join('\n')
          : 'Brak wybranych dodatków',
        timestamp: new Date(leadData.timestamp).toLocaleString('pl-PL')
      };

      console.log('Wysyłanie maila przez EmailJS:', templateParams);
      
      const response = await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams);
      
      console.log('Mail wysłany pomyślnie:', response);
      return true;
    } catch (error) {
      console.error('Błąd wysyłania maila:', error);
      return false;
    }
  }

  private formatPrice(price: number): string {
    return new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: 'PLN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  }

  saveToLocalStorage(key: string, data: any): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(`calculator_${key}`, JSON.stringify(data));
    }
  }

  getFromLocalStorage<T>(key: string): T | null {
    if (typeof window !== 'undefined') {
      const item = localStorage.getItem(`calculator_${key}`);
      return item ? JSON.parse(item) : null;
    }
    return null;
  }

  clearLocalStorage(): void {
    if (typeof window !== 'undefined') {
      const keys = Object.keys(localStorage).filter(key => key.startsWith('calculator_'));
      keys.forEach(key => localStorage.removeItem(key));
    }
  }
} 