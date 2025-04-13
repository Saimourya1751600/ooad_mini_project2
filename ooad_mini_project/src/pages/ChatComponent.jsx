import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faTimes } from '@fortawesome/free-solid-svg-icons';
import '../styles/ChatComponent.css';

const ChatComponent = ({ bookingId, providerId, providerName, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  
  // Fetch messages when component mounts
  useEffect(() => {
    fetchMessages();
    // Set up polling for new messages every 10 seconds
    const intervalId = setInterval(fetchMessages, 10000);
    
    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, [bookingId]);
  
  // Scroll to bottom of messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const fetchMessages = async () => {
    try {
      setLoading(true);
      const userData = localStorage.getItem('user');
      
      if (!userData) {
        throw new Error('User not logged in');
      }
      
      const parsedUser = JSON.parse(userData);
      
      // Fetch messages for this booking
      const response = await fetch(`http://localhost:8080/api/messages/${bookingId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }
      
      const messageData = await response.json();
      setMessages(messageData);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError('Failed to load messages. Please try again.');
      setLoading(false);
    }
  };
  
  const sendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;
    
    try {
      const userData = localStorage.getItem('user');
      
      if (!userData) {
        throw new Error('User not logged in');
      }
      
      const parsedUser = JSON.parse(userData);
      
      const messageData = {
        senderId: parsedUser.userId,
        receiverId: providerId,
        bookingId: bookingId,
        message: newMessage
      };
      
      const response = await fetch('http://localhost:8080/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(messageData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to send message');
      }
      
      // Clear input and refresh messages
      setNewMessage('');
      fetchMessages();
    } catch (err) {
      console.error('Error sending message:', err);
      alert('Failed to send message. Please try again.');
    }
  };
  
  const formatTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };
  
  const formatDate = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Group messages by date
  const groupMessagesByDate = () => {
    const groups = {};
    
    messages.forEach(message => {
      const date = new Date(message.sentAt).toLocaleDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });
    
    return groups;
  };
  
  const messageGroups = groupMessagesByDate();
  const userData = JSON.parse(localStorage.getItem('user') || '{}');
  const currentUserId = userData.userId;

  return (
    <div className="chat-component">
      <div className="chat-header">
        <h3>Chat with {providerName}</h3>
        <button className="close-chat-btn" onClick={onClose}>
          <FontAwesomeIcon icon={faTimes} />
        </button>
      </div>
      
      <div className="chat-messages">
        {loading && messages.length === 0 ? (
          <div className="chat-loading">Loading messages...</div>
        ) : error ? (
          <div className="chat-error">{error}</div>
        ) : Object.keys(messageGroups).length === 0 ? (
          <div className="no-messages">No messages yet. Start the conversation!</div>
        ) : (
          Object.entries(messageGroups).map(([date, msgs]) => (
            <div key={date} className="message-group">
              <div className="message-date-divider">
                <span>{formatDate(date)}</span>
              </div>
              {msgs.map(msg => (
                <div 
                  key={msg.messageId} 
                  className={`message ${msg.senderId === currentUserId ? 'sent' : 'received'}`}
                >
                  <div className="message-content">
                    {msg.message}
                    <span className="message-time">{formatTime(msg.sentAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <form className="chat-input" onSubmit={sendMessage}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button type="submit" className="send-btn">
          <FontAwesomeIcon icon={faPaperPlane} />
        </button>
      </form>
    </div>
  );
};

export default ChatComponent;