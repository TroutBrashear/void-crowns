import React from 'react';
import { useGameStore } from '../state/gameStore';
import type { System } from '../types/gameState'; // Import the type for clarity
import styles from './Map.module.css'; // We will create this file

function Map() {
  // 1. Select the necessary data from the store.
  const systems = useGameStore(state => state.systems);
  const nations = useGameStore(state => state.nations);

  return (
    // 2. The root element is an <svg> tag.
    //    `viewBox` defines the coordinate system. Think of it as the "camera."
    <svg className={styles.mapSvg} viewBox="0 0 1000 600">
      
      {/* 3. Render the "starlanes" (connections between systems) */}
      {systems.ids.map(systemId: number => {
        const system = systems.entities[systemId];
        // For each adjacent system, draw a line from this system to it.
        return system.adjacentSystemIds.map(adjacentId: number => {
          const adjacentSystem = systems.entities[adjacentId];
          // Simple check to avoid drawing lines twice
          if (system.id < adjacentSystem.id) {
            return (
              <line
                key={`${system.id}-${adjacentId}`}
                x1={system.position.x}
                y1={system.position.y}
                x2={adjacentSystem.position.x}
                y2={adjacentSystem.position.y}
                className={styles.starLane}
              />
            );
          }
          return null;
        });
      })}

      {/* 4. Render the star systems on top of the lanes. */}
      {systems.ids.map(systemId: number => {
        const system = systems.entities[systemId];
        const owner = system.ownerNationId ? nations.entities[system.ownerNationId] : null;

        return (
          // Use a <g> tag to group the circle and text together
          <g key={system.id} className={styles.system}>
            <circle
              cx={system.position.x}
              cy={system.position.y}
              r={15} // Radius of the circle
              fill={owner ? owner.color : '#555'} // Use nation color or a default grey
              className={styles.systemBody}
            />
            <text
              x={system.position.x}
              y={system.position.y + 30} // Position the text below the circle
              className={styles.systemLabel}
            >
              {system.name}
            </text>
          </g>
        );
      })}

      {/* We will render fleets here in a later step */}

    </svg>
  );
}

export default Map;