package com.urbanconnect.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.urbanconnect.dto.MessageDTO;
import com.urbanconnect.service.MessageService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/messages")
public class MessageController {
    private static final Logger logger = LoggerFactory.getLogger(MessageController.class);

    @Autowired
    private MessageService messageService;

    @PostMapping
    public ResponseEntity<?> sendMessage(@RequestBody MessageDTO messageDTO) {
        try {
            if (messageDTO.getBookingId() == null) {
                logger.error("BookingId is null in request body");
                return new ResponseEntity<>("BookingId is required", HttpStatus.BAD_REQUEST);
            }
            if (messageDTO.getSenderId() == null) {
                logger.error("SenderId is null in request body");
                return new ResponseEntity<>("SenderId is required", HttpStatus.BAD_REQUEST);
            }
            if (messageDTO.getReceiverId() == null) {
                logger.error("ReceiverId is null in request body");
                return new ResponseEntity<>("ReceiverId is required", HttpStatus.BAD_REQUEST);
            }

            logger.info("Saving message for booking: {}", messageDTO.getBookingId());
            MessageDTO savedMessage = messageService.saveMessage(messageDTO);
            return new ResponseEntity<>(savedMessage, HttpStatus.CREATED);
        } catch (Exception e) {
            logger.error("Error while sending message: ", e);
            return new ResponseEntity<>("Error sending message: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/{bookingId}")
    public ResponseEntity<?> getMessagesByBookingId(@PathVariable Integer bookingId) {
        try {
            if (bookingId == null) {
                logger.error("Received null bookingId");
                return new ResponseEntity<>("Booking ID cannot be null", HttpStatus.BAD_REQUEST);
            }
            if (bookingId <= 0) {
                logger.error("Received invalid bookingId: {}", bookingId);
                return new ResponseEntity<>("Invalid booking ID", HttpStatus.BAD_REQUEST);
            }

            logger.info("Fetching messages for booking: {}", bookingId);
            List<MessageDTO> messages = messageService.getMessagesByBookingId(bookingId);
            logger.info("Retrieved {} messages for booking {}", messages.size(), bookingId);
            return new ResponseEntity<>(messages, HttpStatus.OK);
        } catch (Exception e) {
            logger.error("Error fetching messages for booking {}: ", bookingId, e);
            return new ResponseEntity<>("Error fetching messages: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getMessagesByUserId(@PathVariable Integer userId) {
        try {
            if (userId == null) {
                logger.error("Received null userId");
                return new ResponseEntity<>("User ID cannot be null", HttpStatus.BAD_REQUEST);
            }
            if (userId <= 0) {
                logger.error("Received invalid userId: {}", userId);
                return new ResponseEntity<>("Invalid user ID", HttpStatus.BAD_REQUEST);
            }

            logger.info("Fetching messages for user: {}", userId);
            List<MessageDTO> messages = messageService.getMessagesByUserId(userId);
            logger.info("Retrieved {} messages for user {}", messages.size(), userId);
            return new ResponseEntity<>(messages, HttpStatus.OK);
        } catch (Exception e) {
            logger.error("Error fetching messages for user {}: ", userId, e);
            return new ResponseEntity<>("Error fetching messages: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}