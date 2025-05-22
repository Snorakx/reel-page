import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';

interface HeroReelProps {
  headlines: string[];
  bulletPoints: string[];
  headlineDuration?: number;
  scrollCueText?: string;
  logoText?: string;
}

export default function HeroReel({
  headlines = [
    "Masz pomysł, ale nie wiesz od czego zacząć?",
    "Masz problem, który zjada Twój czas i pieniądze?",
    "Potrzebujesz wsparcia doświadczonego zespołu?"
  ],
  bulletPoints = [
    "Potrzebujesz MVP, ale nikt nie robi tego szybciej niż w 3 miesiące?",
    "Masz aplikację, która ledwo zipie i nikt jej nie chce dotykać?",
    "Masz produkt, ale brakuje Ci feature'a, który przekona inwestorów?"
  ],
  headlineDuration = 4000,
  scrollCueText = "Scrolluj dalej",
  logoText = "CODERNO"
}: HeroReelProps) {
  const [currentHeadline, setCurrentHeadline] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  
  // Rotate headlines every few seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeadline((prev) => (prev + 1) % headlines.length);
    }, headlineDuration);
    
    return () => clearInterval(interval);
  }, [headlines.length, headlineDuration]);
  
  // Parallax effect on scroll
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, -100]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  
  // Handle scroll to next section
  const handleScrollDown = () => {
    const nextSection = document.querySelector('#hero + section');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Logo animation variants
  const logoVariants = {
    hidden: { 
      opacity: 0,
      y: -20,
      letterSpacing: "-0.5em"
    },
    visible: { 
      opacity: 1,
      y: 0,
      letterSpacing: "0.05em",
      transition: {
        duration: 1,
        ease: [0.22, 1, 0.36, 1],
        staggerChildren: 0.1
      }
    }
  };

  const letterVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  return (
    <motion.div 
      ref={ref}
      style={{ y, opacity }}
      className="relative h-screen w-full flex flex-col justify-center items-center bg-[#0B0F1A] text-white overflow-hidden"
    >
      {/* Background subtle glow effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
      
      {/* Subtle background grid pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNjB2NjBIMHoiLz48cGF0aCBkPSJNMzAgMzBoMzB2MzBIMzB6IiBzdHJva2U9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiIHN0cm9rZS13aWR0aD0iLjUiLz48cGF0aCBkPSJNMCAzMGgzMHYzMEgweiIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDMpIiBzdHJva2Utd2lkdGg9Ii41Ii8+PC9nPjwvc3ZnPg==')] opacity-20" />
      
      {/* Logo Coderno */}
      <motion.div
        className="absolute top-10 w-full text-center z-10"
        initial="hidden"
        animate="visible"
        variants={logoVariants}
      >
        <h2 className="font-montserrat font-bold text-3xl md:text-4xl tracking-wider text-shadow-blue">
          {logoText.split('').map((letter, index) => (
            <motion.span 
              key={index} 
              variants={letterVariants}
              className="inline-block"
            >
              {letter}
            </motion.span>
          ))}
        </h2>
      </motion.div>
      
      <div className="container mx-auto px-4 z-10">
        <div className="max-w-4xl mx-auto">
          {/* Headline section with fade transition */}
          <div className="mb-12 h-[120px] sm:h-[150px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.h1
                key={currentHeadline}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="text-3xl sm:text-4xl md:text-5xl font-bold text-center leading-tight text-shadow-blue"
              >
                {headlines[currentHeadline]}
              </motion.h1>
            </AnimatePresence>
          </div>
          
          {/* Bullet points with staggered animation */}
          <div className="space-y-6 mb-16">
            {bulletPoints.map((point, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ 
                  duration: 0.5, 
                  delay: index * 0.2 + 0.5,
                  ease: [0.25, 0.1, 0.25, 1]
                }}
                className="flex items-start"
              >
                <span className="text-blue-400 mr-3 mt-1 text-xl">•</span>
                <p className="text-lg sm:text-xl text-blue-50">{point}</p>
              </motion.div>
            ))}
          </div>
          
          {/* CTA button with hover effect */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.5 }}
            className="flex justify-center"
          >
            <button 
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition-all duration-300 text-lg hover:shadow-[0_0_15px_rgba(37,99,235,0.5)]"
            >
              Porozmawiajmy
            </button>
          </motion.div>
        </div>
      </div>
      
      {/* Scroll cue at the bottom */}
      <motion.div 
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center cursor-pointer"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 0.5 }}
        onClick={handleScrollDown}
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ 
            repeat: Infinity, 
            duration: 2,
            ease: "easeInOut"
          }}
          className="flex flex-col items-center"
        >
          <p className="text-blue-300 mb-2 text-sm">{scrollCueText}</p>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="text-blue-300"
          >
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </motion.div>
      </motion.div>
      
      {/* Dodatkowy dekoracyjny element */}
      <div className="absolute top-10 right-10 w-20 h-20 bg-blue-500/5 rounded-full blur-md animate-pulse" />
      <div className="absolute bottom-20 left-10 w-32 h-32 bg-blue-500/5 rounded-full blur-md animate-pulse" style={{ animationDelay: '1s' }} />
    </motion.div>
  );
} 