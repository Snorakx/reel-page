interface ReelIndicatorsProps {
  currentReel: number;
  scrollToSection: (index: number) => void;
}

export default function ReelIndicators({ currentReel, scrollToSection }: ReelIndicatorsProps) {
  const indicators = [0, 1, 2, 3];

  return (
    <div className="fixed left-3 sm:left-4 md:left-6 top-1/2 transform -translate-y-1/2 z-40 space-y-2 md:space-y-3">
      {indicators.map((index) => (
        <div
          key={index}
          className={`reel-indicator w-1.5 md:w-2 h-6 md:h-8 rounded-full transition-all duration-300 cursor-pointer ${
            index === currentReel 
              ? 'active bg-white' 
              : 'bg-white/30'
          }`}
          data-reel={index}
          onClick={() => scrollToSection(index)}
        />
      ))}
    </div>
  );
} 