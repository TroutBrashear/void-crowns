import type { Fleet, Org, System } from '../../types/gameState';

interface FleetIconProps {
  fleet: Fleet;
  system: StarSystem; // We need the system for its position
  org: Org | null;
  isSelected: boolean;
  onClick: () => void;
}

function FleetIcon({ fleet, system, org, isSelected, onClick }: FleetIconProps) {
  const { x, y } = system.position;
  const size = 6; // The "radius" of our triangle

  // Construct the path string
  const pathData = `
    M ${x}, ${y - size}
    L ${x - size}, ${y + size}
    L ${x + size}, ${y + size}
    Z
  `;

  return (
    <g onClick={onClick} style={{ cursor: 'pointer' }}>
      <path
        d={pathData}
        fill={org ? org.color : '#888'}
        stroke={isSelected ? 'white' : '#ccc'}
        strokeWidth={isSelected ? 2 : 1}
      />
    </g>
  );
}

export default FleetIcon;