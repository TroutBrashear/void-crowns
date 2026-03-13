import type { GameState, DiploRequest, DiploType } from '../../types/gameState';
import { sendDiploRequest } from '../diplomacy';

export function evaluateDiploRequest(currentState: GameState, orgId: number, request: DiploRequest): boolean {

    //automatic requests always return true
    if(request.type === 'war'){
        return true;
    }


    if(request.type === 'peace'){
        if(currentState.intelligence.trueStatus[orgId].militaryStrength < 0.75 * currentState.intelligence.trueStatus[request.originOrgId].militaryStrength){ //todo: base this on receiver's PERCEPTION of originOrg rather than ground truth.
            return true; //accept peace
        }
        else{
            return false;
        }
    }

    else{
        //fallback case, shouldn't ever occur
        return false;
    }
}

export function evaluateTradeDeal(currentState: GameState, orgId: number, request: DiploRequest): boolean {
    if(!request.trade || request.type !== 'trade'){
        return false;
    }

    let thinkingOrg = currentState.orgs.entities[orgId];

    if(!thinkingOrg){
        return false;
    }
    if(thinkingOrg.resources.credits < (request.trade.targetProcess.input?.credits ?? 0) || thinkingOrg.resources.rocks < (request.trade.targetProcess.input?.rocks ?? 0) || thinkingOrg.resources.consumerGoods < (request.trade.targetProcess.input?.consumerGoods ?? 0)){
        return false;
    }

    let creditScore = 1;
    let rockScore = 1;
    let consumerGoodScore = 1;

    const receiving = (request.trade.targetProcess.output?.credits ?? 0) + (request.trade.targetProcess.output?.rocks ?? 0) + (request.trade.targetProcess.output?.consumerGoods ?? 0);
    const sending = (request.trade.targetProcess.input?.credits ?? 0) + (request.trade.targetProcess.input?.rocks ?? 0) + (request.trade.targetProcess.input?.consumerGoods ?? 0)

    //check if it is at least CLOSE to fair
    if(receiving < 0.8 * sending){
        return false;
    }

    //pressing needs
    if(thinkingOrg.resources.credits < 2000 && (request.trade.targetProcess.output?.credits ?? 0) > 0){
        creditScore += 10
    }
    if(thinkingOrg.resources.rocks < 1000 && (request.trade.targetProcess.output?.rocks ?? 0) > 0){
        rockScore += 10
    }
    if(thinkingOrg.resources.consumerGoods < 2000 && thinkingOrg.category === 'corporation' && (request.trade.targetProcess.output?.consumerGoods ?? 0) > 0){
        consumerGoodScore += 10
    }
    else if(thinkingOrg.resources.consumerGoods < 1000 && (request.trade.targetProcess.output?.consumerGoods ?? 0) > 0){
        consumerGoodScore += 10;
    }

    //not overly taxing
    if((thinkingOrg.resources.credits * .5) < (request.trade.targetProcess.input?.credits ?? 0)){
        creditScore -= 5;
    }
    if((thinkingOrg.resources.rocks * .5) < (request.trade.targetProcess.input?.rocks ?? 0)){
        rockScore -= 5;
    }
    if((thinkingOrg.resources.consumerGoods * .5) < (request.trade.targetProcess.input?.consumerGoods ?? 0)){
        consumerGoodScore -= 5;
    }

    if(creditScore + rockScore + consumerGoodScore > 0){
        return true;
    }
    else{
        return false;
    }
}

function isRequestPending(currentState: GameState, originOrgId: number, targetOrgId: number): boolean {
    const targetOrg = currentState.orgs.entities[targetOrgId];

    if(targetOrg.diplomacy.incomingRequests.some(req => req.originOrgId === originOrgId)){
        return true;
    }

    return false;
}

export function evaluateAiTradeNeeds(currentState: GameState, currentOrgId: number): GameState {
    let nextState = { ...currentState };
    let thinkingOrg = { ...currentState.orgs.entities[currentOrgId] };

    let targetOrg = { ...currentState.orgs.entities[1] };   //placeholder: player Org is currently always target.

    //avoid request spam by checking to see if thinkingOrg is already waiting on a response
    if(isRequestPending(nextState, thinkingOrg.id, targetOrg.id)){
        return nextState;
    }

    if(thinkingOrg.resources.rocks < 1000 && thinkingOrg.contextHistory.previousIncome.rocks < 0){
        nextState = sendDiploRequest(nextState, 1, currentOrgId, 'trade',  { send: {credits: 2000, rocks: 0, consumerGoods: 0}, receive: {credits: 0, rocks: 1500, consumerGoods: 0 }});
    }

    if(thinkingOrg.resources.consumerGoods < 1000 && thinkingOrg.contextHistory.previousIncome.consumerGoods < 0){
        nextState = sendDiploRequest(nextState, 1, currentOrgId, 'trade', { send: {credits: 2000, rocks: 0, consumerGoods: 0}, receive: {credits: 0, rocks: 0, consumerGoods: 1500 }});
    }

    return nextState;
}


export function evaluateAiRelations(currentState: GameState, currentOrgId: number, targetOrgId: number): DiploType | null {
    const currentOrg = currentState.orgs.entities[currentOrgId];

    const currentRelations = currentOrg.diplomacy.relations.find(rel => rel.targetOrgId === targetOrgId);

    if(!currentRelations){
        return null;
    }

    //does the org want peace?
    if(currentRelations.status == 'war'){
        if((currentState.intelligence.trueStatus[currentOrgId].militaryStrength < 0.75 * currentState.intelligence.trueStatus[targetOrgId].militaryStrength) || !currentOrg.contextHistory.targetSystems.some(systemId => currentState.systems.entities[systemId].ownerNationId === targetOrgId)){
            return 'peace';
        }
    }

    //does the org want war?
    if(currentRelations.status == 'peace'){
        if(currentState.intelligence.trueStatus[currentOrgId].militaryStrength > 1.2 * currentState.intelligence.trueStatus[targetOrgId].militaryStrength){
            if(currentOrg.contextHistory.targetSystems.some(systemId => currentState.systems.entities[systemId].ownerNationId === targetOrgId)){
                return 'war';
            }
        }
    }

    return null;
}
