import { SHIP_TRAITS } from "../../data/ships";
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
