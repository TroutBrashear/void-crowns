import React from 'react';
import { useUiStore } from '../state/uiStore';
import styles from './Notification.module.css';


function Notification() {
	const { notification, hideNotification } = useUiStore(
   	 (state) => ({
   	   notification: state.notification,
   	   hideNotification: state.hideNotification,
   	 }));


	if(!notification.isOpen)
	{
		return null;
	}

	const notificationClassName = `${styles.notification} ${styles[notification.notificationType]}`;
	return(
		<div className={notificationClassName}>
			<p>{notification.notificationMessage}</p>
			<button onClick={hideNotification}>X</button>
		</div>
	);
}

export default Notification;