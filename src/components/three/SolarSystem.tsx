"use client";

import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Suspense, useState, useCallback, useEffect, useRef } from 'react';
import { solarSystemData, VISUALIZATION_SCALE } from '@/constants/solarSystemData';
import Sun from './Sun';
import Planet from './Planet';
import OrbitLine from './OrbitLine';
import Stars from './Stars';
import Controls from '../ui/Controls';
import InfoPanel from '../ui/InfoPanel';
import PlanetNavigation from '../ui/PlanetNavigation';
import useThreeControls from '@/hooks/useThreeControls';
import { Planet as PlanetType } from '@/types/planets';
import { Vector3 } from 'three';

const SolarSystem = () => {
  const { 
    isPaused, 
    timeScale, 
    selectedPlanet, 
    isCameraFocused,
    togglePause, 
    setTimeScale, 
    selectPlanet,
    focusCamera,
    resetCamera,
    controlsRef
  } = useThreeControls();
  
  const [selectedPlanetData, setSelectedPlanetData] = useState<PlanetType | null>(null);
  const [selectedPlanetPosition, setSelectedPlanetPosition] = useState<Vector3 | null>(null);
  const [planetPositions, setPlanetPositions] = useState<Record<string, Vector3>>({});
  const focusUpdateTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const initialFocusRef = useRef<boolean>(false);
  const lastSelectedPlanetRef = useRef<string | null>(null);
  
  // Handle planet position updates for continuous tracking
  const handlePlanetPositionUpdate = useCallback((id: string, position: Vector3) => {
    // Store all planet positions
    setPlanetPositions(prev => ({
      ...prev,
      [id]: position.clone()
    }));
    
    // Handle selected planet tracking
    if (id === selectedPlanet) {
      setSelectedPlanetPosition(position.clone());
      
      // If this is the first position update after selection and we haven't focused yet,
      // focus immediately
      if (!initialFocusRef.current || lastSelectedPlanetRef.current !== selectedPlanet) {
        updateCameraFocus(position);
        initialFocusRef.current = true;
        lastSelectedPlanetRef.current = selectedPlanet;
        return;
      }
      
      // For continuous tracking, use debounce
      if (focusUpdateTimeoutRef.current) {
        clearTimeout(focusUpdateTimeoutRef.current);
      }
      
      focusUpdateTimeoutRef.current = setTimeout(() => {
        updateCameraFocus(position);
      }, 100); // Update every 100ms at most
    }
  }, [selectedPlanet]);
  
  // Function to update camera focus
  const updateCameraFocus = useCallback((planetPosition: Vector3) => {
    if (!selectedPlanetData) return;
    
    // Calculate planet size
    const size = Math.max(
      Math.min(
        selectedPlanetData.diameter * VISUALIZATION_SCALE.SIZE_SCALE,
        VISUALIZATION_SCALE.MAX_PLANET_SIZE
      ),
      VISUALIZATION_SCALE.MIN_PLANET_SIZE
    );
    
    // Position camera at a distance proportional to planet size
    const cameraDistance = size * 15;
    const cameraPosition = new Vector3(
      planetPosition.x - cameraDistance * 0.7, 
      cameraDistance * 0.5, 
      planetPosition.z + cameraDistance * 0.7
    );
    
    // Focus camera on the planet
    focusCamera(cameraPosition, planetPosition);
  }, [selectedPlanetData, focusCamera]);
  
  // Handle planet selection (from direct click or navigation menu)
  const handleSelectPlanet = useCallback((planetId: string, planetPosition?: Vector3) => {
    // If selecting the same planet again, do nothing
    if (planetId === selectedPlanet && initialFocusRef.current) {
      return;
    }
    
    // Reset the initial focus flag
    initialFocusRef.current = false;
    lastSelectedPlanetRef.current = null;
    
    // Update selected planet
    selectPlanet(planetId);
    
    const planet = solarSystemData.planets.find(p => p.id === planetId);
    if (!planet) return;
    
    setSelectedPlanetData(planet);
    
    // If we have a position (either from click or navigation menu), use it
    if (planetPosition) {
      // Calculate size for camera distance
      const size = Math.max(
        Math.min(
          planet.diameter * VISUALIZATION_SCALE.SIZE_SCALE,
          VISUALIZATION_SCALE.MAX_PLANET_SIZE
        ),
        VISUALIZATION_SCALE.MIN_PLANET_SIZE
      );
      
      // Position camera
      const cameraDistance = size * 15;
      const cameraPosition = new Vector3(
        planetPosition.x - cameraDistance * 0.7, 
        cameraDistance * 0.5, 
        planetPosition.z + cameraDistance * 0.7
      );
      
      // Focus immediately on the actual planet position
      focusCamera(cameraPosition, planetPosition);
      initialFocusRef.current = true;
      lastSelectedPlanetRef.current = planetId;
    } 
    // If we don't have a position yet, check if we have it in our tracked positions
    else if (planetPositions[planetId]) {
      const position = planetPositions[planetId];
      
      // Calculate size for camera distance
      const size = Math.max(
        Math.min(
          planet.diameter * VISUALIZATION_SCALE.SIZE_SCALE,
          VISUALIZATION_SCALE.MAX_PLANET_SIZE
        ),
        VISUALIZATION_SCALE.MIN_PLANET_SIZE
      );
      
      // Position camera
      const cameraDistance = size * 15;
      const cameraPosition = new Vector3(
        position.x - cameraDistance * 0.7, 
        cameraDistance * 0.5, 
        position.z + cameraDistance * 0.7
      );
      
      // Focus immediately on the actual planet position
      focusCamera(cameraPosition, position);
      initialFocusRef.current = true;
      lastSelectedPlanetRef.current = planetId;
    }
    // Otherwise, we'll wait for the first position update (handled in handlePlanetPositionUpdate)
  }, [selectPlanet, focusCamera, planetPositions, selectedPlanet]);
  
  // Update selected planet data when selection changes
  useEffect(() => {
    if (!selectedPlanet) {
      setSelectedPlanetData(null);
      setSelectedPlanetPosition(null);
      initialFocusRef.current = false;
      lastSelectedPlanetRef.current = null;
      
      if (focusUpdateTimeoutRef.current) {
        clearTimeout(focusUpdateTimeoutRef.current);
        focusUpdateTimeoutRef.current = null;
      }
    }
  }, [selectedPlanet]);
  
  // Clear selected planet
  const handleCloseInfo = useCallback(() => {
    selectPlanet(null);
  }, [selectPlanet]);
  
  // Reset view button handler
  const handleResetView = useCallback(() => {
    resetCamera();
    selectPlanet(null);
  }, [resetCamera, selectPlanet]);
  
  return (
    <div className="relative w-full h-screen bg-black">
      <Canvas shadows>
        <PerspectiveCamera 
          makeDefault 
          position={[0, 30, 50]} 
          fov={60}
        />
        
        <color attach="background" args={['#000']} />
        
        <ambientLight intensity={0.1} />
        
        <Suspense fallback={null}>
          {/* Stars background */}
          <Stars />
          
          {/* Sun */}
          <Sun sun={solarSystemData.sun} />
          
          {/* Orbit lines */}
          {solarSystemData.planets.map((planet) => (
            <OrbitLine 
              key={`orbit-${planet.id}`}
              distanceFromSun={planet.distanceFromSun}
              color={planet.color}
              opacity={0.3}
              lineWidth={1.0}
              planetId={planet.id}
              isSelected={selectedPlanet === planet.id}
              onSelectPlanet={handleSelectPlanet}
            />
          ))}
          
          {/* Planets */}
          {solarSystemData.planets.map((planet) => (
            <Planet
              key={planet.id}
              planet={planet}
              isSelected={selectedPlanet === planet.id}
              onSelect={handleSelectPlanet}
              paused={isPaused}
              timeScale={timeScale}
              onPositionUpdate={handlePlanetPositionUpdate}
            />
          ))}
        </Suspense>
        
        {/* Camera controls */}
        <OrbitControls 
          ref={controlsRef}
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={5}
          maxDistance={200}
          target={[0, 0, 0]}
          makeDefault
        />
      </Canvas>
      
      {/* Planet Navigation Menu */}
      <PlanetNavigation 
        planets={solarSystemData.planets}
        onSelectPlanet={handleSelectPlanet}
        selectedPlanet={selectedPlanet}
        planetPositions={planetPositions}
      />
      
      {/* UI Controls */}
      <Controls 
        isPaused={isPaused}
        timeScale={timeScale}
        onTogglePause={togglePause}
        onTimeScaleChange={setTimeScale}
        onReset={handleResetView}
      />
      
      {/* Planet Info Panel */}
      <InfoPanel 
        planet={selectedPlanetData}
        onClose={handleCloseInfo}
      />
      
      {/* Reset view button when focused on a planet */}
      {isCameraFocused && (
        <button
          onClick={handleResetView}
          className="absolute bottom-4 left-4 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full transition-colors"
          aria-label="Return to full solar system view"
        >
          Return to Solar System
        </button>
      )}
    </div>
  );
};

export default SolarSystem; 