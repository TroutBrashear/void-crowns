import { useUiStore } from '../../state/uiStore';
import { useGameStore } from '../../state/gameStore';
import styles from './Panel.module.css';

import { Button } from '../pure/Button';

function DiplomacyPanel() {

    const changeModal = useUiStore(state => state.changeModal);
    const closePanel = useUiStore(state => state.closePanel);

    const getOrgById = useGameStore(state => state.getOrgById);
    const processPlayerDiplo = useGameStore(state => state.processPlayerDiplo);

    const playerOrg = getOrgById(1);

    //something is seriously wrong in this case...
    if(!playerOrg){
        return null;
    }

    const incomingRequests = playerOrg.diplomacy.incomingRequests;

    const orgRelations = Object.values(playerOrg.diplomacy.relations);

    return (
        <div className={styles.panel}>
            <h1>Diplomacy</h1>
            <Button onClick={() => closePanel()}>Close</Button>

            <h3>Incoming requests:</h3>
            {incomingRequests.map(request => {
                const originOrg = getOrgById(request.originOrgId);
                if(!originOrg){
                    return null;
                }
                if(!request.trade){
                    return(
                        <div key={request.id}>
                            <p>{originOrg.flavor.name} is requesting {request.type}</p>
                            <Button onClick = {() => processPlayerDiplo({requestId: request.id, accepted: true})} >Accept</Button>
                            <Button onClick = {() => processPlayerDiplo({requestId: request.id, accepted: false})}>Decline</Button>
                        </div>
                    )
                }
                return(
                    <div key={request.id}>
                        <p>{originOrg.flavor.name} is requesting {request.type}</p>
                        <p>Credits: {request.trade.senderProcess.input?.credits ?? 0} - {(request.trade.senderProcess.output?.credits ?? 0)} // {request.trade.senderProcess.input?.rocks ?? 0} - {request.trade.senderProcess.output?.rocks ?? 0} // {request.trade.senderProcess.input?.consumerGoods ?? 0} - {request.trade.senderProcess.output?.consumerGoods ?? 0}</p>
                        <Button onClick = {() => processPlayerDiplo({requestId: request.id, accepted: true})} >Accept</Button>
                        <Button onClick = {() => processPlayerDiplo({requestId: request.id, accepted: false})}>Decline</Button>
                    </div>
                )
            })}

            <h3>Ongoing Relations:</h3>
            <ul>
            {orgRelations.map(relation => {

                const targetOrg = getOrgById(relation.targetOrgId);

                if(!targetOrg){
                    return null;
                }
                else if(targetOrg.category !== 'nationState'){
                    return null;
                }
                return(
                    <li key={relation.targetOrgId}>
                        <Button onClick={() => {changeModal('org_modal', {type: 'org', id: relation.targetOrgId}); }}>{targetOrg.flavor.name}</Button>
                        <p>Current Relations: {relation.status}</p>
                    </li>);
            })}
            </ul>
        </div>
    );

}

export default DiplomacyPanel;
