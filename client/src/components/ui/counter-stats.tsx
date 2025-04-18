import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface CounterProps {
  endValue: number;
  duration?: number; // în milisecunde
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
}

export const Counter: React.FC<CounterProps> = ({ 
  endValue, 
  duration = 2000, 
  prefix = '', 
  suffix = '', 
  decimals = 0,
  className = ''
}) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const counterRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let startTime: number;
          const startValue = 0;
          
          const step = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            const easedProgress = easeOutQuart(progress);
            setCount(startValue + easedProgress * (endValue - startValue));
            
            if (progress < 1) {
              window.requestAnimationFrame(step);
            }
          };
          
          window.requestAnimationFrame(step);
        }
      },
      { threshold: 0.2 }
    );
    
    if (counterRef.current) {
      observer.observe(counterRef.current);
    }
    
    return () => {
      if (counterRef.current) {
        observer.unobserve(counterRef.current);
      }
    };
    
  }, [endValue, duration, hasAnimated]);
  
  // easing function pentru animație mai naturală
  const easeOutQuart = (x: number): number => {
    return 1 - Math.pow(1 - x, 4);
  };
  
  // formatare număr cu virgulă și decimale
  const formattedCount = count.toLocaleString('ro-RO', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  
  return (
    <div ref={counterRef} className={cn("transition-all", className)}>
      {prefix}{formattedCount}{suffix}
    </div>
  );
};

interface StatItemProps {
  value: number;
  label: string;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  icon?: React.ReactNode;
  className?: string;
}

export const StatItem = ({ 
  value, 
  label, 
  prefix, 
  suffix, 
  decimals = 0,
  icon,
  className = '' 
}: StatItemProps) => {
  return (
    <div className={cn("flex flex-col items-center justify-center p-6", className)}>
      {icon && <div className="mb-4 text-primary">{icon}</div>}
      <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2">
        <Counter endValue={value} prefix={prefix} suffix={suffix} decimals={decimals} />
      </div>
      <div className="text-sm text-gray-400 uppercase tracking-wide text-center">{label}</div>
    </div>
  );
};

export default Counter;