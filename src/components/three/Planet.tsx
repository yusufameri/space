"use client";

import { Sphere, Text } from '@react-three/drei';
import { Planet as PlanetType } from '@/types/planets';
import { VISUALIZATION_SCALE } from '@/constants/solarSystemData';
import useOrbitalMotion from '@/hooks/useOrbitalMotion';
import { useState, useEffect } from 'react';
import { Color, Vector3 } from 'three';
import { useFrame } from '@react-three/fiber';

interface PlanetProps {
  planet: PlanetType;
  isSelected: boolean;
  onSelect: (id: string, position: Vector3) => void;
  paused: boolean;
  timeScale: number;
  onPositionUpdate?: (id: string, position: Vector3) => void;
}

const Planet = ({ 
  planet, 
  isSelected, 
  onSelect, 
  paused, 
  timeScale,
  onPositionUpdate 
}: PlanetProps) => {
  const [hovered, setHovered] = useState(false);
  
  // Calculate planet size based on diameter, with min/max constraints
  // This maintains the relative sizes between planets
  const size = Math.max(
    Math.min(
      planet.diameter * VISUALIZATION_SCALE.SIZE_SCALE,
      VISUALIZATION_SCALE.MAX_PLANET_SIZE
    ),
    VISUALIZATION_SCALE.MIN_PLANET_SIZE
  );
  
  // Use our custom hook for orbital motion
  const { objectRef, initialPosition, currentPosition } = useOrbitalMotion({
    orbitalPeriod: planet.orbitalPeriod,
    rotationPeriod: planet.rotationPeriod,
    distanceFromSun: planet.distanceFromSun,
    paused,
    timeScale,
  });
  
  // Update parent component with current position on every frame
  useFrame(() => {
    if (objectRef.current && (isSelected || hovered)) {
      const worldPosition = new Vector3();
      objectRef.current.getWorldPosition(worldPosition);
      
      if (onPositionUpdate) {
        onPositionUpdate(planet.id, worldPosition);
      }
    }
  });
  
  // Highlight color for selection/hover
  const highlightColor = new Color(planet.color).multiplyScalar(1.5);
  
  // Handle click with current position
  const handleClick = () => {
    if (objectRef.current) {
      const worldPosition = new Vector3();
      objectRef.current.getWorldPosition(worldPosition);
      onSelect(planet.id, worldPosition);
    }
  };
  
  return (
    <group ref={objectRef} position={initialPosition}>
      {/* Planet sphere */}
      <Sphere 
        args={[size, 32, 32]} 
        onClick={handleClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <meshStandardMaterial 
          color={isSelected || hovered ? highlightColor : planet.color} 
          roughness={0.7}
          metalness={0.3}
        />
      </Sphere>
      
      {/* Planet label */}
      <Text
        position={[0, size + 0.5, 0]}
        fontSize={0.5}
        color="white"
        anchorX="center"
        anchorY="bottom"
        visible={isSelected || hovered}
      >
        {planet.name}
      </Text>
    </group>
  );
};

export default Planet; 