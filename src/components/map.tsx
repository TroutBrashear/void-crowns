import { useGameStore } from '../state/gameStore';
import { useUiStore } from '../state/uiStore';
import type { Selection } from '../types/gameState'; 
import styles from './Map.module.css'; 

import FleetIcon  from './icons/FleetIcon';
import { ShipIcon } from './icons/ShipIcon';

import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

interface MapProps {
  //selection is now direct from store
  //selection: Selection | null;
  onSelect: (newSelection: Selection | null) => void;
}

function Map({ onSelect }: MapProps) {
  const systems = useGameStore(state => state.systems);
  const orgs = useGameStore(state => state.orgs);
  const fleets = useGameStore(state => state.fleets);
  const ships = useGameStore(state => state.ships);


  const issueMoveOrder = useGameStore(state => state.issueMoveOrder);
  const issueShipMoveOrder = useGameStore(state => state.issueShipMoveOrder);
   
  const selection = useUiStore(state => state.selection);

  return (
    <TransformWrapper initialScale={1} minScale={0.5} maxScale={5} limitToBounds={false} panning={{velocityDisabled: true}}>
    <TransformComponent wrapperClass={styles.mapWrapper}>
    <svg className={styles.mapSvg} viewBox="0 0 5000 1500">
      
      {systems.ids.map((systemId: number) => {
        const system = systems.entities[systemId];
        return system.adjacentSystemIds.map((adjacentId: number) => {
          const adjacentSystem = systems.entities[adjacentId];
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
                  onSelect(null);
                }
                else if (selection?.type === 'ship') {
                  issueShipMoveOrder({ shipId: selection.id, targetSystemId: system.id});
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

      {ships.ids.map(shipId => {
        const ship = ships.entities[shipId];
        const owner = orgs.entities[ship.ownerNationId];
        const system = systems.entities[ship.locationSystemId];

        if (!ship || !owner || !system) {
          return null;
        }

        return (
          <ShipIcon
            key={`ship-${ship.id}`} 
            position={system.position} 
            org={owner}
            isSelected={selection?.type === 'ship' && selection.id === ship.id}
            onClick={() => onSelect({ type: 'ship', id: ship.id })}
          />
        );
      })}

      {ships.ids.map(shipId => {
        const ship = ships.entities[shipId];
    
        if (ship.movementPath.length === 0) {
          return null;
        }

        
        const pathCoordinates: { x: number; y: number }[] = [];

        const startSystem = systems.entities[ship.locationSystemId];
        if (startSystem) pathCoordinates.push(startSystem.position);
        ship.movementPath.forEach(systemId => {
          const nextSystem = systems.entities[systemId];
          if (nextSystem) pathCoordinates.push(nextSystem.position);
        });

        
        return pathCoordinates.map((point, index) => {
          if (index === 0) return null;
          const prevPoint = pathCoordinates[index - 1];
          return (
            <line
              key={`path-${ship.id}-${index}`} 
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