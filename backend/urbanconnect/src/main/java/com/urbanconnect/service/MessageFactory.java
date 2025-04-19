package com.urbanconnect.service;

import java.time.LocalDateTime;
import org.springframework.stereotype.Component;
import com.urbanconnect.dto.MessageDTO;
import com.urbanconnect.entity.Message;

@Component
public class MessageFactory {

    public Message createMessage(Integer senderId, Integer receiverId, Integer bookingId, String message) {
        Message newMessage = new Message();
        newMessage.setSenderId(senderId);
        newMessage.setReceiverId(receiverId);
        newMessage.setBookingId(bookingId);
        newMessage.setMessage(message);
        newMessage.setSentAt(LocalDateTime.now());
        return newMessage;
    }

    public MessageDTO createMessageDTO(Integer messageId, Integer senderId, Integer receiverId,
                                       Integer bookingId, String message, LocalDateTime sentAt,
                                       String senderName) {
        return new MessageDTO(messageId, senderId, receiverId, bookingId, message, sentAt, senderName);
    }
}