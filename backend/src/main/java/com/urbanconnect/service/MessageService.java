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

    /**
     * Save a new message
     */
    public MessageDTO saveMessage(MessageDTO messageDTO) {
        Message message = new Message();
        message.setSenderId(messageDTO.getSenderId());
        message.setReceiverId(messageDTO.getReceiverId());
        message.setBookingId(messageDTO.getBookingId());
        message.setMessage(messageDTO.getMessage());
        message.setSentAt(LocalDateTime.now());

        Message savedMessage = messageRepository.save(message);

        // Get sender's name
        User sender = userRepository.findById(savedMessage.getSenderId()).orElse(null);
        String senderName = (sender != null) ? sender.getName() : "Unknown";

        MessageDTO responseDTO = new MessageDTO();
        responseDTO.setMessageId(savedMessage.getMessageId());
        responseDTO.setSenderId(savedMessage.getSenderId());
        responseDTO.setReceiverId(savedMessage.getReceiverId());
        responseDTO.setBookingId(savedMessage.getBookingId());
        responseDTO.setMessage(savedMessage.getMessage());
        responseDTO.setSentAt(savedMessage.getSentAt());
        responseDTO.setSenderName(senderName);

        return responseDTO;
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

            MessageDTO dto = new MessageDTO();
            dto.setMessageId(message.getMessageId());
            dto.setSenderId(message.getSenderId());
            dto.setReceiverId(message.getReceiverId());
            dto.setBookingId(message.getBookingId());
            dto.setMessage(message.getMessage());
            dto.setSentAt(message.getSentAt());
            dto.setSenderName(senderName);

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

            MessageDTO dto = new MessageDTO();
            dto.setMessageId(message.getMessageId());
            dto.setSenderId(message.getSenderId());
            dto.setReceiverId(message.getReceiverId());
            dto.setBookingId(message.getBookingId());
            dto.setMessage(message.getMessage());
            dto.setSentAt(message.getSentAt());
            dto.setSenderName(senderName);

            messageDTOs.add(dto);
        }

        return messageDTOs;
    }
}