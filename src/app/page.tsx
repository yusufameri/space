"use client";

import dynamic from 'next/dynamic';

// Dynamically import the SolarSystem component with SSR disabled
// This is necessary because Three.js requires the window object
const SolarSystem = dynamic(
  () => import('@/components/three/SolarSystem'),
  { ssr: false }
);

export default function Home() {
  return (
    <main className="min-h-screen">
      <SolarSystem />
    </main>
  );
}
