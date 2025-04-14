import React, { useEffect, useRef, useState } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const stompClient = useRef(null);

  useEffect(() => {
    const socket = new SockJS('http://localhost:8080/ws');
    stompClient.current = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        console.log('Connected to WebSocket');
        stompClient.current.subscribe('/topic/notifications', (message) => {
          const newNotification = JSON.parse(message.body);
          setNotifications((prev) => [newNotification, ...prev]);
        });
      },
      onStompError: (frame) => {
        console.error('Broker reported error: ' + frame.headers['message']);
        console.error('Additional details: ' + frame.body);
      },
    });

    stompClient.current.activate();

    return () => {
      if (stompClient.current) {
        stompClient.current.deactivate();
        console.log('WebSocket disconnected');
      }
    };
  }, []);

  return (
    <div className="section-wrapper">
      <header className="dashboard-header">
        <h1>Notifications</h1>
        <p>Stay up to date with recent activities and updates</p>
      </header>

      <div className="notifications-list">
        {notifications.map((notif, index) => (
          <div className="notification-card" key={index}>
            <div className="notification-type">{notif.type}</div>
            <div className="notification-message">{notif.message}</div>
            <div className="notification-time">{notif.timestamp}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;
