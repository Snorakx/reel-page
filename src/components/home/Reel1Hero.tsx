import { useTranslations } from '../../i18n/config';

interface Reel1HeroProps {
  lang?: string;
}

export default function Reel1Hero({ lang = 'pl' }: Reel1HeroProps) {
  const t = useTranslations(lang);

  return (
    <section className="reel reel-1 h-screen w-full bg-black text-white flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="grid grid-cols-8 h-full">
          <div className="bg-gradient-to-b from-blue-500 to-transparent"></div>
          <div className="bg-gradient-to-b from-transparent to-cyan-500 delay-100"></div>
          <div className="bg-gradient-to-b from-blue-500 to-transparent delay-200"></div>
          <div className="bg-gradient-to-b from-transparent to-cyan-500 delay-300"></div>
          <div className="bg-gradient-to-b from-blue-500 to-transparent delay-400"></div>
          <div className="bg-gradient-to-b from-transparent to-cyan-500 delay-500"></div>
          <div className="bg-gradient-to-b from-blue-500 to-transparent delay-600"></div>
          <div className="bg-gradient-to-b from-transparent to-cyan-500 delay-700"></div>
        </div>
      </div>

      <div className="text-center z-10 reel-content">
        <div className="space-y-6">
          <h1 className="text-7xl md:text-9xl lg:text-[12rem] font-black tracking-tighter leading-none animate-slide-up">
            {t('hero.title')}
          </h1>
          <h2 className="text-7xl md:text-9xl lg:text-[12rem] font-black tracking-tighter leading-none text-gradient animate-slide-up delay-300">
            {t('hero.subtitle')}
          </h2>
          <p className="text-xl md:text-2xl font-light tracking-[4px] uppercase animate-fade-in delay-600">
            {t('hero.tagline')}
          </p>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white rounded-full mt-2 animate-scroll-dot"></div>
        </div>
      </div>
    </section>
  );
} 