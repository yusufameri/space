"use client";

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Planet } from '@/types/planets';
import { Vector3 } from 'three';

interface PlanetNavigationProps {
  planets: Planet[];
  onSelectPlanet: (id: string, position?: Vector3) => void;
  selectedPlanet: string | null;
  planetPositions?: Record<string, Vector3>;
}

const PlanetNavigation = ({ 
  planets, 
  onSelectPlanet, 
  selectedPlanet,
  planetPositions = {}
}: PlanetNavigationProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Track which planets have positions for visual indicator
  const [trackedPlanets, setTrackedPlanets] = useState<Record<string, boolean>>({});
  
  // Update tracked planets when positions change
  useEffect(() => {
    const tracked: Record<string, boolean> = {};
    Object.keys(planetPositions).forEach(id => {
      tracked[id] = true;
    });
    setTrackedPlanets(tracked);
  }, [planetPositions]);

  const toggleMenu = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);
  
  const handlePlanetSelect = useCallback((planetId: string) => {
    // Get the current position directly from the planetPositions
    const position = planetPositions[planetId];
    
    // Close the menu first
    setIsOpen(false);
    
    // Use requestAnimationFrame to ensure the menu close animation completes
    // before focusing the camera, preventing potential UI jank
    requestAnimationFrame(() => {
      // Call the parent's onSelectPlanet with the planet ID and position
      onSelectPlanet(planetId, position);
    });
  }, [onSelectPlanet, planetPositions]);

  return (
    <div className="absolute left-4 top-20 z-10">
      <button
        onClick={toggleMenu}
        className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full transition-colors flex items-center gap-2"
        aria-label={isOpen ? "Close planet navigation" : "Open planet navigation"}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <circle cx="12" cy="12" r="4"></circle>
          <line x1="21.17" y1="8" x2="12" y2="8"></line>
          <line x1="3.95" y1="6.06" x2="8.54" y2="14"></line>
          <line x1="10.88" y1="21.94" x2="15.46" y2="14"></line>
        </svg>
        Planets
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-2 bg-black/80 backdrop-blur-md rounded-lg overflow-hidden shadow-lg border border-white/10"
          >
            <ul className="py-2">
              {planets.map((planet) => (
                <li key={planet.id}>
                  <button
                    onClick={() => handlePlanetSelect(planet.id)}
                    className={`w-full text-left px-4 py-2 flex items-center gap-3 hover:bg-white/10 transition-colors ${
                      selectedPlanet === planet.id ? 'bg-white/10' : ''
                    }`}
                  >
                    <span 
                      className="block w-3 h-3 rounded-full" 
                      style={{ backgroundColor: planet.color }}
                    ></span>
                    <span>{planet.name}</span>
                    {trackedPlanets[planet.id] && (
                      <span className="ml-auto text-xs text-white/50">●</span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PlanetNavigation; 