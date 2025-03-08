"use client";

import { motion } from 'framer-motion';

interface ControlsProps {
  isPaused: boolean;
  timeScale: number;
  onTogglePause: () => void;
  onTimeScaleChange: (scale: number) => void;
  onReset: () => void;
}

const Controls = ({
  isPaused,
  timeScale,
  onTogglePause,
  onTimeScaleChange,
  onReset,
}: ControlsProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="absolute top-4 left-4 right-4 md:left-auto md:right-4 md:w-auto flex flex-wrap md:flex-nowrap gap-2 bg-black/70 backdrop-blur-md rounded-lg p-3 text-white shadow-lg border border-white/10"
    >
      <button
        onClick={onTogglePause}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        aria-label={isPaused ? 'Play' : 'Pause'}
      >
        {isPaused ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="5 3 19 12 5 21 5 3"></polygon>
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="6" y="4" width="4" height="16"></rect>
            <rect x="14" y="4" width="4" height="16"></rect>
          </svg>
        )}
      </button>
      
      <div className="flex flex-col justify-center flex-1">
        <label htmlFor="timeScale" className="text-xs text-white/70 mb-1">
          Speed: {timeScale}x
        </label>
        <input
          id="timeScale"
          type="range"
          min="0.1"
          max="5"
          step="0.1"
          value={timeScale}
          onChange={(e) => onTimeScaleChange(parseFloat(e.target.value))}
          className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
        />
      </div>
      
      <button
        onClick={onReset}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        aria-label="Reset view"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
          <path d="M3 3v5h5"></path>
        </svg>
      </button>
    </motion.div>
  );
};

export default Controls; 