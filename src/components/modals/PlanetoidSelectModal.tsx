import { useUiStore } from '../../state/uiStore';
import { useGameStore } from '../../state/gameStore';
import { canBuildBuilding } from '../../engine/building';
import type { BuildingClass } from '../../types/gameState';
import { BUILDING_CATALOG } from '../../data/buildings';
import styles from './Modal.module.css';
import { useState } from 'react';

function PlanetoidSelectModal() {
    const gameState = useGameStore(state => state); 
	
	const selection = useUiStore(state => state.selection);
    //const setSelection = useUiStore(state => state.setSelection);
    const backModal = useUiStore(state => state.backModal);
    const closeModal = useUiStore(state => state.closeModal);

    const getSystemById = useGameStore(state => state.getSystemById);
    const getPlanetoidById = useGameStore(state => state.getPlanetoidById);
    //const getOrgById = useGameStore(state => state.getOrgById);
	const constructBuilding = useGameStore(state => state.constructBuilding);

	const [selectedBuilding, setSelectedBuilding] = useState<BuildingClass | null>(null);

    const planetToShow = 
    (selection?.type === 'planetoid') 
    ? getPlanetoidById(selection.id) 
    : null;

  	if (!planetToShow) {
  	  return null; 
  	}

  	const parentSystem = getSystemById(planetToShow.locationSystemId);
	if (!parentSystem) {
  	  return null; 
  	}
	
	//prepare list of potential buildings
	const allBuildingTypes = (Object.keys(BUILDING_CATALOG) as BuildingClass[]);
	const buildableTypes = allBuildingTypes.filter(type => {
		return canBuildBuilding(gameState, planetToShow.id, type, 1); //1 is currently hardcoded player ID.
	});
	const buildingOptions = buildableTypes.map(bKey => {
		const definition = BUILDING_CATALOG[bKey];

		
		return {
			type: definition.type,
		};
	});

	return (
		<div className={styles.modal}>
    	  <h2>Planetoid: {planetToShow.name}</h2>
      	  <h3>In the System: {parentSystem.name}</h3>

		  {parentSystem.ownerNationId === 1 && (<>
			<select name="constructionTarget" value={selectedBuilding || ''} onChange={(e) => setSelectedBuilding(e.target.value as BuildingClass)}>
			{buildingOptions.map(building => {
            if (!building) return null; 
              return(
              <option value={building.type}>
                {building.type}
             </option>);
            })}
          </select>
		  <button onClick={() => {if(selectedBuilding){ 
            constructBuilding({planetoidId: planetToShow.id, buildingType: selectedBuilding, orgId: parentSystem.ownerNationId!}); closeModal();}
          }}>Construct Building</button>
		  </>)}
		  
      	  <h4>Buildings:</h4>
		  <ul>
			{planetToShow.buildings.map(building => {
				if (!building) return null; 
				return(
					<li key={building.id}>
						<p>{building.type}</p>
					</li>
				);
			})}
		  </ul>
		  <h4>Known Deposits:</h4>
		  <ul>
			{planetToShow.deposits.map((deposit, index) => {
				if (!deposit) return null;
				if (!deposit.isVisible) return null;
				return(
					<li key={`Deposit${deposit.id}`}>
						<p>{deposit.type} : {deposit.amount}</p>
					</li>
				);
			})}
		  </ul>

      	  <button onClick={backModal}>Back</button>
      	  <button onClick={closeModal}>Close</button>
    	</div>
	);

}

export default PlanetoidSelectModal;
