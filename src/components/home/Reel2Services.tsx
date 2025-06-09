export default function Reel2Services() {
  return (
    <section className="reel reel-2 h-screen w-full bg-white text-black flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-tr from-white via-gray-50 to-white"></div>
      
      <div className="max-w-7xl mx-auto px-6 z-10 reel-content">
        <h3 className="text-6xl md:text-8xl font-black text-center mb-16 tracking-tighter animate-slide-up">
          CO ROBIMY?
        </h3>
        
        <div className="grid md:grid-cols-3 gap-12">
          {/* AI Service */}
          <div className="service-card group cursor-pointer animate-slide-up delay-200">
            <div className="service-icon mb-8">
              <svg className="w-24 h-24 mx-auto transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12" viewBox="0 0 100 100" fill="none">
                <rect x="20" y="20" width="60" height="60" rx="8" stroke="black" strokeWidth="3" fill="none"/>
                <circle cx="35" cy="35" r="4" fill="black"/>
                <circle cx="65" cy="35" r="4" fill="black"/>
                <path d="M35 55 Q50 65 65 55" stroke="black" strokeWidth="3" fill="none"/>
                <rect x="15" y="15" width="6" height="6" fill="black"/>
                <rect x="79" y="15" width="6" height="6" fill="black"/>
                <rect x="15" y="79" width="6" height="6" fill="black"/>
                <rect x="79" y="79" width="6" height="6" fill="black"/>
              </svg>
            </div>
            <h4 className="text-3xl font-black mb-4 tracking-tight">AI & AUTOMATYZACJA</h4>
            <p className="text-lg font-medium leading-relaxed text-gray-700">
              Inteligentne chatboty, analiza danych<br/>
              i automatyzacja procesów biznesowych
            </p>
          </div>
          
          {/* Optimization Service */}
          <div className="service-card group cursor-pointer animate-slide-up delay-400">
            <div className="service-icon mb-8">
              <svg className="w-24 h-24 mx-auto transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12" viewBox="0 0 100 100" fill="none">
                <polygon points="50,15 65,35 85,35 70,50 85,65 65,65 50,85 35,65 15,65 30,50 15,35 35,35" fill="black"/>
                <circle cx="50" cy="50" r="8" fill="white"/>
                <path d="M25 25 L75 75 M75 25 L25 75" stroke="black" strokeWidth="2"/>
              </svg>
            </div>
            <h4 className="text-3xl font-black mb-4 tracking-tight">OPTYMALIZACJA</h4>
            <p className="text-lg font-medium leading-relaxed text-gray-700">
              Usprawnienie procesów, redukcja kosztów<br/>
              i przyspieszenie operacji firmowych
            </p>
          </div>
          
          {/* MVP Service */}
          <div className="service-card group cursor-pointer animate-slide-up delay-600">
            <div className="service-icon mb-8">
              <svg className="w-24 h-24 mx-auto transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12" viewBox="0 0 100 100" fill="none">
                <path d="M20 50 L40 30 L60 50 L80 30" stroke="black" strokeWidth="4" fill="none"/>
                <circle cx="20" cy="50" r="6" fill="black"/>
                <circle cx="40" cy="30" r="6" fill="black"/>
                <circle cx="60" cy="50" r="6" fill="black"/>
                <circle cx="80" cy="30" r="6" fill="black"/>
                <rect x="15" y="65" width="70" height="15" rx="7" fill="black"/>
              </svg>
            </div>
            <h4 className="text-3xl font-black mb-4 tracking-tight">MVP W 3 MIESIĄCE</h4>
            <p className="text-lg font-medium leading-relaxed text-gray-700">
              Od pomysłu do działającego produktu<br/>
              Testuj i waliduj swoje idee biznesowe
            </p>
          </div>
        </div>
      </div>
    </section>
  );
} 