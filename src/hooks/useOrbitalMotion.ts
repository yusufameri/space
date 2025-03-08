"use client";

import { useFrame } from '@react-three/fiber';
import { useRef, useState, useEffect } from 'react';
import { VISUALIZATION_SCALE } from '@/constants/solarSystemData';
import { Object3D, Vector3 } from 'three';

interface UseOrbitalMotionProps {
  orbitalPeriod: number;
  rotationPeriod: number;
  distanceFromSun: number;
  paused?: boolean;
  timeScale?: number;
}

export const useOrbitalMotion = ({
  orbitalPeriod,
  rotationPeriod,
  distanceFromSun,
  paused = false,
  timeScale = 1,
}: UseOrbitalMotionProps) => {
  const objectRef = useRef<Object3D>(null);
  const [angle, setAngle] = useState(Math.random() * Math.PI * 2); // Random starting position
  const [currentPosition, setCurrentPosition] = useState<Vector3>(new Vector3());
  
  // Calculate orbital and rotation speeds
  const orbitalSpeed = (2 * Math.PI) / (orbitalPeriod * 20) * VISUALIZATION_SCALE.ORBITAL_SPEED_SCALE * timeScale;
  
  // Handle retrograde rotation (negative rotation period)
  const rotationDirection = rotationPeriod < 0 ? -1 : 1;
  const rotationSpeed = rotationPeriod !== 0 
    ? (2 * Math.PI) / (Math.abs(rotationPeriod) * 10) * rotationDirection * timeScale * VISUALIZATION_SCALE.ROTATION_SPEED_SCALE
    : 0;

  // Calculate orbital distance with scaling
  const distance = distanceFromSun * VISUALIZATION_SCALE.DISTANCE_SCALE;

  // Calculate initial position
  const initialX = Math.cos(angle) * distance;
  const initialZ = Math.sin(angle) * distance;
  const initialPosition = new Vector3(initialX, 0, initialZ);
  
  // Set initial current position
  useEffect(() => {
    setCurrentPosition(initialPosition.clone());
  }, []);

  useFrame((_, delta) => {
    if (paused || !objectRef.current) return;
    
    // Update orbital position using angle
    if (orbitalPeriod > 0) {
      // Update angle
      setAngle(prevAngle => prevAngle + orbitalSpeed * delta);
      
      // Calculate new position based on angle
      const x = Math.cos(angle) * distance;
      const z = Math.sin(angle) * distance;
      
      // Create a new Vector3 for the current position
      const newPosition = new Vector3(x, 0, z);
      setCurrentPosition(newPosition);
      
      // Update position
      objectRef.current.position.x = x;
      objectRef.current.position.z = z;
    }
    
    // Update rotation
    if (rotationPeriod !== 0) {
      objectRef.current.rotation.y += rotationSpeed * delta;
    }
  });

  return { objectRef, initialPosition, currentPosition };
};

export default useOrbitalMotion; 