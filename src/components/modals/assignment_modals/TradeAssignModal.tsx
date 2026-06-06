import { useUiStore } from '../../../state/uiStore';
import { useGameStore } from '../../../state/gameStore';
import { useState } from 'react';

import styles from './AssignModal.module.css';

import { Button } from '../../pure/Button';

function TradeAssignModal() {

    const closeAssignModal = useUiStore(state => state.closeAssignModal);

    const [send, setSend] = useState({ credits: 0, rocks: 0, gas: 0});
    const [receive, setReceive] = useState({ credits: 0, rocks: 0, gas: 0 });

    const getOrgById = useGameStore(state => state.getOrgById);
    const sendDiploRequest = useGameStore(state => state.sendDiploRequest);

    const target = useUiStore(state => state.characterAssignTarget);

    if(!target){
        return null;
    }

    const senderOrg = getOrgById(1);
    const targetOrg = getOrgById(target.targetId);

    if(!senderOrg || !targetOrg){
        return null;
    }


    return(
        <div className={styles.assignModal}>
\\
            <div>
                <div>
                    <p>{senderOrg.flavor.name} </p>
                    <p>You send:</p>
                    <p>Credits:</p>
                    <input type="number" id="sendCredits" value={send.credits} onChange={(e) => setSend( { ...send, credits: parseInt(e.target.value) })} />
                    <p>Rocks:</p>
                    <input type="number" id="sendRocks" value={send.rocks} onChange={(e) => setSend( { ...send, rocks: parseInt(e.target.value) })} />
                    <p>Gas:</p>
                    <input type="number" id="sendGas" value={send.gas} onChange={(e) => setSend( { ...send, gas: parseInt(e.target.value) })} />
                </div>
                <div>
                    <p>{targetOrg.flavor.name} </p>
                    <p>You receive:</p>
                    <p>Credits:</p>
                    <input type="number" id="receiveCredits" value={receive.credits} onChange={(e) => setReceive( { ...receive, credits: parseInt(e.target.value) })} />
                    <p>Rocks:</p>
                    <input type="number" id="receiveRocks" value={receive.rocks} onChange={(e) => setReceive( { ...receive, rocks: parseInt(e.target.value) })} />
                    <p>Consumer Goods:</p>
                    <input type="number" id="receiveGas" value={receive.gas} onChange={(e) => setReceive( { ...receive, gas: parseInt(e.target.value) })} />
                </div>
            </div>
            <Button className={styles.characterButton} onClick={()=> sendDiploRequest({targetOrgId: target.targetId, originOrgId: senderOrg.id, requestType: 'trade', trade: { send: send, receive: receive} })}>Send</Button>
            <Button className={styles.characterButton} onClick={closeAssignModal}>Cancel</Button>
        </div>
    );
}

export default TradeAssignModal;
