export type ProjectType = 'website' | 'ecommerce' | 'ai_tools' | 'erp_systems';

export interface ProjectAddon {
  label: string;
  description: string;
  price: number;
}

export interface ProjectTypeOption {
  id: ProjectType;
  name: string;
  description: string;
  basePrice: number;
  features: string[];
  addons: ProjectAddon[];
}

export interface SelectedAddon extends ProjectAddon {
  id: string;
  projectType: ProjectType;
}

export interface ProjectCalculatorState {
  currentStep: number;
  selectedProjectType: ProjectType | null;
  selectedAddons: SelectedAddon[];
  notes: string;
  contactData: ContactData;
  totalCost: number;
}

export interface ContactData {
  firstName: string;
  email: string;
  phone: string;
  gdprConsent: boolean;
}

export interface ProjectCalculatorData {
  website: ProjectAddon[];
  ecommerce: ProjectAddon[];
  ai_tools: ProjectAddon[];
  erp_systems: ProjectAddon[];
}

export interface LeadData {
  projectType: ProjectType;
  selectedAddons: SelectedAddon[];
  totalCost: number;
  notes: string;
  contactData: ContactData;
  timestamp: string;
}

export interface CalculatorStep {
  id: number;
  name: string;
  component: string;
  isCompleted: boolean;
  isActive: boolean;
}

export interface ProjectTypeConfig {
  [key: string]: {
    name: string;
    description: string;
    basePrice: number;
    features: string[];
    icon: string;
    gradient: string;
  };
} 