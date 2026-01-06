import type { GameState } from '../types/gameState';
import { processAiFleetMoves, processAiShipMoves } from './ai/movement';
import { processAiConstruction } from './ai/construction';
import { processAiBuildPlanning } from './ai/planning';

export function processAiTurn(currentState: GameState, orgId: number): GameState {

  let nextState = processAiBuildPlanning(currentState, orgId)
  
  nextState = processAiFleetMoves(currentState, orgId);
  nextState = processAiShipMoves(currentState, orgId);

  //construction last to give player even a chance of reacting to new builds. It is all so fast!
  nextState = processAiConstruction(nextState, orgId);

  return nextState;
}