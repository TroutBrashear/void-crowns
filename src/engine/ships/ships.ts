import { CYCLE_CONFIG } from "../../constants/cycle_config";
import { SHIP_TRAITS } from "../../data/ships";
import type { GameState } from "../../types/gameState";
import type { MilShip } from '../../types/shipTypes';



export function assignRandomShipTrait(targetShip: MilShip): MilShip {
    let possTraits = Object.values(SHIP_TRAITS).filter(trait => trait.applyCat.includes(targetShip.status));

    let traitRoll = Math.random() * possTraits.length;

    if(targetShip.flavor.traits.includes(possTraits[traitRoll].id)){
        return targetShip;
    }

    let targetTraits = [...targetShip.flavor.traits, possTraits[traitRoll].id];

    return {
        ...targetShip,
        flavor: {
            ...targetShip.flavor,
            traits: targetTraits
        }
    };
}


export function processMilShips(currentState: GameState): GameState {
    let nextShips = { ...currentState.milShips.entities };

    for(let ship of Object.values(nextShips)){
        const traitRoll = (Math.random() * CYCLE_CONFIG.SHIPS.TRAIT_CHANCE) + ship.flavor.traits.length;

        if(traitRoll < CYCLE_CONFIG.SHIPS.TRAIT_CHANCE / 100){
            ship = assignRandomShipTrait(ship);

            nextShips[ship.id] = ship;
        }
    }

    return {
        ...currentState,
        milShips: {
            ...currentState.milShips,
            entities: nextShips
        }
    }
}
