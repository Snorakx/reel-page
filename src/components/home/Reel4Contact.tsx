import { useTranslations } from '../../i18n/config';

interface Reel4ContactProps {
  lang?: string;
}

export default function Reel4Contact({ lang = 'pl' }: Reel4ContactProps) {
  const t = useTranslations(lang);

  return (
    <section className="reel reel-4 h-[100dvh] w-full bg-black text-white flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-black via-gray-900 to-black"></div>
      
      <div className="text-center z-10 reel-content">
        <h3 className="text-6xl md:text-8xl lg:text-9xl font-black mb-12 tracking-tighter animate-slide-up">
          {t('contact.title')}
        </h3>
        
        <div className="space-y-8 animate-fade-in delay-300">
          <p className="text-2xl md:text-3xl font-light tracking-[2px]">
            {t('contact.question')}
          </p>
          
          <a 
            href="mailto:kontakt@coderno.pl" 
            className="inline-block text-3xl md:text-5xl font-black tracking-tight hover:text-cyan-400 transition-all duration-500 hover:scale-105 animate-pulse-glow"
          >
            {t('contact.email')}
          </a>
          
          
          <div className="text-sm font-light tracking-[3px] uppercase text-gray-400">
            {t('contact.response_time')}
          </div>
        </div>
      </div>
    </section>
  );
} 