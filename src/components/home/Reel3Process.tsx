import { useTranslations } from '../../i18n/config';

interface Reel3ProcessProps {
  lang?: string;
}

export default function Reel3Process({ lang = 'pl' }: Reel3ProcessProps) {
  const t = useTranslations(lang);

  return (
    <section className="reel reel-3 h-screen w-full bg-gradient-to-br from-blue-600 via-purple-700 to-black text-white flex items-center justify-center relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-white rounded-full animate-float"></div>
        <div className="absolute top-3/4 right-1/4 w-2 h-2 bg-cyan-400 rounded-full animate-float delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-3 h-3 bg-white rounded-full animate-float delay-2000"></div>
        <div className="absolute top-1/2 right-1/3 w-2 h-2 bg-blue-300 rounded-full animate-float delay-3000"></div>
      </div>

      <div className="text-center z-10 reel-content max-w-4xl mx-auto px-6">
        <h3 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter animate-slide-up">
          {t('process.title')}
        </h3>
        
        <div className="space-y-8 animate-fade-in delay-500">
          <div className="text-2xl md:text-4xl font-bold tracking-wider">
            {t('process.steps')}
          </div>
          <div className="text-lg md:text-xl font-light tracking-[3px] uppercase">
            {t('process.timeline')}
          </div>
          
          {/* Progress Bar Animation */}
          <div className="w-full max-w-2xl mx-auto mt-12">
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full animate-progress"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 