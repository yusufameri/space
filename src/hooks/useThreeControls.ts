"use client";

import { useState, useCallback, useRef } from 'react';
import { Vector3 } from 'three';
import { OrbitControls } from '@react-three/drei';

interface ThreeControls {
  isPaused: boolean;
  timeScale: number;
  selectedPlanet: string | null;
  isCameraFocused: boolean;
  togglePause: () => void;
  setTimeScale: (scale: number) => void;
  selectPlanet: (planetId: string | null) => void;
  focusCamera: (position: Vector3, targetPosition: Vector3) => void;
  resetCamera: () => void;
  controlsRef: React.RefObject<any>;
}

export const useThreeControls = (): ThreeControls => {
  const [isPaused, setIsPaused] = useState(false);
  const [timeScale, setTimeScale] = useState(1);
  const [selectedPlanet, setSelectedPlanet] = useState<string | null>(null);
  const [isCameraFocused, setIsCameraFocused] = useState(false);
  const controlsRef = useRef<any>(null);
  
  const togglePause = useCallback(() => {
    setIsPaused(prev => !prev);
  }, []);

  const selectPlanet = useCallback((planetId: string | null) => {
    setSelectedPlanet(planetId);
    if (!planetId) {
      // Reset camera when deselecting a planet
      resetCamera();
    }
  }, []);
  
  const focusCamera = useCallback((position: Vector3, targetPosition: Vector3) => {
    if (controlsRef.current) {
      setIsCameraFocused(true);
      
      // Store the current camera position for animation
      const currentPosition = controlsRef.current.object.position.clone();
      const currentTarget = controlsRef.current.target.clone();
      
      // Animate to the new position
      const duration = 1000; // 1 second
      const startTime = Date.now();
      
      const animate = () => {
        const elapsedTime = Date.now() - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        
        // Ease in-out function
        const easeProgress = progress < 0.5
          ? 2 * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 2) / 2;
        
        // Interpolate position
        controlsRef.current!.object.position.lerpVectors(
          currentPosition,
          position,
          easeProgress
        );
        
        // Interpolate target
        controlsRef.current!.target.lerpVectors(
          currentTarget,
          targetPosition,
          easeProgress
        );
        
        controlsRef.current!.update();
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      
      animate();
    }
  }, []);
  
  const resetCamera = useCallback(() => {
    if (controlsRef.current) {
      setIsCameraFocused(false);
      
      // Store the current camera position for animation
      const currentPosition = controlsRef.current.object.position.clone();
      const currentTarget = controlsRef.current.target.clone();
      
      // Default camera position and target
      const defaultPosition = new Vector3(0, 30, 50);
      const defaultTarget = new Vector3(0, 0, 0);
      
      // Animate to the default position
      const duration = 1000; // 1 second
      const startTime = Date.now();
      
      const animate = () => {
        const elapsedTime = Date.now() - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        
        // Ease in-out function
        const easeProgress = progress < 0.5
          ? 2 * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 2) / 2;
        
        // Interpolate position
        controlsRef.current!.object.position.lerpVectors(
          currentPosition,
          defaultPosition,
          easeProgress
        );
        
        // Interpolate target
        controlsRef.current!.target.lerpVectors(
          currentTarget,
          defaultTarget,
          easeProgress
        );
        
        controlsRef.current!.update();
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      
      animate();
    }
  }, []);

  return {
    isPaused,
    timeScale,
    selectedPlanet,
    isCameraFocused,
    togglePause,
    setTimeScale,
    selectPlanet,
    focusCamera,
    resetCamera,
    controlsRef,
  };
};

export default useThreeControls; 