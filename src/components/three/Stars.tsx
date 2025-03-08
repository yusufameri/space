"use client";

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Stars as DreiStars } from '@react-three/drei';
import { Group } from 'three';

interface StarsProps {
  count?: number;
  depth?: number;
  factor?: number;
  saturation?: number;
  fade?: boolean;
}

const Stars = ({
  count = 5000,
  depth = 50,
  factor = 4,
  saturation = 0.5,
  fade = true,
}: StarsProps) => {
  const starsRef = useRef<Group>(null);
  
  // Very slow rotation for the stars to create subtle movement
  useFrame((_, delta) => {
    if (starsRef.current) {
      starsRef.current.rotation.y += 0.0005 * delta;
      starsRef.current.rotation.x += 0.0002 * delta;
    }
  });
  
  return (
    <group ref={starsRef}>
      <DreiStars
        radius={depth}
        depth={depth}
        count={count}
        factor={factor}
        saturation={saturation}
        fade={fade}
      />
    </group>
  );
};

export default Stars; 