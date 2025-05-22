import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import StorySlide from './StorySlide';

// Dane dla kroków procesu
const storySteps = [
  {
    id: 'ziarno',
    title: 'Ziarno',
    subtitle: 'Masz pomysł. Albo tylko jego cień.',
    description: 'Możemy zbudować coś z niczego. Dosłownie.',
    color: 'from-blue-600/20 to-indigo-900/30',
    blur: 'blur-[120px]'
  },
  {
    id: 'zrozumienie',
    title: 'Zrozumienie',
    subtitle: 'Zadajemy pytania. Piszemy na Miro, rozrysowujemy.',
    description: 'Nie musisz wiedzieć, co to MVP – zrozumiesz po rozmowie.',
    color: 'from-purple-600/20 to-blue-900/30',
    blur: 'blur-[150px]'
  },
  {
    id: 'prototyp',
    title: 'Prototyp',
    subtitle: 'Interaktywna makieta do klikania, nie PDF do śnienia.',
    description: 'Testujesz z klientami lub inwestorem już za chwilę.',
    color: 'from-indigo-600/20 to-purple-900/30',
    blur: 'blur-[130px]'
  },
  {
    id: 'start',
    title: 'Start',
    subtitle: 'Kodujemy. Szybko, ale czysto.',
    description: 'Twój pomysł staje się prawdziwym produktem.',
    color: 'from-cyan-600/20 to-blue-900/30',
    blur: 'blur-[140px]'
  }
];

export default function StorytellingSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Obsługa progres bara i śledzenie aktywnego slajdu
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      
      const container = containerRef.current;
      const containerTop = container.offsetTop;
      const containerHeight = container.offsetHeight;
      const slideHeight = containerHeight / storySteps.length;
      
      const scrollPosition = window.scrollY - containerTop;
      const currentIndex = Math.min(
        Math.max(0, Math.floor(scrollPosition / slideHeight)),
        storySteps.length - 1
      );
      
      setActiveIndex(currentIndex);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Inicjalne ustawienie

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Progres bar
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  return (
    <div 
      ref={containerRef} 
      className="relative bg-[#0B0F1A]"
      style={{ height: `${storySteps.length * 100}vh` }}
    >
      {/* Progress bar */}
      <div className="fixed top-0 left-0 w-full z-50 px-4 py-2">
        <div className="h-1 bg-gray-800/50 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-blue-500"
            style={{ 
              scaleX: scrollYProgress,
              transformOrigin: "left" 
            }}
          />
        </div>
        
        {/* Progress indicators */}
        <div className="hidden md:flex items-center justify-center space-x-2 mt-2">
          {storySteps.map((step, index) => (
            <div 
              key={step.id}
              className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                index <= activeIndex ? 'bg-blue-500' : 'bg-gray-700'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Stories */}
      {storySteps.map((step, index) => (
        <StorySlide
          key={step.id}
          index={index}
          title={step.title}
          subtitle={step.subtitle}
          description={step.description}
          color={step.color}
          blur={step.blur}
          isActive={index === activeIndex}
        />
      ))}
    </div>
  );
} 