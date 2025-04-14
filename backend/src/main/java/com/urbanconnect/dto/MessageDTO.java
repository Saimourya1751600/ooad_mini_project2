package com.urbanconnect.dto;

import java.time.LocalDateTime;

public class MessageDTO {
    private Integer messageId;
    private Integer senderId;
    private Integer receiverId;
    private Integer bookingId;
    private String message;
    private LocalDateTime sentAt;
    private String senderName; // Additional field to display the name of the sender

    // Default constructor
    public MessageDTO() {
    }

    // Constructor with fields
    public MessageDTO(Integer messageId, Integer senderId, Integer receiverId, Integer bookingId,
                      String message, LocalDateTime sentAt, String senderName) {
        this.messageId = messageId;
        this.senderId = senderId;
        this.receiverId = receiverId;
        this.bookingId = bookingId;
        this.message = message;
        this.sentAt = sentAt;
        this.senderName = senderName;
    }

    // Getters and Setters
    public Integer getMessageId() {
        return messageId;
    }

    public void setMessageId(Integer messageId) {
        this.messageId = messageId;
    }

    public Integer getSenderId() {
        return senderId;
    }

    public void setSenderId(Integer senderId) {
        this.senderId = senderId;
    }

    public Integer getReceiverId() {
        return receiverId;
    }

    public void setReceiverId(Integer receiverId) {
        this.receiverId = receiverId;
    }

    public Integer getBookingId() {
        return bookingId;
    }

    public void setBookingId(Integer bookingId) {
        this.bookingId = bookingId;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public LocalDateTime getSentAt() {
        return sentAt;
    }

    public void setSentAt(LocalDateTime sentAt) {
        this.sentAt = sentAt;
    }

    public String getSenderName() {
        return senderName;
    }

    public void setSenderName(String senderName) {
        this.senderName = senderName;
    }
}