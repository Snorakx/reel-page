import { ProjectCalculatorRepository } from '../repositories/ProjectCalculatorRepository';
import type { 
  ProjectCalculatorState, 
  ProjectType, 
  ProjectAddon,
  SelectedAddon,
  ContactData,
  LeadData,
  CalculatorStep 
} from '../types/ProjectCalculator';

export class ProjectCalculatorService {
  private repository: ProjectCalculatorRepository;
  private state: ProjectCalculatorState;
  private steps: CalculatorStep[] = [
    { id: 0, name: 'Powitanie', component: 'welcome', isCompleted: false, isActive: true },
    { id: 1, name: 'Typ projektu', component: 'project-type', isCompleted: false, isActive: false },
    { id: 2, name: 'Dodatki', component: 'addons', isCompleted: false, isActive: false },
    { id: 3, name: 'Uwagi', component: 'notes', isCompleted: false, isActive: false },
    { id: 4, name: 'Podsumowanie', component: 'summary', isCompleted: false, isActive: false }
  ];

  constructor() {
    this.repository = ProjectCalculatorRepository.getInstance();
    this.state = this.initializeState();
    this.loadStateFromStorage();
  }

  private initializeState(): ProjectCalculatorState {
    return {
      currentStep: 0,
      selectedProjectType: null,
      selectedAddons: [],
      notes: '',
      contactData: {
        firstName: '',
        email: '',
        phone: '',
        gdprConsent: false
      },
      totalCost: 0
    };
  }

  private loadStateFromStorage(): void {
    try {
      const savedState = this.repository.getFromLocalStorage<ProjectCalculatorState>('state');
      if (savedState) {
        this.state = { ...this.state, ...savedState };
        this.updateStepsFromState();
      }
    } catch (error) {
      console.error('Error loading state from storage:', error);
    }
  }

  private saveStateToStorage(): void {
    try {
      this.repository.saveToLocalStorage('state', this.state);
    } catch (error) {
      console.error('Error saving state to storage:', error);
    }
  }

  private updateStepsFromState(): void {
    this.steps.forEach((step, index) => {
      if (index < this.state.currentStep) {
        step.isCompleted = true;
        step.isActive = false;
      } else if (index === this.state.currentStep) {
        step.isActive = true;
        step.isCompleted = false;
      } else {
        step.isActive = false;
        step.isCompleted = false;
      }
    });
  }

  getState(): ProjectCalculatorState {
    return { ...this.state };
  }

  getSteps(): CalculatorStep[] {
    return [...this.steps];
  }

  getCurrentStep(): number {
    return this.state.currentStep;
  }

  nextStep(): boolean {
    if (this.canProceedToNextStep()) {
      this.steps[this.state.currentStep].isCompleted = true;
      this.steps[this.state.currentStep].isActive = false;
      
      if (this.state.currentStep < this.steps.length - 1) {
        this.state.currentStep++;
        this.steps[this.state.currentStep].isActive = true;
        this.saveStateToStorage();
        return true;
      }
    }
    return false;
  }

  previousStep(): boolean {
    if (this.state.currentStep > 0) {
      this.steps[this.state.currentStep].isActive = false;
      this.state.currentStep--;
      this.steps[this.state.currentStep].isActive = true;
      this.steps[this.state.currentStep].isCompleted = false;
      this.saveStateToStorage();
      return true;
    }
    return false;
  }

  jumpToStep(stepIndex: number): boolean {
    if (stepIndex >= 0 && stepIndex < this.steps.length) {
      this.steps[this.state.currentStep].isActive = false;
      this.state.currentStep = stepIndex;
      this.steps[this.state.currentStep].isActive = true;
      this.updateStepsFromState();
      this.saveStateToStorage();
      return true;
    }
    return false;
  }

  private canProceedToNextStep(): boolean {
    switch (this.state.currentStep) {
      case 0: // Welcome screen
        return true;
      case 1: // Project type selection
        return this.state.selectedProjectType !== null;
      case 2: // Addons selection
        return true; // Addons are optional
      case 3: // Notes
        return true; // Notes are optional
      case 4: // Summary
        return this.validateContactData();
      default:
        return false;
    }
  }

  setProjectType(projectType: ProjectType): void {
    this.state.selectedProjectType = projectType;
    this.state.selectedAddons = []; // Clear addons when project type changes
    this.calculateTotalCost();
    this.saveStateToStorage();
  }

  async getAvailableAddons(): Promise<ProjectAddon[]> {
    if (!this.state.selectedProjectType) {
      return [];
    }
    return await this.repository.getProjectTypeAddons(this.state.selectedProjectType);
  }

  toggleAddon(addon: ProjectAddon): void {
    if (!this.state.selectedProjectType) return;

    const addonId = `${this.state.selectedProjectType}_${addon.label}`;
    const existingIndex = this.state.selectedAddons.findIndex(a => a.id === addonId);

    if (existingIndex >= 0) {
      // Remove addon
      this.state.selectedAddons.splice(existingIndex, 1);
    } else {
      // Add addon
      const selectedAddon: SelectedAddon = {
        ...addon,
        id: addonId,
        projectType: this.state.selectedProjectType
      };
      this.state.selectedAddons.push(selectedAddon);
    }

    this.calculateTotalCost();
    this.saveStateToStorage();
  }

  isAddonSelected(addon: ProjectAddon): boolean {
    if (!this.state.selectedProjectType) return false;
    const addonId = `${this.state.selectedProjectType}_${addon.label}`;
    return this.state.selectedAddons.some(a => a.id === addonId);
  }

  setNotes(notes: string): void {
    this.state.notes = notes;
    this.saveStateToStorage();
  }

  updateContactData(contactData: Partial<ContactData>): void {
    this.state.contactData = { ...this.state.contactData, ...contactData };
    this.saveStateToStorage();
  }

  private validateContactData(): boolean {
    const { firstName, email, phone, gdprConsent } = this.state.contactData;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[+]?[\d\s\-\(\)]{9,}$/;

    return !!(
      firstName.trim() &&
      email.trim() &&
      emailRegex.test(email) &&
      phone.trim() &&
      phoneRegex.test(phone) &&
      gdprConsent
    );
  }

  private calculateTotalCost(): void {
    if (!this.state.selectedProjectType) {
      this.state.totalCost = 0;
      return;
    }

    this.state.totalCost = this.repository.calculateTotalCost(
      this.state.selectedProjectType,
      this.state.selectedAddons
    );
  }

  getProjectTypeConfig(projectType: ProjectType) {
    return this.repository.getProjectTypeConfig(projectType);
  }

  getAllProjectTypes(): ProjectType[] {
    return this.repository.getAllProjectTypes();
  }

  async submitLead(): Promise<boolean> {
    if (!this.validateContactData() || !this.state.selectedProjectType) {
      return false;
    }

    const leadData: LeadData = {
      projectType: this.state.selectedProjectType,
      selectedAddons: this.state.selectedAddons,
      totalCost: this.state.totalCost,
      notes: this.state.notes,
      contactData: this.state.contactData,
      timestamp: new Date().toISOString()
    };

    const success = await this.repository.sendLead(leadData);
    
    if (success) {
      this.resetCalculator();
    }
    
    return success;
  }

  resetCalculator(): void {
    this.state = this.initializeState();
    this.steps.forEach((step, index) => {
      step.isCompleted = false;
      step.isActive = index === 0;
    });
    this.repository.clearLocalStorage();
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: 'PLN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  }

  getProgress(): number {
    const completedSteps = this.steps.filter(step => step.isCompleted).length;
    return Math.round((completedSteps / this.steps.length) * 100);
  }
} 