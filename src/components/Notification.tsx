import React from 'react';
import { useUiStore } from '../state/uiStore';
import styles from './Notification.module.css';
import { shallow } from 'zustand/shallow';

function Notification() {
	const notification = useUiStore((state) => state.notification);
	const hideNotification = useUiStore((state) => state.hideNotification);


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