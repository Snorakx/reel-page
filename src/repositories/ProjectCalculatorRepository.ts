import type { 
  ProjectCalculatorData, 
  ProjectAddon, 
  ProjectType, 
  ProjectTypeConfig,
  LeadData 
} from '../types/ProjectCalculator';

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
      const response = await fetch('/api/send-lead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(leadData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return true;
    } catch (error) {
      console.error('Error sending lead:', error);
      return false;
    }
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