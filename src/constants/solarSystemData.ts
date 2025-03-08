import { SolarSystemData } from '@/types/planets';

// Note: For visualization purposes, we're not using exact scale
// as the differences would be too extreme to display effectively
export const solarSystemData: SolarSystemData = {
  sun: {
    id: 'sun',
    name: 'Sun',
    diameter: 1392700, // km
    distanceFromSun: 0,
    orbitalPeriod: 0,
    rotationPeriod: 27, // at equator
    color: '#FDB813',
    type: 'star',
  },
  planets: [
    {
      id: 'mercury',
      name: 'Mercury',
      diameter: 4879,
      distanceFromSun: 57.9,
      orbitalPeriod: 88,
      rotationPeriod: 58.6,
      color: '#A9A9A9',
      type: 'rocky',
      funFact: 'Mercury has wrinkles! As the core of the planet cooled and contracted, the surface wrinkled, creating lobe-shaped scarps or cliffs.',
    },
    {
      id: 'venus',
      name: 'Venus',
      diameter: 12104,
      distanceFromSun: 108.2,
      orbitalPeriod: 224.7,
      rotationPeriod: -243, // negative indicates retrograde rotation
      color: '#E6E6FA',
      type: 'rocky',
      funFact: 'Venus rotates in the opposite direction to most planets, meaning the Sun rises in the west and sets in the east.',
    },
    {
      id: 'earth',
      name: 'Earth',
      diameter: 12756,
      distanceFromSun: 149.6,
      orbitalPeriod: 365.2,
      rotationPeriod: 1,
      color: '#6B93D6',
      type: 'rocky',
      funFact: 'Earth is the only planet not named after a god or goddess from Greek or Roman mythology.',
    },
    {
      id: 'mars',
      name: 'Mars',
      diameter: 6792,
      distanceFromSun: 227.9,
      orbitalPeriod: 687,
      rotationPeriod: 1.03,
      color: '#E27B58',
      type: 'rocky',
      funFact: 'Mars has the largest dust storms in our solar system, sometimes covering the entire planet and lasting for months.',
    },
    {
      id: 'jupiter',
      name: 'Jupiter',
      diameter: 142984,
      distanceFromSun: 778.6,
      orbitalPeriod: 4331,
      rotationPeriod: 0.41, // less than 10 hours!
      color: '#C88B3A',
      type: 'gas-giant',
      funFact: 'Jupiter\'s Great Red Spot is a storm that has been raging for at least 400 years and is big enough to fit three Earths inside.',
    },
    {
      id: 'saturn',
      name: 'Saturn',
      diameter: 120536,
      distanceFromSun: 1433.5,
      orbitalPeriod: 10747,
      rotationPeriod: 0.45,
      color: '#E3E0C0',
      type: 'gas-giant',
      funFact: 'Saturn\'s rings are made mostly of ice chunks, with some rocky debris and dust. Some pieces are as small as grains of sand, while others are as big as mountains.',
    },
    {
      id: 'uranus',
      name: 'Uranus',
      diameter: 51118,
      distanceFromSun: 2872.5,
      orbitalPeriod: 30589,
      rotationPeriod: -0.72, // negative indicates retrograde rotation
      color: '#D1E7E7',
      type: 'ice-giant',
      funFact: 'Uranus rotates on its side, with its axis pointing nearly 90 degrees away from the "up-down" axis of other planets.',
    },
    {
      id: 'neptune',
      name: 'Neptune',
      diameter: 49528,
      distanceFromSun: 4495.1,
      orbitalPeriod: 59800,
      rotationPeriod: 0.67,
      color: '#5B5DDF',
      type: 'ice-giant',
      funFact: 'Neptune has the strongest winds in the solar system, reaching up to 2,100 kilometers per hour (1,300 mph).',
    },
  ],
};

// For visualization purposes, we'll use these scale factors
export const VISUALIZATION_SCALE = {
  // Scale down the size differences to make visualization possible
  // but maintain relative proportions between planets
  SIZE_SCALE: 0.00002, // Scale planet sizes
  
  // Scale for the sun (smaller than actual scale to make it viewable)
  SUN_SCALE: 0.000005,
  
  // Scale orbital distances
  DISTANCE_SCALE: 0.3,
  
  // Adjust orbital speeds for better visualization (faster than reality)
  ORBITAL_SPEED_SCALE: 0.5,
  
  // Adjust rotation speeds for better visualization (faster than reality)
  ROTATION_SPEED_SCALE: 5,
  
  // Base size for the sun in our visualization
  SUN_BASE_SIZE: 5,
  
  // Minimum size for planets to ensure visibility
  MIN_PLANET_SIZE: 0.5,
  
  // Maximum size for planets to avoid them being too large
  MAX_PLANET_SIZE: 4,
  
  // Minimum distance between planets for better visualization
  MIN_DISTANCE: 5,
}; 