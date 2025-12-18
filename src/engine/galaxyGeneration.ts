import type { System, Planetoid, Org } from '../types/gameState';
import { shuffle } from '../utils/shuffle';
import { colorPicker } from '../utils/colors';
import { findPath } from './pathfinding';

//TODO: create additional sizes that can be adaptively chosen based on the number of systems we need to fit
const WIDTH_DEFAULT = 5000;
const HEIGHT_DEFAULT = 1500;

//TODO: Create tags that can be added to systems/planetoids and alter their generation behavior


function calcDistance(systemA: System, systemB: System): number {
  const dx = systemA.position.x - systemB.position.x;
  const dy = systemA.position.y - systemB.position.y;
  return Math.sqrt(dx * dx + dy * dy);
}

function planetEnvironment(): string {
	const envDieRoll = Math.random() * 100;
	if(envDieRoll < 45){
		return 'Barren';
	}
	else if(envDieRoll < 60){
		return 'Gaseous';
	}
	else if(envDieRoll < 70){
		return 'Frozen';
	}
	else if(envDieRoll < 80){
		return 'Temperate';
	}
	else{
		return 'Molten';
	}
}


export function generateGalaxy (numSystems: number ): {systems: System[], planetoids: Planetoid[]} {
	let newGalaxy: System[] = [];
	let newPlanetoids: Planetoid[] = [];
	let nextPlanId = 0;

	for(let i = 0; i < numSystems; i++){
		const nextSystem: System = {
			id: i + 1,
			//TODO: choose random names from a bank of premade names.
			name:`System ${i+1}`,

			position: {
				x: Math.random() * WIDTH_DEFAULT,
				y: Math.random() * HEIGHT_DEFAULT,
			},

			adjacentSystemIds: [],
			ownerNationId: null,

			planetoids: [],
			};

			//give the system some planetoids
			const systemPlanetoids: Planetoid[] = []; //we'll stack them all up before pushing to system's object

			//set up one star. TODO: allow for binary systems?
			const star: Planetoid = {
				id: nextPlanId++,
				name: `Star ${nextSystem.name}`,
				parentPlanetoidId: null,
				locationSystemId: nextSystem.id,
				classification: 'gravWell',
				environment: 'star',
				size: 80,
				population: 0,
				buildings: [],
			};

			systemPlanetoids.push(star);

			//add planets
			const numPlanetoids = Math.floor((Math.random() * 6) + (Math.random() * 4));
			for(let j = 0; j < numPlanetoids; j++){
				const planet: Planetoid = {
    			id: nextPlanId++,
    			name: `${nextSystem.name} ${j + 1}`, //probably will have a naming algorithm using both presets and derived names like this
    			parentPlanetoidId: star.id,
    			locationSystemId: nextSystem.id,
   			 	classification: 'planet',
    			environment: planetEnvironment(),
   				size: 2 + Math.floor(Math.random() * 20), //no clue what scaling we're actually going to use here. right now does nothing
    			population: 0,
				buildings: [],
  			};

  			systemPlanetoids.push(planet);

  			let numMoons;
  			if(planet.environment === 'Gaseous'){
  				numMoons = Math.floor(Math.random() * 8);
  			}
  			else {
  				numMoons = Math.floor(Math.random() * 8) - 5;
  			}

  			for(let k = 0; k < numMoons; k++){
  				const moon: Planetoid = {
  					id: nextPlanId++,
    				name: `${planet.name} ${k + 1}`, 
    				parentPlanetoidId: planet.id,
    				locationSystemId: nextSystem.id,
   				 	classification: 'moon',
    				environment: 'barren', 
   					size: 2 + Math.floor(Math.random() * 5),
    				population: 0,
					buildings: [],
  				};

	  			systemPlanetoids.push(moon);
  			}
	  	}

			nextSystem.planetoids = systemPlanetoids.map(p => p.id);
			newPlanetoids.push(...systemPlanetoids);

			newGalaxy.push(nextSystem);
		}

	//set initial adjacencies
	for(const focusSystem of newGalaxy) {
		const systemDistances = newGalaxy.filter(system => system.id !== focusSystem.id).map(adjSystem => ({id: adjSystem.id, distance: calcDistance(focusSystem, adjSystem)}));

		let neighbors = systemDistances.filter(sysDis => sysDis.distance < 150);

		neighbors = shuffle(neighbors);

		//add some systems with slightly more/less expected connections
		const densityRoll = Math.floor(Math.random() * 20);
		if(densityRoll === 1){
			neighbors = neighbors.slice(0, 1);
		}
		if(densityRoll === 2){
			neighbors = neighbors.slice(0, 3);
		}
		else{
			neighbors = neighbors.slice(0, 2);
		}

		focusSystem.adjacentSystemIds = neighbors.map(nSystem => nSystem.id);
	}

	//make sure adjacencies reciprocate
	for(const focusSystem of newGalaxy) {
		for(const neighborId of focusSystem.adjacentSystemIds) {
			let neighborSystem = newGalaxy.find(system => system.id === neighborId);
			if(neighborSystem && !neighborSystem.adjacentSystemIds.includes(focusSystem.id)) {
				neighborSystem.adjacentSystemIds.push(focusSystem.id);
			}
		}
	}

	//ensure everything is connected
  let disconnectedSystems: System[];

  while(true){
  	//temp normalization so we can use pathfinding
		const tempSystemEntities: { [id: number]: System } = {};
  	for (const system of newGalaxy) {
  		tempSystemEntities[system.id] = system;
  	}
  	const tempSystems: { entities: { [id: number]: System }, ids: number[] } = {
  	  entities: tempSystemEntities,
  	  ids: newGalaxy.map(s => s.id),
	  };

	  disconnectedSystems = newGalaxy.filter(system => {
      if (system.id === 1) return false;
      const pathToSystem1 = findPath(system.id, 1, tempSystems);
      return pathToSystem1.length === 0;
    });

    if (disconnectedSystems.length === 0) {
      console.log("Galaxy is fully connected!");
      break;
    }

  	const connectedSystems = newGalaxy.filter(s => !disconnectedSystems.includes(s));

  	const currentOrphan = disconnectedSystems[0];

  	let minDistance = 1000000;
  	let closestSystem: System | null = null;

  	for(const connectedSystem of connectedSystems){
  		const distance = calcDistance(currentOrphan, connectedSystem);

  		if(distance < minDistance) {
  			minDistance = distance;
  			closestSystem = connectedSystem;
  		}
  	}

  	if(closestSystem){
  		currentOrphan.adjacentSystemIds.push(closestSystem.id);
  		closestSystem.adjacentSystemIds.push(currentOrphan.id);
  	}
  }


  return {systems: newGalaxy, planetoids: newPlanetoids};
}

export function generateStartingOrgs(numOrgs: number): Org[] {
	let newOrgs: Org[] = [];

	for(let i = 0; i < numOrgs; i++){
		let nextOrg: Org = {
			id: i + 1,
			name:`Nation ${i+1}`,
			color: colorPicker(),
			resources: { credits: 0 },
			parentId: null,
			childIds: [],
			relations: [],
		};

		newOrgs.push(nextOrg);
	}

	//iterate through and set relations
	for(const org of newOrgs){

		for(const targetOrg of newOrgs){
			if(org.id === targetOrg.id){
				continue;
			}

			let relation = {
				targetOrgId: targetOrg.id,
				status: 'peace',
				opinion: 0,
			};

			org.relations.push(relation);
		}
	}

	return newOrgs;
}