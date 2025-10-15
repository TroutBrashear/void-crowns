import { create } from 'zustand';
import type { System, Fleet, Org } from '../types/gameState';
import { normalize } from '../utils/normalize';

import { initialOrgs, initialStarSystems, initialFleets } from '../data/scenarios/demo';

interface EntitiesState<T> {
  entities: { [id: number]: T };
  ids: number[];
}

interface GameState {
  starSystems: EntitiesState<System>;
  fleets: EntitiesState<Fleet>;
  orgs: EntitiesState<Org>;
}

export const useGameStore = create<GameState>((set, get) => ({
  starSystems: normalize(initialSystems),
  fleets: normalize(initialFleets),
  orgs: normalize(initialOrgs),
}));