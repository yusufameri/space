"use client";

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';
import { Sun as SunType } from '@/types/planets';
import { VISUALIZATION_SCALE } from '@/constants/solarSystemData';
import { Mesh, PointLight } from 'three';

interface SunProps {
  sun: SunType;
}

const Sun = ({ sun }: SunProps) => {
  const sunRef = useRef<Mesh>(null);
  const lightRef = useRef<PointLight>(null);
  
  // Slow rotation for the sun
  useFrame((_, delta) => {
    if (sunRef.current) {
      sunRef.current.rotation.y += 0.05 * delta;
    }
  });

  // Calculate sun size based on diameter and scale
  const calculatedSize = sun.diameter * VISUALIZATION_SCALE.SUN_SCALE;
  const sunSize = Math.max(calculatedSize, VISUALIZATION_SCALE.SUN_BASE_SIZE);
  
  return (
    <group>
      {/* Point light for the sun */}
      <pointLight 
        ref={lightRef} 
        position={[0, 0, 0]} 
        intensity={1.5} 
        color="#FFF8E7" 
        distance={100} 
        decay={0.5} 
      />
      
      {/* Sun mesh */}
      <Sphere ref={sunRef} args={[sunSize, 32, 32]} position={[0, 0, 0]}>
        <meshStandardMaterial
          color={sun.color}
          emissive={sun.color}
          emissiveIntensity={1}
          toneMapped={false}
        />
      </Sphere>
      
      {/* Glow effect */}
      <Sphere args={[sunSize * 1.2, 32, 32]} position={[0, 0, 0]}>
        <meshBasicMaterial
          color={sun.color}
          transparent
          opacity={0.15}
          toneMapped={false}
        />
      </Sphere>
      
      {/* Outer glow */}
      <Sphere args={[sunSize * 1.5, 32, 32]} position={[0, 0, 0]}>
        <meshBasicMaterial
          color={sun.color}
          transparent
          opacity={0.05}
          toneMapped={false}
        />
      </Sphere>
    </group>
  );
};

export default Sun; 