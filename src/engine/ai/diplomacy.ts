import type { GameState, DiploRequest, DiploType } from '../../types/gameState';

export function evaluateDiploRequest(currentState: GameState, orgId: number, request: DiploRequest): boolean {

    //automatic requests always return true
    if(request.type == 'war'){
        return true;
    }


    if(request.type == 'peace'){
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

export function evaluateAiRelations(currentState: GameState, currentOrgId: number, targetOrgId: number): DiploType | null {
    const currentOrg = currentState.orgs.entities[currentOrgId];

    const currentRelations = currentOrg.diplomacy.relations.find(rel => rel.targetOrgId === targetOrgId);

    //does the org want peace?
    if(currentRelations.status == 'war'){
        if(currentState.intelligence.trueStatus[currentOrgId].militaryStrength < 0.75 * currentState.intelligence.trueStatus[targetOrgId].militaryStrength){ //todo: this logic will lead to infinity wars right now
            return 'peace';
        }
    }

    //does the org want war?
    if(currentRelations.status == 'peace'){
        if(currentState.intelligence.trueStatus[currentOrgId].militaryStrength > 1.2 * currentState.intelligence.trueStatus[targetOrgId].militaryStrength){
            return 'war';
        }
    }

    return null;
}
