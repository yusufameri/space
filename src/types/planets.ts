export interface CelestialBody {
  id: string;
  name: string;
  diameter: number; // km
  distanceFromSun: number; // million km
  orbitalPeriod: number; // Earth days
  rotationPeriod: number; // Earth days
  color: string;
  texture?: string;
}

export interface Planet extends CelestialBody {
  type: 'rocky' | 'gas-giant' | 'ice-giant';
  funFact: string;
}

export interface Sun extends CelestialBody {
  type: 'star';
}

export interface SolarSystemData {
  sun: Sun;
  planets: Planet[];
} 