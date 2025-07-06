import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface NotesStepProps {
  notes: string;
  onNotesChange: (notes: string) => void;
  onNext: () => void;
  onBack: () => void;
}

const NotesStep: React.FC<NotesStepProps> = ({
  notes,
  onNotesChange,
  onNext,
  onBack
}) => {
  const [charCount, setCharCount] = useState(notes.length);
  const maxChars = 1000;

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newNotes = e.target.value;
    if (newNotes.length <= maxChars) {
      onNotesChange(newNotes);
      setCharCount(newNotes.length);
    }
  };

  const suggestedQuestions = [
    "Czy masz już gotowe materiały (logo, zdjęcia, teksty)?",
    "Jakie są główne cele Twojego projektu?",
    "Czy potrzebujesz integracji z konkretnymi systemami?",
    "Jakie są Twoje preferencje dotyczące terminów?",
    "Czy masz jakieś specjalne wymagania techniczne?",
    "Jaka jest Twoja grupa docelowa?",
    "Czy potrzebujesz szkoleń z obsługi systemu?",
    "Jakie są Twoje doświadczenia z podobnymi projektami?"
  ];

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background gradient blobs */}
      <div className="absolute top-0 right-0 w-[40%] h-full">
        <div className="absolute top-1/4 right-0 w-[300px] h-[300px] bg-gradient-to-br from-purple-400 to-pink-400 rounded-full blur-3xl opacity-40 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[200px] h-[200px] bg-gradient-to-br from-blue-500 via-cyan-400 to-yellow-400 rounded-full blur-3xl opacity-30 animate-pulse animation-delay-2s"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 md:px-8 lg:px-16 py-6 md:py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 md:mb-16"
        >
          <div className="hidden lg:inline-flex items-center gap-2 bg-gray-800 border border-gray-700 rounded-full px-4 py-2 mb-8">
            <span className="text-emerald-400 text-sm font-medium">Krok 3</span>
            <span className="text-gray-400 text-sm">Dodatkowe uwagi</span>
          </div>
          
          <h1 className="text-xl md:text-3xl lg:text-5xl font-light text-white mb-4">
            Wszystkie dodatkowe wymagania lub istotne informacje, wpisz koniecznie w tym miejscu
          </h1>
          
          <p className="text-lg md:text-xl text-gray-400 font-light max-w-2xl mx-auto">
            Pomóż nam lepiej zrozumieć Twoje potrzeby i oczekiwania
          </p>
        </motion.div>

        {/* Notes textarea */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8 md:mb-12"
        >
          <div className="relative">
            <textarea
              value={notes}
              onChange={handleNotesChange}
              placeholder="Opisz swoje wymagania, cele projektu, preferowane rozwiązania, terminy, budżet, lub inne istotne informacje..."
              className="w-full h-48 md:h-64 bg-gray-900/50 border border-gray-800 rounded-xl p-4 md:p-6 text-white placeholder-gray-500 resize-none focus:outline-none focus:border-emerald-500/50 focus:bg-gray-900/70 transition-all duration-300 text-base md:text-base"
              style={{ 
                fontFamily: 'ui-sans-serif, system-ui, sans-serif',
                lineHeight: '1.6'
              }}
            />
            
            {/* Character counter */}
            <div className="absolute bottom-3 md:bottom-4 right-3 md:right-4 text-sm text-gray-500">
              {charCount}/{maxChars}
            </div>
          </div>
        </motion.div>

        {/* Suggested questions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-8 md:mb-12"
        >
          <h3 className="text-base md:text-lg font-medium text-white mb-4 md:mb-6">
            💡 Możesz opisać:
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            {suggestedQuestions.map((question, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.5 + index * 0.05 }}
                className="bg-gray-900/30 border border-gray-800 rounded-lg p-3 md:p-4 hover:border-gray-700 transition-all duration-300 cursor-pointer min-h-[48px] flex items-center"
                onClick={() => {
                  const newNotes = notes + (notes ? '\n\n' : '') + question + '\n';
                  if (newNotes.length <= maxChars) {
                    onNotesChange(newNotes);
                    setCharCount(newNotes.length);
                  }
                }}
              >
                <p className="text-gray-400 text-sm leading-relaxed">
                  {question}
                </p>
              </motion.div>
            ))}
          </div>
          
          <p className="text-gray-500 text-sm mt-3 md:mt-4">
            Kliknij na pytanie, aby dodać je do notatek
          </p>
        </motion.div>

        {/* Info section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-gray-900/30 border border-gray-800 rounded-lg p-6 mb-8"
        >
          <h3 className="text-lg font-medium text-white mb-2">
            ℹ️ Dlaczego to ważne?
          </h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            Dodatkowe informacje pozwalają nam przygotować bardziej precyzyjną wycenę i zaproponować 
            najlepsze rozwiązania dla Twojego projektu. Im więcej szczegółów podasz, tym lepiej będziemy 
            mogli dopasować nasze usługi do Twoich potrzeb.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default NotesStep; 