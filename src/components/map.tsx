import { useGameStore } from '../state/gameStore';
import { useUiStore } from '../state/uiStore';
import type { Selection } from '../types/gameState'; 
import styles from './Map.module.css'; 
import FleetIcon  from './icons/FleetIcon';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

interface MapProps {
  selection: Selection | null;
  onSelect: (newSelection: Selection | null) => void;
}

function Map({ onSelect }: MapProps) {
  const systems = useGameStore(state => state.systems);
  const orgs = useGameStore(state => state.orgs);
  const fleets = useGameStore(state => state.fleets);

  const issueMoveOrder = useGameStore(state => state.issueMoveOrder);
   
  const selection = useUiStore(state => state.selection);

  return (
    // 2. The root element is an <svg> tag.
    //    `viewBox` defines the coordinate system. Think of it as the "camera."
    <TransformWrapper initialScale={1} minScale={0.5} maxScale={5} limitToBounds={false} panning={{velocityDisabled: true}}>
    <TransformComponent wrapperClass={styles.mapWrapper}>
    <svg className={styles.mapSvg} viewBox="0 0 1000 600">
      
      {systems.ids.map((systemId: number) => {
        const system = systems.entities[systemId];
        // For each adjacent system, draw a line from this system to it.
        return system.adjacentSystemIds.map((adjacentId: number) => {
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
      {systems.ids.map((systemId: number) => {
        const system = systems.entities[systemId];
        const owner = system.ownerNationId ? orgs.entities[system.ownerNationId] : null;
        const isSelected = selection?.id === system.id && selection.type === 'system';
        return (
          <g key={system.id} className={styles.system}>
            <circle
              cx={system.position.x}
              cy={system.position.y}
              r={15}
              fill={owner ? owner.color : '#555'} //default gray if no owner
              className={`${styles.systemBody} ${isSelected ? styles.selected : ''}`}
              onClick={() => {
                 if (selection?.type === 'fleet') {
                  issueMoveOrder({ fleetId: selection.id, targetSystemId: system.id });
                  console.log(fleets.entities[selection.id]);
                  onSelect(null);
                }
                else
                {
                  onSelect({type: 'system', id: systemId});
                }
              }}
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
      {fleets.ids.map((fleetId: number) => {
        const fleet = fleets.entities[fleetId];
        const owner = orgs.entities[fleet.ownerNationId];
        const system = systems.entities[fleet.locationSystemId];

        if (!system || !owner || !fleet ) return null;

        return (
           <FleetIcon
              key={fleet.id}
              fleet={fleet}
              system={system}
              org={owner}
              isSelected={selection?.id === fleet.id && selection.type === 'fleet'}
              onClick={() => {
                if (fleet.ownerNationId === 1) {
                  onSelect({type: 'fleet', id: fleet.id});
                }
              }}
           />
        );
      })}

      {fleets.ids.map(fleetId => {
        const fleet = fleets.entities[fleetId];
    
        if (fleet.movementPath.length === 0) {
          return null;
        }

        
        const pathCoordinates: { x: number; y: number }[] = [];

        const startSystem = systems.entities[fleet.locationSystemId];
        if (startSystem) pathCoordinates.push(startSystem.position);
        fleet.movementPath.forEach(systemId => {
          const nextSystem = systems.entities[systemId];
          if (nextSystem) pathCoordinates.push(nextSystem.position);
        });

        
        return pathCoordinates.map((point, index) => {
          if (index === 0) return null;
          const prevPoint = pathCoordinates[index - 1];
          return (
            <line
              key={`path-${fleet.id}-${index}`} 
              x1={prevPoint.x} y1={prevPoint.y}
              x2={point.x} y2={point.y}
              stroke="yellow"
              strokeWidth={2}
              strokeDasharray="5,5"
            />
          );
        });
      })}

    </svg>
    </TransformComponent>
    </TransformWrapper>
  );
}

export default Map;