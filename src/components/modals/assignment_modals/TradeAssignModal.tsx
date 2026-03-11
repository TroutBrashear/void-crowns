import { useUiStore } from '../../../state/uiStore';
import { useGameStore } from '../../../state/gameStore';
import { useState } from 'react';

import styles from './AssignModal.module.css';


function TradeAssignModal({ senderId, targetId }: { senderId: number, targetId: number }) {

    const closeAssignModal = useUiStore(state => state.closeAssignModal);

    const [send, setSend] = useState({ credits: 0, rocks: 0, consumerGoods: 0 });
    const [receive, setReceive] = useState({ credits: 0, rocks: 0, consumerGoods: 0 });

    const getOrgById = useGameStore(state => state.getOrgById);
    const sendDiploRequest = useGameStore(state => state.sendDiploRequest);


    const senderOrg = getOrgById(senderId);
    const targetOrg = getOrgById(targetId);

    if(!senderOrg || !targetOrg){
        return null;
    }



    return(
        <div className={styles.assignModal}>

            <div>
                <div>
                    <p>{senderOrg.flavor.name} </p>
                    <p>You send:</p>
                    <p>Credits:</p>
                    <input type="number" id="sendCredits" value={send.credits} onChange={(e) => setSend( { ...send, credits: parseInt(e.target.value) })} />
                    <p>Rocks:</p>
                    <input type="number" id="sendRocks" value={send.rocks} onChange={(e) => setSend( { ...send, rocks: parseInt(e.target.value) })} />
                    <p>Consumer Goods:</p>
                    <input type="number" id="sendConsumerGoods" value={send.consumerGoods} onChange={(e) => setSend( { ...send, consumerGoods: parseInt(e.target.value) })} />
                </div>
                <div>
                    <p>{targetOrg.flavor.name} </p>
                    <p>You receive:</p>
                    <p>Credits:</p>
                    <input type="number" id="receiveCredits" value={receive.credits} onChange={(e) => setReceive( { ...receive, credits: parseInt(e.target.value) })} />
                    <p>Rocks:</p>
                    <input type="number" id="receiveRocks" value={receive.rocks} onChange={(e) => setReceive( { ...receive, rocks: parseInt(e.target.value) })} />
                    <p>Consumer Goods:</p>
                    <input type="number" id="receiveConsumerGoods" value={receive.consumerGoods} onChange={(e) => setReceive( { ...receive, consumerGoods: parseInt(e.target.value) })} />
                </div>
            </div>
            <button className={styles.characterButton} onClick={()=> sendDiploRequest({targetOrgId: targedId, originOrgId: senderId, requestType: 'trade', trade: { send: send, receive: receive} })}
            <button className={styles.characterButton} onClick={closeAssignModal}>Cancel</button>
        </div>
    );
}

export default TradeAssignModal;
