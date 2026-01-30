import type { System, Planetoid, Org, OrgRelation } from '../types/gameState';
import { shuffle } from '../utils/shuffle';
import { findPath } from './pathfinding';
import { colorPicker } from '../utils/colors';
import { PLANETOID_TAGS } from '../data/tags';
import type { PlanetoidGenerationProcess } from '../data/tags';
import { SYSTEM_NAMES } from '../data/names';

//TODO: create additional sizes that can be adaptively chosen based on the number of systems we need to fit
const WIDTH_DEFAULT = 5000;
const HEIGHT_DEFAULT = 1500;


function calcDistance(systemA: System, systemB: System): number {
  const dx = systemA.position.x - systemB.position.x;
  const dy = systemA.position.y - systemB.position.y;
  return Math.sqrt(dx * dx + dy * dy);
}

function planetEnvironment(): string {
	const envDieRoll = Math.random() * 100;
	if(envDieRoll < 35){
		return 'Barren';
	}
	else if(envDieRoll < 50){
		return 'Gaseous';
	}
	else if(envDieRoll < 65){
		return 'Frozen';
	}
	else if(envDieRoll < 75){
		return 'Temperate';
	}
	else if(envDieRoll < 90){
		return 'Humid';
	}
	else{
		return 'Molten';
	}
}


//TAG EFFECTS
function applyPlanetoidGenerationProcess(process: PlanetoidGenerationProcess, planetoid: Planetoid): Planetoid {
	const updatedPlanetoid = planetoid;

	if(process.size !== undefined){
		updatedPlanetoid.size += process.size;
	}

	return updatedPlanetoid;
}



export function generateGalaxy (numSystems: number ): {systems: System[], planetoids: Planetoid[]} {
	let newGalaxy: System[] = [];
	let newPlanetoids: Planetoid[] = [];
	let nextPlanId = 0;

	//tag dicts
	let planetoidTagKeys = Object.keys(PLANETOID_TAGS);

	//naming dicts
	let availableSystemNames = shuffle([...SYSTEM_NAMES]);

	for(let i = 0; i < numSystems; i++){
		let systemName: string;

		systemName = availableSystemNames.pop() || `System ${i+1}`;

		const nextSystem: System = {
			id: i + 1,
			name:systemName,

			position: {
				x: Math.random() * WIDTH_DEFAULT,
				y: Math.random() * HEIGHT_DEFAULT,
			},

			adjacentSystemIds: [],
			ownerNationId: null,

			planetoids: [],
			assignedCharacter: null,
			tags: [],
		};

			//give the system some planetoids
			const systemPlanetoids: Planetoid[] = []; //we'll stack them all up before pushing to system's object

			//set up one star. TODO: allow for binary systems?
			let star: Planetoid = {
				id: nextPlanId++,
				name: `Star ${nextSystem.name}`,
				parentPlanetoidId: null,
				locationSystemId: nextSystem.id,
				classification: 'gravWell',
				environment: 'star',
				ownerNationId: null,
				size: 80,
				population: 0,
				buildings: [],
				tags: [],
			};

			systemPlanetoids.push(star);

			//add planets
			const numPlanetoids = Math.floor((Math.random() * 6) + (Math.random() * 4));
			for(let j = 0; j < numPlanetoids; j++){
				let planet: Planetoid = {
					id: nextPlanId++,
					name: `${nextSystem.name} ${j + 1}`, //probably will have a naming algorithm using both presets and derived names like this
					parentPlanetoidId: star.id,
					locationSystemId: nextSystem.id,
					classification: 'planet',
					environment: planetEnvironment(),
					ownerNationId: null,
					size: 2 + Math.floor(Math.random() * 20), //no clue what scaling we're actually going to use here. right now does nothing
					population: 0,
					buildings: [],
					tags: [],
				};

			//apply potential tag(s)
			if(Math.floor(Math.random()*20) < 2){
				const chosenTagId = planetoidTagKeys[Math.floor(Math.random() * planetoidTagKeys.length)];

				const chosenTag = PLANETOID_TAGS[chosenTagId];

				if(chosenTag.generationEffects){
					planet = applyPlanetoidGenerationProcess(chosenTag.generationEffects, planet);
				}

				planet.tags.push(chosenTagId);
			}

  			systemPlanetoids.push(planet);

  			let numMoons;
  			if(planet.environment === 'Gaseous'){
  				numMoons = Math.floor(Math.random() * 8);
  			}
  			else {
  				numMoons = Math.floor(Math.random() * 8) - 5;
  			}

  			for(let k = 0; k < numMoons; k++){
  				let moon: Planetoid = {
  					id: nextPlanId++,
    				name: `${planet.name} ${k + 1}`, 
    				parentPlanetoidId: planet.id,
    				locationSystemId: nextSystem.id,
   				 	classification: 'moon',
    				environment: 'Barren',
					ownerNationId: null,
   					size: 2 + Math.floor(Math.random() * 5),
    				population: 0,
					buildings: [],
					tags: [],
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


  	let minDistance = 1000000;
  	let closestSystem: System | null = null;
	let closestOrphan: System | null = null;

	for(const currentOrphan of disconnectedSystems){
		for(const connectedSystem of connectedSystems){
			const distance = calcDistance(currentOrphan, connectedSystem);

			if(distance < minDistance) {
				minDistance = distance;
				closestSystem = connectedSystem;
				closestOrphan = currentOrphan;
			}
		}
	}

  	if(closestSystem){
  		closestOrphan.adjacentSystemIds.push(closestSystem.id);
  		closestSystem.adjacentSystemIds.push(closestOrphan.id);
  	}
  }


  return {systems: newGalaxy, planetoids: newPlanetoids};
}

export function generateStartingOrgs(numOrgs: number): Org[] {
	let newOrgs: Org[] = [];

	for(let i = 0; i < numOrgs; i++){
		let nextOrg: Org = {
			id: i + 1,
			flavor: {
				name:`Nation ${i+1}`,
				color: colorPicker(),
				nameList: 'default',
			},
			resources: { credits: 0, rocks: 0 },
			characters: {
				characterPool: [],
			},
			parentId: null,
			childIds: [],
			diplomacy: {
				relations: [],
				incomingRequests: [],
			},
			contextHistory: {
				previousIncome: { credits: 0, rocks: 0 },
				buildPlan: [],
				targetSystems: [],
			},
		};

		newOrgs.push(nextOrg);
	}

	//iterate through and set relations
	for(const org of newOrgs){

		for(const targetOrg of newOrgs){
			if(org.id === targetOrg.id){
				continue;
			}

			let relation: OrgRelation = {
				targetOrgId: targetOrg.id,
				status: 'peace',
				opinion: 0,
			};

			org.diplomacy.relations.push(relation);
		}
	}

	return newOrgs;
}
