import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface AnimationOptions {
  trigger?: string | Element;
  start?: string;
  end?: string;
  scrub?: boolean | number;
  markers?: boolean;
  toggleActions?: string;
  duration?: number;
  delay?: number;
  ease?: string;
}

export function useGsapAnimation<T extends Element>(
  animation: (element: T, gsapInstance: typeof gsap) => gsap.core.Timeline | gsap.core.Tween,
  options: AnimationOptions = {},
  dependencies: any[] = []
) {
  const elementRef = useRef<T>(null);
  
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;
    
    // Create animation
    const tween = animation(element, gsap);
    
    // Add ScrollTrigger if trigger is provided
    if (options.trigger) {
      const scrollTriggerOptions = {
        trigger: options.trigger || element,
        start: options.start || 'top bottom',
        end: options.end || 'bottom top',
        scrub: options.scrub || false,
        markers: options.markers || false,
        toggleActions: options.toggleActions || 'play none none none',
      };
      
      // Apply ScrollTrigger to the animation
      ScrollTrigger.create({
        ...scrollTriggerOptions,
        animation: tween,
      });
    }
    
    return () => {
      // Clean up animation
      tween.kill();
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.animation === tween) {
          trigger.kill();
        }
      });
    };
  }, [animation, ...dependencies]);
  
  return elementRef;
} 