import type { GameState } from '../types/gameState';
import { processAiFleetMoves } from './ai/movement';
import { processAiConstruction } from './ai/construction';

export function processAiTurn(currentState: GameState, orgId: number): GameState {

  let nextState = processAiFleetMoves(currentState, orgId);
  nextState = processAiConstruction(nextState, orgId);

  return nextState;
}