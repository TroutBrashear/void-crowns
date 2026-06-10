import { useUiStore } from '../../state/uiStore';
import { useGameStore } from '../../state/gameStore';
import { canBuildBuilding } from '../../engine/building';
import type { BuildingClass } from '../../types/gameState';
import { BUILDING_CATALOG } from '../../data/buildings';
import styles from './Modal.module.css';
import { useState, useMemo } from 'react';

import { Button } from '../pure/Button';
import { aggregateStockpiles } from '../../utils/system_view';

function PlanetoidSelectModal() {
    const gameState = useGameStore(state => state); 
	
	const selection = useUiStore(state => state.selection);
    //const setSelection = useUiStore(state => state.setSelection);
    const backModal = useUiStore(state => state.backModal);
	const changeModal = useUiStore(state => state.changeModal);
    const closeModal = useUiStore(state => state.closeModal);

    const getSystemById = useGameStore(state => state.getSystemById);
    const getPlanetoidById = useGameStore(state => state.getPlanetoidById);
	const getBuildingById = useGameStore(state => state.getBuildingById);
    const getGoodById = useGameStore(state => state.getGoodById);
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

	const planetStockpiles = useMemo(() => aggregateStockpiles(planetToShow), [planetToShow.resources.goodsStockpiles]);

	return (
		<div className={styles.modal}>
    	  <h2>Planetoid: {planetToShow.name}</h2>
      	  <h3>In the System: {parentSystem.name}</h3>

      	  {planetToShow.population &&  <p>Population: {planetToShow.population.total}</p>}

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
		  <Button onClick={() => {if(selectedBuilding){
            constructBuilding({planetoidId: planetToShow.id, buildingType: selectedBuilding, orgId: parentSystem.ownerNationId!}); closeModal();}
          }}>Construct Building</Button>
		  </>)}
		  
      	  <h4>Buildings:</h4>
		  <ul>
			{planetToShow.buildings.map(buildingId => {
				const building = getBuildingById(buildingId);
				if (!building) return null; 
				return(
					<li key={building.id}>
						<button onClick={() => {changeModal('building_modal', {type: 'building', id: building.id}); }}>{building.type}</button>
					</li>
				);
			})}
		  </ul>

		  <h4>Stockpiles:</h4>
		  <ul>
			{Object.entries(planetStockpiles).map( ([goodId, amount]) => {
				const good = getGoodById(Number(goodId));
				if(!good) return null;
				return(
					<li key={good.id}>
						<p>{good.name}: {amount}</p>
					</li>
				);
			})}
		  </ul>

		  <h4>Known Deposits:</h4>
		  <ul>
			{planetToShow.deposits.map(deposit => {
				if (!deposit) return null;
				if (!deposit.isVisible) return null;
				return(
					<li key={`Deposit${deposit.id}`}>
						<p>{deposit.type} : {deposit.amount}</p>
					</li>
				);
			})}
		  </ul>

      	  <Button onClick={backModal}>Back</Button>
      	  <Button onClick={closeModal}>Close</Button>
    	</div>
	);

}

export default PlanetoidSelectModal;
