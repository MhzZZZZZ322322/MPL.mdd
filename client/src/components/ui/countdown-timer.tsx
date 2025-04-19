import React, { useState, useEffect, useRef } from 'react';

interface CountdownTimerProps {
  targetDate: string | Date;
  onComplete?: () => void;
  className?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({
  targetDate,
  onComplete,
  className = '',
}) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isComplete, setIsComplete] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const calculateTimeLeft = () => {
    // Convertim data țintă într-un obiect Date
    const targetTime = new Date(targetDate).getTime();
    // Obținem timpul curent
    const now = new Date().getTime();
    // Calculăm diferența în milisecunde
    const difference = targetTime - now;
    
    let newTimeLeft: TimeLeft = {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };

    if (difference > 0) {
      // Dacă data țintă este în viitor, calculăm timpul rămas
      newTimeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    } else if (!isComplete) {
      // Dacă cronometrul s-a terminat
      setIsComplete(true);
      if (onComplete) onComplete();
    }

    return newTimeLeft;
  };

  useEffect(() => {
    // Setăm timpul inițial imediat
    setTimeLeft(calculateTimeLeft());
    
    // Actualizăm timpul la fiecare secundă
    timerRef.current = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    // Curățăm intervalul când componenta este dezmontată
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [targetDate]); // Repornim cronometrul când targetDate se schimbă

  const formatNumber = (num: number): string => {
    return num < 10 ? `0${num}` : num.toString();
  };

  return (
    <div className={`flex flex-wrap justify-center gap-4 ${className}`}>
      <div className="flex flex-col items-center">
        <div className="flex justify-center items-center w-16 h-16 md:w-20 md:h-20 text-2xl md:text-3xl font-bold bg-darkGray/70 text-white rounded-lg shadow-glow-sm shadow-primary/20 backdrop-blur-sm">
          {formatNumber(timeLeft.days)}
        </div>
        <span className="text-xs md:text-sm text-gray-400 mt-2">Zile</span>
      </div>
      <div className="flex flex-col items-center">
        <div className="flex justify-center items-center w-16 h-16 md:w-20 md:h-20 text-2xl md:text-3xl font-bold bg-darkGray/70 text-white rounded-lg shadow-glow-sm shadow-primary/20 backdrop-blur-sm">
          {formatNumber(timeLeft.hours)}
        </div>
        <span className="text-xs md:text-sm text-gray-400 mt-2">Ore</span>
      </div>
      <div className="flex flex-col items-center">
        <div className="flex justify-center items-center w-16 h-16 md:w-20 md:h-20 text-2xl md:text-3xl font-bold bg-darkGray/70 text-white rounded-lg shadow-glow-sm shadow-primary/20 backdrop-blur-sm">
          {formatNumber(timeLeft.minutes)}
        </div>
        <span className="text-xs md:text-sm text-gray-400 mt-2">Minute</span>
      </div>
      <div className="flex flex-col items-center">
        <div className="flex justify-center items-center w-16 h-16 md:w-20 md:h-20 text-2xl md:text-3xl font-bold bg-darkGray/70 text-white rounded-lg shadow-glow-sm shadow-primary/20 backdrop-blur-sm">
          {formatNumber(timeLeft.seconds)}
        </div>
        <span className="text-xs md:text-sm text-gray-400 mt-2">Secunde</span>
      </div>
    </div>
  );
};

export default CountdownTimer;