package com.urbanconnect.dto;

import java.time.LocalDateTime;

public class HelpQueryWithUserDTO {

    private Long queryId;
    private String userName;
    private String message;
    private LocalDateTime submittedAt;

    // Constructors
    public HelpQueryWithUserDTO() {}

    public HelpQueryWithUserDTO(Long queryId, String userName, String message, LocalDateTime submittedAt) {
        this.queryId = queryId;
        this.userName = userName;
        this.message = message;
        this.submittedAt = submittedAt;
    }

    // Getters and Setters
    public Long getQueryId() { return queryId; }
    public void setQueryId(Long queryId) { this.queryId = queryId; }
    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public LocalDateTime getSubmittedAt() { return submittedAt; }
    public void setSubmittedAt(LocalDateTime submittedAt) { this.submittedAt = submittedAt; }
}