interface NavigationProps {
  scrollToSection: (index: number) => void;
}

export default function Navigation({ scrollToSection }: NavigationProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 p-6 md:p-8 mix-blend-difference">
      <div className="flex justify-between items-center">
        <button 
          onClick={() => scrollToSection(0)}
          className="text-2xl font-black tracking-wider text-white hover:scale-105 transition-transform duration-300 cursor-pointer"
        >
          CODERNO
        </button>
        <div className="hidden md:flex space-x-8 text-xs font-bold uppercase tracking-[3px] text-white">
          <a href="/ai-automatyzacja" className="hover:scale-110 transition-transform duration-300">AI</a>
          <a href="/optymalizacja-procesow" className="hover:scale-110 transition-transform duration-300">PROCESY</a>
          <a href="/mvp-development" className="hover:scale-110 transition-transform duration-300">MVP</a>
          <button 
            className="hover:scale-110 transition-transform duration-300" 
            onClick={() => scrollToSection(3)}
          >
            KONTAKT
          </button>
        </div>
      </div>
    </nav>
  );
} 