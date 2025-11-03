import type { Ship, Org } from '../../types/gameState';

// Define the props the component needs
interface ShipIconProps {
  ship: Ship;
  position: { x: number; y: number };
  org: Org;
  isSelected: boolean;
  onClick: () => void;
}

export function ShipIcon({ ship, position, org, isSelected, onClick }: ShipIconProps) {
  const { x, y } = position;
  
  const sizeX = 8;  
  const sizeY = 12; 

  // The `points` attribute for a polygon is a list of x,y coordinates.
  // We'll define the four points of our diamond shape.
  const points = `
    ${x}, ${y - sizeY}  
    ${x + sizeX}, ${y}   
    ${x}, ${y + sizeY}  
    ${x - sizeX}, ${y}   
  `;


  return (
    <g 
      onClick={onClick}
      style={{ cursor: 'pointer' }}
    >
      <polygon
        points={points}
        fill={org.color}
        stroke={isSelected ? 'white' : '#ccc'}
        strokeWidth={isSelected ? 2 : 1}
      />
    </g>
  );
}