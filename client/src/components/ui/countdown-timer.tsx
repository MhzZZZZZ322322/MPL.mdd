import React, { useState, useEffect } from 'react';

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

  const calculateTimeLeft = () => {
    const difference = +new Date(targetDate) - +new Date();
    let newTimeLeft: TimeLeft = {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };

    if (difference > 0) {
      newTimeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    } else if (!isComplete) {
      setIsComplete(true);
      onComplete && onComplete();
    }

    return newTimeLeft;
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const formatNumber = (num: number): string => {
    return num < 10 ? `0${num}` : num.toString();
  };

  return (
    <div className={`flex space-x-4 ${className}`}>
      <div className="flex flex-col items-center">
        <div className="flex justify-center items-center w-16 h-16 md:w-20 md:h-20 text-2xl md:text-3xl font-bold bg-darkGray/70 text-white rounded-lg shadow-glow-sm shadow-primary/20">
          {formatNumber(timeLeft.days)}
        </div>
        <span className="text-xs md:text-sm text-gray-400 mt-2">Zile</span>
      </div>
      <div className="flex flex-col items-center">
        <div className="flex justify-center items-center w-16 h-16 md:w-20 md:h-20 text-2xl md:text-3xl font-bold bg-darkGray/70 text-white rounded-lg shadow-glow-sm shadow-primary/20">
          {formatNumber(timeLeft.hours)}
        </div>
        <span className="text-xs md:text-sm text-gray-400 mt-2">Ore</span>
      </div>
      <div className="flex flex-col items-center">
        <div className="flex justify-center items-center w-16 h-16 md:w-20 md:h-20 text-2xl md:text-3xl font-bold bg-darkGray/70 text-white rounded-lg shadow-glow-sm shadow-primary/20">
          {formatNumber(timeLeft.minutes)}
        </div>
        <span className="text-xs md:text-sm text-gray-400 mt-2">Minute</span>
      </div>
      <div className="flex flex-col items-center">
        <div className="flex justify-center items-center w-16 h-16 md:w-20 md:h-20 text-2xl md:text-3xl font-bold bg-darkGray/70 text-white rounded-lg shadow-glow-sm shadow-primary/20">
          {formatNumber(timeLeft.seconds)}
        </div>
        <span className="text-xs md:text-sm text-gray-400 mt-2">Secunde</span>
      </div>
    </div>
  );
};

export default CountdownTimer;