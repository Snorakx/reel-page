import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ProjectType, SelectedAddon, ContactData } from '../../types/ProjectCalculator';

interface SummaryStepProps {
  projectType: ProjectType;
  selectedAddons: SelectedAddon[];
  notes: string;
  contactData: ContactData;
  totalCost: number;
  formatPrice: (price: number) => string;
  onContactDataChange: (data: Partial<ContactData>) => void;
  onSubmit: () => Promise<boolean>;
  onBack: () => void;
  basePrice: number;
}

const SummaryStep: React.FC<SummaryStepProps> = ({
  projectType,
  selectedAddons,
  notes,
  contactData,
  totalCost,
  formatPrice,
  onContactDataChange,
  onSubmit,
  onBack,
  basePrice
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const getProjectTypeName = (type: ProjectType) => {
    const names = {
      website: 'Strona wizytówkowa typu klasycznego',
      ecommerce: 'Strona dla urzędu lub instytucji',
      ai_tools: 'Narzędzia AI i Automatyzacja',
      erp_systems: 'Systemy ERP'
    };
    return names[type];
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!contactData.firstName.trim()) {
      errors.firstName = 'Imię jest wymagane';
    }
    
    if (!contactData.email.trim()) {
      errors.email = 'Email jest wymagany';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactData.email)) {
      errors.email = 'Nieprawidłowy format email';
    }
    
    if (!contactData.phone.trim()) {
      errors.phone = 'Telefon jest wymagany';
    } else if (!/^[+]?[\d\s\-\(\)]{9,}$/.test(contactData.phone)) {
      errors.phone = 'Nieprawidłowy format telefonu';
    }
    
    if (!contactData.gdprConsent) {
      errors.gdprConsent = 'Zgoda na przetwarzanie danych jest wymagana';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setSubmitStatus('idle');
    
    try {
      const success = await onSubmit();
      if (success) {
        setSubmitStatus('success');
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const addonsPrice = selectedAddons.reduce((sum, addon) => sum + addon.price, 0);

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background gradient blobs */}
      <div className="absolute top-0 right-0 w-[40%] h-full">
        <div className="absolute top-1/4 right-0 w-[300px] h-[300px] bg-gradient-to-br from-emerald-400 to-teal-400 rounded-full blur-3xl opacity-40 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[200px] h-[200px] bg-gradient-to-br from-blue-500 via-cyan-400 to-yellow-400 rounded-full blur-3xl opacity-30 animate-pulse animation-delay-2s"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-8 lg:px-16 py-6 md:py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 md:mb-16"
        >
          <div className="hidden lg:inline-flex items-center gap-2 bg-gray-800 border border-gray-700 rounded-full px-4 py-2 mb-8">
            <span className="text-emerald-400 text-sm font-medium">Krok 4</span>
            <span className="text-gray-400 text-sm">Podsumowanie</span>
          </div>
          
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-light text-white mb-4">
            Podsumowanie projektu
          </h1>
          
          <p className="text-lg md:text-xl text-gray-400 font-light max-w-2xl mx-auto">
            Sprawdź szczegóły konfiguracji i pozostaw swoje dane kontaktowe
          </p>
        </motion.div>

        {/* Beta disclaimer */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mb-8 md:mb-12"
        >
          <div className="text-xs text-gray-600 bg-gray-900/30 border border-gray-800/50 rounded-lg px-4 py-3 inline-block">
            <span className="opacity-70">
              ⚠️ Kalkulator znajduje się w fazie testów. Przedstawiona wycena ma charakter orientacyjny i nie stanowi wiążącej oferty handlowej.
            </span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left column - Project summary */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Project type */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 md:p-6 mb-4 md:mb-6">
              <h3 className="text-lg md:text-xl font-medium text-white mb-3 md:mb-4">
                📋 Typ projektu
              </h3>
              <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-3 md:p-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300 text-sm md:text-base">
                    {getProjectTypeName(projectType)}
                  </span>
                  <span className="text-emerald-400 font-medium text-sm md:text-base">
                    {formatPrice(basePrice)}
                  </span>
                </div>
              </div>
            </div>

            {/* Selected addons */}
            {selectedAddons.length > 0 && (
              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 md:p-6 mb-4 md:mb-6">
                <h3 className="text-lg md:text-xl font-medium text-white mb-3 md:mb-4">
                  🔧 Dodatki ({selectedAddons.length})
                </h3>
                <div className="space-y-2 md:space-y-3">
                  {selectedAddons.map((addon) => (
                    <div
                      key={addon.id}
                      className="bg-gray-800/50 border border-gray-700 rounded-lg p-3"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0 pr-2">
                          <span className="text-gray-300 text-sm font-medium block">
                            {addon.label}
                          </span>
                          <span className="text-gray-500 text-xs">
                            {addon.description.length > 50 
                              ? `${addon.description.substring(0, 50)}...` 
                              : addon.description}
                          </span>
                        </div>
                        <span className="text-emerald-400 text-sm font-medium ml-2 flex-shrink-0">
                          {formatPrice(addon.price)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Notes */}
            {notes.trim() && (
              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 md:p-6 mb-4 md:mb-6">
                <h3 className="text-lg md:text-xl font-medium text-white mb-3 md:mb-4">
                  📝 Dodatkowe uwagi
                </h3>
                <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-3 md:p-4">
                  <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                    {notes}
                  </p>
                </div>
              </div>
            )}

            {/* Total cost */}
            <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-xl p-4 md:p-6">
              <h3 className="text-lg md:text-xl font-medium text-white mb-3 md:mb-4">
                💰 Szacunkowy koszt
              </h3>
              <div className="space-y-2 md:space-y-3">
                <div className="flex items-center justify-between text-gray-300 text-sm md:text-base">
                  <span>Projekt podstawowy</span>
                  <span>{formatPrice(basePrice)}</span>
                </div>
                
                {selectedAddons.length > 0 && (
                  <div className="flex items-center justify-between text-gray-300 text-sm md:text-base">
                    <span>Dodatki ({selectedAddons.length})</span>
                    <span>{formatPrice(addonsPrice)}</span>
                  </div>
                )}
                
                <div className="border-t border-emerald-500/20 pt-2 md:pt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-base md:text-lg font-medium text-white">
                      Razem netto
                    </span>
                    <span className="text-xl md:text-2xl font-semibold text-emerald-400">
                      {formatPrice(totalCost)}
                    </span>
                  </div>
                  
                  <div className="text-xs md:text-sm text-gray-400 mt-1">
                    lub w ratach 10 x {formatPrice(Math.round(totalCost / 10))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right column - Contact form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 md:p-6">
              <h3 className="text-lg md:text-xl font-medium text-white mb-4 md:mb-6">
                📞 Dane kontaktowe
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                {/* First name */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Imię *
                  </label>
                  <input
                    type="text"
                    value={contactData.firstName}
                    onChange={(e) => onContactDataChange({ firstName: e.target.value })}
                    className={`w-full px-4 py-4 bg-gray-800/50 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 transition-all duration-300 min-h-[48px] text-base ${
                      validationErrors.firstName ? 'border-red-500' : 'border-gray-700'
                    }`}
                    placeholder="Twoje imię"
                  />
                  {validationErrors.firstName && (
                    <p className="text-red-400 text-sm mt-1">{validationErrors.firstName}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={contactData.email}
                    onChange={(e) => onContactDataChange({ email: e.target.value })}
                    className={`w-full px-4 py-4 bg-gray-800/50 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 transition-all duration-300 min-h-[48px] text-base ${
                      validationErrors.email ? 'border-red-500' : 'border-gray-700'
                    }`}
                    placeholder="twoj@email.com"
                  />
                  {validationErrors.email && (
                    <p className="text-red-400 text-sm mt-1">{validationErrors.email}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Telefon *
                  </label>
                  <input
                    type="tel"
                    value={contactData.phone}
                    onChange={(e) => onContactDataChange({ phone: e.target.value })}
                    className={`w-full px-4 py-4 bg-gray-800/50 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 transition-all duration-300 min-h-[48px] text-base ${
                      validationErrors.phone ? 'border-red-500' : 'border-gray-700'
                    }`}
                    placeholder="+48 123 456 789"
                  />
                  {validationErrors.phone && (
                    <p className="text-red-400 text-sm mt-1">{validationErrors.phone}</p>
                  )}
                </div>

                {/* GDPR consent */}
                <div>
                  <label className="flex items-start gap-3 cursor-pointer min-h-[48px]">
                    <input
                      type="checkbox"
                      checked={contactData.gdprConsent}
                      onChange={(e) => onContactDataChange({ gdprConsent: e.target.checked })}
                      className="w-5 h-5 bg-gray-800/50 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500/50 mt-1 flex-shrink-0"
                    />
                    <span className="text-sm text-gray-300 leading-relaxed">
                      Wyrażam zgodę na przetwarzanie moich danych osobowych przez Coderno 
                      w celu przygotowania oferty i kontaktu handlowego. *
                    </span>
                  </label>
                  {validationErrors.gdprConsent && (
                    <p className="text-red-400 text-sm mt-1">{validationErrors.gdprConsent}</p>
                  )}
                </div>

                {/* Desktop Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="hidden lg:block w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-600 text-white px-8 py-4 rounded-lg font-medium transition-all duration-300 text-lg shadow-lg hover:shadow-emerald-500/25 min-h-[48px]"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                      Wysyłanie...
                    </div>
                  ) : (
                    'Wyślij zapytanie'
                  )}
                </button>
              </form>

              {/* Status messages */}
              <AnimatePresence>
                {submitStatus === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="mt-6 bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4"
                  >
                    <div className="flex items-center gap-2">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-emerald-400">
                        <path
                          d="M20 6L9 17l-5-5"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span className="text-emerald-400 font-medium">Zapytanie wysłane!</span>
                    </div>
                    <p className="text-emerald-300 text-sm mt-2">
                      Dziękujemy za zapytanie. Skontaktujemy się z Tobą w ciągu 24 godzin.
                    </p>
                  </motion.div>
                )}

                {submitStatus === 'error' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="mt-6 bg-red-500/10 border border-red-500/20 rounded-lg p-4"
                  >
                    <div className="flex items-center gap-2">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-red-400">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                        <path d="M15 9l-6 6M9 9l6 6" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                      <span className="text-red-400 font-medium">Błąd wysyłania</span>
                    </div>
                    <p className="text-red-300 text-sm mt-2">
                      Błąd wysyłania wiadomości. Sprawdź konfigurację EmailJS w pliku .env.local lub skontaktuj się z nami bezpośrednio.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Contact info */}
              <div className="mt-6 pt-6 border-t border-gray-800">
                <h4 className="text-sm font-medium text-white mb-3">
                  Lub skontaktuj się bezpośrednio:
                </h4>
                <div className="space-y-2 text-sm text-gray-400">
                  <p>📧 kontakt@coderno.pl</p>
                  <p>📞 +48 123 456 789</p>
                  <p>⏰ Pon-Pt: 9:00-17:00</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>



      </div>
    </div>
  );
};

export default SummaryStep; 