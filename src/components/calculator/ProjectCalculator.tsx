import React, { useState, useEffect } from 'react';
import { ProjectCalculatorService } from '../../services/ProjectCalculatorService';
import type { ProjectType, ProjectAddon, ContactData } from '../../types/ProjectCalculator';

// Import step components
import ProjectCalculatorWelcome from './ProjectCalculatorWelcome';
import ProjectTypeStep from './ProjectTypeStep';
import AddonStep from './AddonStep';
import NotesStep from './NotesStep';
import SummaryStep from './SummaryStep';
import CostPanel from './CostPanel';

// Import mobile components
import MobileCostPanel from './MobileCostPanel';
import MobileProgressBar from './MobileProgressBar';
import MobileNavigationButtons from './MobileNavigationButtons';
import DesktopNavigationButtons from './DesktopNavigationButtons';

const ProjectCalculator: React.FC = () => {
  const [service] = useState(() => new ProjectCalculatorService());
  const [state, setState] = useState(service.getState());
  const [availableAddons, setAvailableAddons] = useState<ProjectAddon[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Mobile states
  const [isMobileCostPanelOpen, setIsMobileCostPanelOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update state when service changes
  const updateState = () => {
    setState(service.getState());
  };

  // Load available addons when project type changes
  useEffect(() => {
    const loadAddons = async () => {
      if (state.selectedProjectType) {
        setIsLoading(true);
        try {
          const addons = await service.getAvailableAddons();
          setAvailableAddons(addons);
        } catch (error) {
          console.error('Error loading addons:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    loadAddons();
  }, [state.selectedProjectType, service]);

  // Navigation handlers
  const handleNext = () => {
    const success = service.nextStep();
    if (success) {
      updateState();
    }
  };

  const handleBack = () => {
    const success = service.previousStep();
    if (success) {
      updateState();
    }
  };

  const handleStart = () => {
    service.jumpToStep(1);
    updateState();
  };

  // Project type selection
  const handleProjectTypeSelect = (type: ProjectType) => {
    service.setProjectType(type);
    updateState();
  };

  // Addon selection
  const handleAddonToggle = (addon: ProjectAddon) => {
    service.toggleAddon(addon);
    updateState();
  };

  // Notes
  const handleNotesChange = (notes: string) => {
    service.setNotes(notes);
    updateState();
  };

  // Contact data
  const handleContactDataChange = (data: Partial<ContactData>) => {
    service.updateContactData(data);
    updateState();
  };

  // Form submission
  const handleSubmit = async (): Promise<boolean> => {
    try {
      setIsSubmitting(true);
      const success = await service.submitLead();
      if (success) {
        updateState();
      }
      return success;
    } catch (error) {
      console.error('Error submitting lead:', error);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset calculator
  const handleReset = () => {
    service.resetCalculator();
    updateState();
    setAvailableAddons([]);
  };

  // Get base price for current project type
  const getBasePrice = (): number => {
    if (!state.selectedProjectType) return 0;
    const config = service.getProjectTypeConfig(state.selectedProjectType);
    return config?.basePrice || 0;
  };

  // Check if addon is selected
  const isAddonSelected = (addon: ProjectAddon): boolean => {
    return service.isAddonSelected(addon);
  };

  // Get selected addons as ProjectAddon array (for compatibility)
  const getSelectedAddonsAsProjectAddons = (): ProjectAddon[] => {
    return state.selectedAddons.map(addon => ({
      label: addon.label,
      description: addon.description,
      price: addon.price
    }));
  };

  // Remove addon from cost panel
  const handleRemoveAddon = (addonToRemove: any) => {
    const matchingAddon = availableAddons.find(addon => addon.label === addonToRemove.label);
    if (matchingAddon) {
      service.toggleAddon(matchingAddon);
      updateState();
    }
  };

  // Show cost panel from step 1 onwards
  const showCostPanel = state.currentStep >= 1 && !!state.selectedProjectType;

  // Mobile handlers
  const handleMobileCostPanelToggle = () => {
    setIsMobileCostPanelOpen(!isMobileCostPanelOpen);
  };

  const handleMobileCostPanelClose = () => {
    setIsMobileCostPanelOpen(false);
  };

  // Step labels for mobile progress
  const stepLabels = [
    'Witamy',
    'Typ projektu',
    'Dodatki',
    'Uwagi',
    'Podsumowanie'
  ];

  // Mobile navigation props
  const getMobileNavProps = () => {
    switch (state.currentStep) {
      case 0:
        return { showNext: false, showBack: false, showSubmit: false };
      case 1:
        return { 
          showNext: true, 
          showBack: true, 
          showSubmit: false, 
          nextDisabled: !state.selectedProjectType,
          showCostButton: !!state.selectedProjectType 
        };
      case 2:
        return { 
          showNext: true, 
          showBack: true, 
          showSubmit: false, 
          showCostButton: true 
        };
      case 3:
        return { 
          showNext: true, 
          showBack: true, 
          showSubmit: false, 
          showCostButton: true 
        };
      case 4:
        return { 
          showNext: false, 
          showBack: true, 
          showSubmit: true, 
          submitDisabled: !state.contactData.firstName || !state.contactData.email || !state.contactData.phone || !state.contactData.gdprConsent,
          showCostButton: true 
        };
      default:
        return { showNext: false, showBack: false, showSubmit: false };
    }
  };

  const mobileNavProps = getMobileNavProps();

  return (
    <div className="relative">
      {/* Mobile Progress Bar */}
      {state.currentStep > 0 && (
        <MobileProgressBar
          currentStep={state.currentStep}
          totalSteps={4}
          stepLabels={stepLabels}
        />
      )}

      {/* Desktop Cost Panel */}
      {showCostPanel && (
        <CostPanel
          projectType={state.selectedProjectType}
          basePrice={getBasePrice()}
          selectedAddons={state.selectedAddons}
          totalCost={state.totalCost}
          formatPrice={service.formatPrice.bind(service)}
          isVisible={showCostPanel}
          onRemoveAddon={handleRemoveAddon}
        />
      )}

      {/* Mobile Cost Panel */}
      <MobileCostPanel
        projectType={state.selectedProjectType}
        basePrice={getBasePrice()}
        selectedAddons={state.selectedAddons}
        totalCost={state.totalCost}
        formatPrice={service.formatPrice.bind(service)}
        isOpen={isMobileCostPanelOpen}
        onClose={handleMobileCostPanelClose}
        onRemoveAddon={handleRemoveAddon}
      />

      {/* Main calculator content */}
      <div className={`transition-all duration-300 ${showCostPanel ? 'lg:mr-80' : ''} ${state.currentStep > 0 ? 'pt-20 lg:pt-0' : ''} ${state.currentStep > 0 ? 'pb-20 lg:pb-32' : ''}`}>
        {/* Step 0: Welcome */}
        {state.currentStep === 0 && (
          <ProjectCalculatorWelcome onStart={handleStart} />
        )}

        {/* Step 1: Project Type Selection */}
        {state.currentStep === 1 && (
          <ProjectTypeStep
            selectedType={state.selectedProjectType}
            onSelectType={handleProjectTypeSelect}
            onNext={handleNext}
            onBack={handleBack}
          />
        )}

        {/* Step 2: Addon Selection */}
        {state.currentStep === 2 && state.selectedProjectType && (
          <AddonStep
            projectType={state.selectedProjectType}
            selectedAddons={getSelectedAddonsAsProjectAddons()}
            availableAddons={availableAddons}
            onToggleAddon={handleAddonToggle}
            onNext={handleNext}
            onBack={handleBack}
            formatPrice={service.formatPrice.bind(service)}
          />
        )}

        {/* Step 3: Notes */}
        {state.currentStep === 3 && (
          <NotesStep
            notes={state.notes}
            onNotesChange={handleNotesChange}
            onNext={handleNext}
            onBack={handleBack}
          />
        )}

        {/* Step 4: Summary */}
        {state.currentStep === 4 && state.selectedProjectType && (
          <SummaryStep
            projectType={state.selectedProjectType}
            selectedAddons={state.selectedAddons}
            notes={state.notes}
            contactData={state.contactData}
            totalCost={state.totalCost}
            basePrice={getBasePrice()}
            formatPrice={service.formatPrice.bind(service)}
            onContactDataChange={handleContactDataChange}
            onSubmit={handleSubmit}
            onBack={handleBack}
          />
        )}

        {/* Loading overlay */}
        {isLoading && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-gray-900 rounded-lg p-6 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 border-2 border-emerald-400/20 border-t-emerald-400 rounded-full animate-spin"></div>
                <span className="text-white">Ładowanie dodatków...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Navigation Buttons */}
      {state.currentStep > 0 && (
        <MobileNavigationButtons
          onNext={handleNext}
          onBack={handleBack}
          onSubmit={handleSubmit}
          nextDisabled={mobileNavProps.nextDisabled}
          submitDisabled={mobileNavProps.submitDisabled}
          isSubmitting={isSubmitting}
          showNext={mobileNavProps.showNext}
          showBack={mobileNavProps.showBack}
          showSubmit={mobileNavProps.showSubmit}
          showCostButton={mobileNavProps.showCostButton}
          totalCost={state.totalCost}
          formatPrice={service.formatPrice.bind(service)}
          onShowCost={handleMobileCostPanelToggle}
        />
      )}

      {/* Desktop Navigation Buttons */}
      {state.currentStep > 0 && (
        <DesktopNavigationButtons
          onNext={mobileNavProps.showNext ? handleNext : undefined}
          onBack={mobileNavProps.showBack ? handleBack : undefined}
          onSubmit={mobileNavProps.showSubmit ? handleSubmit : undefined}
          nextDisabled={mobileNavProps.nextDisabled}
          submitDisabled={mobileNavProps.submitDisabled}
          isSubmitting={isSubmitting}
          showNext={mobileNavProps.showNext}
          showBack={mobileNavProps.showBack}
          showSubmit={mobileNavProps.showSubmit}
          showCostPanel={showCostPanel}
        />
      )}

      {/* Desktop Progress indicator */}
      {state.currentStep > 0 && (
        <div className={`hidden lg:block fixed bottom-6 left-6 z-40 ${showCostPanel ? 'mr-80' : ''}`}>
          <div className="bg-gray-900/95 backdrop-blur-sm border border-gray-800 rounded-lg p-4 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                {service.getSteps().map((step, index) => (
                  <div
                    key={step.id}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      step.isCompleted 
                        ? 'bg-emerald-400' 
                        : step.isActive 
                        ? 'bg-emerald-400' 
                        : 'bg-gray-600'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-400">
                Krok {state.currentStep} z {service.getSteps().length - 1}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Debug panel (only in development) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed top-6 left-6 z-50">
          <div className="bg-gray-900/95 backdrop-blur-sm border border-gray-800 rounded-lg p-4 shadow-xl">
            <h3 className="text-sm font-medium text-white mb-2">Debug Info</h3>
            <div className="text-xs text-gray-400 space-y-1">
              <p>Current Step: {state.currentStep}</p>
              <p>Project Type: {state.selectedProjectType || 'None'}</p>
              <p>Addons: {state.selectedAddons.length}</p>
              <p>Total Cost: {service.formatPrice(state.totalCost)}</p>
              <button
                onClick={handleReset}
                className="mt-2 text-xs bg-red-500/20 hover:bg-red-500/30 text-red-400 px-2 py-1 rounded"
              >
                Reset Calculator
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectCalculator; 