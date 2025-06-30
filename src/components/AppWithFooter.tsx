import { useState, useEffect } from 'react';
import HomeContainer from './home/HomeContainer.tsx';
import Footer from './shared/Footer.tsx';

interface AppWithFooterProps {
  lang?: string;
}

export default function AppWithFooter({ lang = 'pl' }: AppWithFooterProps) {
  const [showFooter, setShowFooter] = useState(false);

  useEffect(() => {
    // Listen for footer visibility from HomeContainer
    const handleFooterVisibility = () => {
      const footerVisible = (window as any).shouldShowFooter || false;
      setShowFooter(footerVisible);
    };

    const interval = setInterval(handleFooterVisibility, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <main className="reels-container">
        <HomeContainer lang={lang} />
      </main>
      {showFooter && (
        <div className="w-full">
          <Footer lang={lang} />
        </div>
      )}
    </>
  );
} 