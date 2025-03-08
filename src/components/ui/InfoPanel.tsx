"use client";

import { Planet } from '@/types/planets';
import { motion } from 'framer-motion';

interface InfoPanelProps {
  planet: Planet | null;
  onClose: () => void;
}

const InfoPanel = ({ planet, onClose }: InfoPanelProps) => {
  if (!planet) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 bg-black/80 backdrop-blur-md rounded-lg p-4 text-white shadow-lg border border-white/10"
    >
      <div className="flex justify-between items-start mb-2">
        <h2 className="text-xl font-bold">{planet.name}</h2>
        <button 
          onClick={onClose}
          className="text-white/70 hover:text-white transition-colors"
          aria-label="Close information panel"
        >
          ✕
        </button>
      </div>
      
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-white/70">Type:</span>
          <span className="font-medium capitalize">{planet.type.replace('-', ' ')}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-white/70">Diameter:</span>
          <span className="font-medium">{planet.diameter.toLocaleString()} km</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-white/70">Distance from Sun:</span>
          <span className="font-medium">{planet.distanceFromSun.toLocaleString()} million km</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-white/70">Orbital Period:</span>
          <span className="font-medium">{planet.orbitalPeriod.toLocaleString()} Earth days</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-white/70">Rotation Period:</span>
          <span className="font-medium">{Math.abs(planet.rotationPeriod).toLocaleString()} Earth days {planet.rotationPeriod < 0 ? '(retrograde)' : ''}</span>
        </div>
      </div>
      
      <div className="mt-4 pt-3 border-t border-white/10">
        <h3 className="text-sm font-medium mb-1">Fun Fact:</h3>
        <p className="text-sm text-white/90">{planet.funFact}</p>
      </div>
    </motion.div>
  );
};

export default InfoPanel; 