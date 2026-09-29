import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { TICKER_HEADLINES } from '../data/newsData';

interface TickerBarProps {
  onSelectHeadline?: (text: string) => void;
}

export const TickerBar: React.FC<TickerBarProps> = ({ onSelectHeadline }) => {
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % TICKER_HEADLINES.length);
        setFade(true);
      }, 250);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handlePrev = () => {
    setFade(false);
    setTimeout(() => {
      setIndex((prev) => (prev - 1 + TICKER_HEADLINES.length) % TICKER_HEADLINES.length);
      setFade(true);
    }, 200);
  };

  const handleNext = () => {
    setFade(false);
    setTimeout(() => {
      setIndex((prev) => (prev + 1) % TICKER_HEADLINES.length);
      setFade(true);
    }, 200);
  };

  return (
    <section className="w-full bg-emerald-50/70 dark:bg-slate-900 border-b border-emerald-100/80 dark:border-slate-800 py-1.5 sm:py-2 px-3 sm:px-6 lg:px-12 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0 overflow-hidden">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-emerald-600 dark:bg-emerald-600 text-white text-[10px] sm:text-[11px] font-bold tracking-wide uppercase whitespace-nowrap shrink-0 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
            <span className="sm:hidden">Avisos</span>
            <span className="hidden sm:inline">Últimas Notícias</span>
          </span>

          <div className="relative overflow-hidden flex-1 min-w-0 h-6 flex items-center">
            <p
              onClick={() => onSelectHeadline && onSelectHeadline(TICKER_HEADLINES[index])}
              className={`text-xs font-semibold text-slate-800 dark:text-slate-200 hover:text-emerald-700 dark:hover:text-emerald-400 truncate cursor-pointer transition-all duration-300 ${
                fade ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
            >
              {TICKER_HEADLINES[index]}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={handlePrev}
            aria-label="Notícia anterior"
            className="w-6 h-6 rounded-full bg-white dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400 shadow-xs transition-colors cursor-pointer border border-slate-200/80 dark:border-slate-700"
            type="button"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleNext}
            aria-label="Próxima notícia"
            className="w-6 h-6 rounded-full bg-white dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400 shadow-xs transition-colors cursor-pointer border border-slate-200/80 dark:border-slate-700"
            type="button"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
};
