import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface CounterItem {
  value: number;
  label: string;
  icon?: React.ReactNode;
  suffix?: string;
  prefix?: string;
  delay?: number;
}

interface CounterStatsProps {
  items: CounterItem[];
  title?: string;
  subtitle?: string;
  className?: string;
}

const CounterStats: React.FC<CounterStatsProps> = ({
  items,
  title,
  subtitle,
  className = '',
}) => {
  const [isInView, setIsInView] = useState(false);
  const [counters, setCounters] = useState<number[]>(items.map(() => 0));
  const ref = useRef<HTMLDivElement>(null);

  // Function to check if element is in viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  // Animation for counting up
  useEffect(() => {
    if (!isInView) return;

    const intervals = items.map((item, index) => {
      const delay = item.delay || 0;
      const duration = 2000; // 2 seconds animation
      const steps = 30; // Number of steps for the animation
      const stepValue = item.value / steps;
      let currentStep = 0;

      // Wait for the delay
      const timeout = setTimeout(() => {
        const interval = setInterval(() => {
          if (currentStep < steps) {
            setCounters(prev => {
              const newCounters = [...prev];
              newCounters[index] = Math.min(
                Math.round(stepValue * currentStep),
                item.value
              );
              return newCounters;
            });
            currentStep++;
          } else {
            setCounters(prev => {
              const newCounters = [...prev];
              newCounters[index] = item.value;
              return newCounters;
            });
            clearInterval(interval);
          }
        }, duration / steps);
        
        return interval;
      }, delay);

      return { timeout, interval: null };
    });

    return () => {
      intervals.forEach(({ timeout }) => {
        clearTimeout(timeout);
      });
    };
  }, [isInView, items]);

  return (
    <div className={`py-16 md:py-24 ${className}`} ref={ref}>
      <div className="container mx-auto px-4">
        {(title || subtitle) && (
          <div className="text-center mb-16">
            {title && (
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6 }}
                className="text-3xl md:text-4xl font-bold text-white mb-4 font-rajdhani"
              >
                {title}
              </motion.h2>
            )}
            {subtitle && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-gray-400 max-w-2xl mx-auto"
              >
                {subtitle}
              </motion.p>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {items.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{
                duration: 0.6,
                delay: 0.1 * index + 0.3,
                ease: "easeOut",
              }}
              className="bg-darkGray/40 border border-primary/10 rounded-lg p-6 text-center hover:shadow-[0_0_15px_rgba(139,92,246,0.2)] transition-all duration-300"
            >
              {item.icon && (
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                    {item.icon}
                  </div>
                </div>
              )}
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-2">
                {item.prefix && <span>{item.prefix}</span>}
                {counters[index].toLocaleString()}
                {item.suffix && <span>{item.suffix}</span>}
              </h3>
              <p className="text-gray-400">{item.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CounterStats;