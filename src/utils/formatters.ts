import type { Character } from "../types/charState";

export const characterName = (char: Character) => {
    return `${char.name.firstName} ${char.name.lastName}`;
};
