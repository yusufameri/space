"use client";

import { useMemo, useState, useCallback } from 'react';
import { Line, Tube } from '@react-three/drei';
import { VISUALIZATION_SCALE } from '@/constants/solarSystemData';
import { Vector3, TubeGeometry, CatmullRomCurve3 } from 'three';

interface OrbitLineProps {
  distanceFromSun: number;
  color?: string;
  opacity?: number;
  lineWidth?: number;
  planetId: string;
  isSelected: boolean;
  onSelectPlanet: (id: string, position?: Vector3) => void;
}

const OrbitLine = ({
  distanceFromSun,
  color = '#ffffff',
  opacity = 0.3,
  lineWidth = 1.0, // Increased default line width
  planetId,
  isSelected,
  onSelectPlanet,
}: OrbitLineProps) => {
  const [hovered, setHovered] = useState(false);
  
  // Calculate orbital radius
  const radius = distanceFromSun * VISUALIZATION_SCALE.DISTANCE_SCALE;
  
  // Generate points for a circle
  const points = useMemo(() => {
    const segments = 64;
    const points: [number, number, number][] = [];
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      const x = Math.cos(theta) * radius;
      const z = Math.sin(theta) * radius;
      points.push([x, 0, z]);
    }
    return points;
  }, [radius]);
  
  // Generate points for a 3D curve (for the Tube)
  const curve = useMemo(() => {
    const segments = 64;
    const points = [];
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      const x = Math.cos(theta) * radius;
      const z = Math.sin(theta) * radius;
      points.push(new Vector3(x, 0, z));
    }
    // Close the loop
    const firstPoint = points[0].clone();
    points.push(firstPoint);
    
    return new CatmullRomCurve3(points);
  }, [radius]);
  
  // Handle click on orbit line
  const handleClick = useCallback(() => {
    // Calculate a random position on the orbit to focus on
    const randomAngle = Math.random() * Math.PI * 2;
    const x = Math.cos(randomAngle) * radius;
    const z = Math.sin(randomAngle) * radius;
    const position = new Vector3(x, 0, z);
    
    // Select the planet
    onSelectPlanet(planetId, position);
  }, [radius, planetId, onSelectPlanet]);
  
  // Determine line width based on hover and selection state
  const currentLineWidth = isSelected 
    ? 2.0 
    : hovered 
      ? 1.5 
      : lineWidth;
  
  // Determine opacity based on hover and selection state
  const currentOpacity = isSelected 
    ? 0.8 
    : hovered 
      ? 0.6 
      : opacity;
  
  // Width of the invisible interactive tube
  const interactionWidth = 0.5; // Wide enough for easy interaction

  return (
    <group>
      {/* Visible orbit line */}
      <Line
        points={points}
        color={color}
        lineWidth={currentLineWidth}
        transparent
        opacity={currentOpacity}
      />
      
      {/* Invisible wider tube for better interaction */}
      <Tube
        args={[curve, 64, interactionWidth, 8, false]}
        onClick={handleClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </Tube>
    </group>
  );
};

export default OrbitLine; 