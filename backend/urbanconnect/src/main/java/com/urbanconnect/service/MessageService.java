package com.urbanconnect.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.urbanconnect.dto.MessageDTO;
import com.urbanconnect.entity.Message;
import com.urbanconnect.entity.User;
import com.urbanconnect.repository.MessageRepository;
import com.urbanconnect.repository.UserRepository;

@Service
public class MessageService {

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MessageFactory messageFactory;

    /**
     * Save a new message
     */
    public MessageDTO saveMessage(MessageDTO messageDTO) {
        Message message = messageFactory.createMessage(
                messageDTO.getSenderId(),
                messageDTO.getReceiverId(),
                messageDTO.getBookingId(),
                messageDTO.getMessage()
        );

        Message savedMessage = messageRepository.save(message);

        // Get sender's name
        User sender = userRepository.findById(savedMessage.getSenderId()).orElse(null);
        String senderName = (sender != null) ? sender.getName() : "Unknown";

        return messageFactory.createMessageDTO(
                savedMessage.getMessageId(),
                savedMessage.getSenderId(),
                savedMessage.getReceiverId(),
                savedMessage.getBookingId(),
                savedMessage.getMessage(),
                savedMessage.getSentAt(),
                senderName
        );
    }

    /**
     * Get all messages for a specific booking
     */
    public List<MessageDTO> getMessagesByBookingId(Integer bookingId) {
        List<Message> messages = messageRepository.findByBookingIdOrderBySentAtAsc(bookingId);
        List<MessageDTO> messageDTOs = new ArrayList<>();

        for (Message message : messages) {
            // Get sender's name
            User sender = userRepository.findById(message.getSenderId()).orElse(null);
            String senderName = (sender != null) ? sender.getName() : "Unknown";

            MessageDTO dto = messageFactory.createMessageDTO(
                    message.getMessageId(),
                    message.getSenderId(),
                    message.getReceiverId(),
                    message.getBookingId(),
                    message.getMessage(),
                    message.getSentAt(),
                    senderName
            );
            messageDTOs.add(dto);
        }

        return messageDTOs;
    }

    /**
     * Get all messages for a specific user
     */
    public List<MessageDTO> getMessagesByUserId(Integer userId) {
        List<Message> messages = messageRepository.findByUserIdOrderBySentAtDesc(userId);
        List<MessageDTO> messageDTOs = new ArrayList<>();

        for (Message message : messages) {
            // Get sender's name
            User sender = userRepository.findById(message.getSenderId()).orElse(null);
            String senderName = (sender != null) ? sender.getName() : "Unknown";

            MessageDTO dto = messageFactory.createMessageDTO(
                    message.getMessageId(),
                    message.getSenderId(),
                    message.getReceiverId(),
                    message.getBookingId(),
                    message.getMessage(),
                    message.getSentAt(),
                    senderName
            );
            messageDTOs.add(dto);
        }

        return messageDTOs;
    }
}