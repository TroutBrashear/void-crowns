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
  
  // Define the "radius" or size of our diamond
  const sizeX = 8;  // Half the width
  const sizeY = 12; // Half the height

  // The `points` attribute for a polygon is a list of x,y coordinates.
  // We'll define the four points of our diamond shape.
  const points = `
    ${x}, ${y - sizeY}  // Top point
    ${x + sizeX}, ${y}   // Right point
    ${x}, ${y + sizeY}  // Bottom point
    ${x - sizeX}, ${y}   // Left point
  `;

  // We can also change the shape based on the shipType for future features!
  // if (ship.shipType === 'freighter') { /* use a rectangle shape */ }

  return (
    <g 
      className={`${styles.icon} ${isSelected ? styles.selected : ''}`}
      onClick={onClick}
      style={{ cursor: 'pointer' }}
    >
      <polygon
        points={points}
        fill={org.color}
        stroke={isSelected ? 'white' : 'black'}
        strokeWidth={isSelected ? 2 : 1.5}
      />
    </g>
  );
}