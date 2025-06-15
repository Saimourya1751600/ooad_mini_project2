import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faTimes } from '@fortawesome/free-solid-svg-icons';
import '../styles/ChatComponent.css';

const VendorChatComponent = ({ bookingId, customerId, customerName, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  // Fetch messages when bookingId is valid
  useEffect(() => {
    console.log("Received bookingId:", bookingId);
    
    if (bookingId) {
      fetchMessages();
      // Set up polling for new messages every 10 seconds
      const intervalId = setInterval(fetchMessages, 10000);
      return () => clearInterval(intervalId);
    } else {
      console.warn("No booking ID provided to the chat component");
      setError('No booking selected.');
      setLoading(false);
    }
  }, [bookingId]);

  // Scroll to bottom of messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchMessages = async () => {
    // Guard clause to prevent fetch with invalid bookingId
    if (!bookingId) {
      console.warn("Attempted to fetch messages without a valid bookingId");
      setError('No booking selected. Please select a booking to view messages.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null); // Clear previous errors

      const userData = localStorage.getItem('user');
      if (!userData) {
        throw new Error('User not logged in');
      }

      console.log(`Fetching messages for booking ID: ${bookingId}`);
      const response = await fetch(`http://localhost:8080/api/messages/${bookingId}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Server response error: ${response.status} - ${errorText}`);
        throw new Error(`Failed to fetch messages: ${response.statusText}`);
      }

      const messageData = await response.json();
      console.log("Messages retrieved:", messageData);
      setMessages(messageData);
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError('Failed to load messages. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
   
    if (!newMessage.trim() || !bookingId) return;

    try {
      const userData = localStorage.getItem('user');
      if (!userData) {
        throw new Error('User not logged in');
      }

      const parsedUser = JSON.parse(userData);
      const messageData = {
        senderId: parsedUser.userId,
        receiverId: customerId,
        bookingId: bookingId,
        message: newMessage,
      };

      console.log("Sending message:", messageData);
      const response = await fetch('http://localhost:8080/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messageData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Server response error: ${response.status} - ${errorText}`);
        throw new Error('Failed to send message');
      }

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
      minute: '2-digit',
    });
  };

  const formatDate = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const groupMessagesByDate = () => {
    const groups = {};
    messages.forEach((message) => {
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
        <h3>Chat with {customerName || 'Customer'}</h3>
        <button className="close-chat-btn" onClick={onClose}>
          <FontAwesomeIcon icon={faTimes} />
        </button>
      </div>

      <div className="chat-messages">
        {loading && <div className="chat-loading">Loading messages...</div>}
        {error && <div className="chat-error">{error}</div>}
        {!loading && !error && Object.keys(messageGroups).length === 0 && (
          <div className="no-messages">No messages yet. Start the conversation!</div>
        )}
        {!loading &&
          !error &&
          Object.entries(messageGroups).map(([date, msgs]) => (
            <div key={date} className="message-group">
              <div className="message-date-divider">
                <span>{formatDate(date)}</span>
              </div>
              {msgs.map((msg) => (
                <div
                  key={msg.messageId}
                  className={`message ${msg.senderId === currentUserId ? 'sent' : 'received'}`}
                >
                  <div className="message-content">
                    {msg.message}
                    <div className="message-info">
                      {msg.senderId !== currentUserId && (
                        <span className="sender-name">{msg.senderName}</span>
                      )}
                      <span className="message-time">{formatTime(msg.sentAt)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        <div ref={messagesEndRef} />
      </div>

      <form className="chat-input" onSubmit={sendMessage}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          disabled={loading || error || !bookingId}
        />
        <button type="submit" className="send-btn" disabled={loading || error || !bookingId}>
          <FontAwesomeIcon icon={faPaperPlane} />
        </button>
      </form>
    </div>
  );
};

export default VendorChatComponent;