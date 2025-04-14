package com.urbanconnect.dto;

public class RegisterRequest {

    private String name;
    private String email;
    private String password;
    private String phone;
    private String address;
    private String userType; // Expected values: CUSTOMER, SERVICEPROVIDER, ADMIN

    // Only required for service providers
    private String specializationDocument;

    // Add service selection field
    private Integer serviceId;

    // Getters and Setters
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getUserType() {
        return userType;
    }

    public void setUserType(String userType) {
        this.userType = userType;
    }

    public String getSpecializationDocument() {
        return specializationDocument;
    }

    public void setSpecializationDocument(String specializationDocument) {
        this.specializationDocument = specializationDocument;
    }

    public Integer getServiceId() {
        return serviceId;
    }

    public void setServiceId(Integer serviceId) {
        this.serviceId = serviceId;
    }
}