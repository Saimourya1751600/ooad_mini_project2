package com.urbanconnect.dto;

import com.urbanconnect.entity.Booking;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;

@Setter
@Getter
public class BookingResponse {
    private Integer bookingId;
    private Integer customerId;
    private String customerName;
    private Integer providerId;
    private String providerName;
    private Integer serviceId;
    private String serviceName;
    private LocalDate bookingDate;
    private LocalTime bookingTime;
    private String status;
    private String customerLocation;

    public BookingResponse(Booking booking) {
        this.bookingId = booking.getBookingId();
        this.customerId = booking.getCustomerId();
        this.providerId = booking.getProviderId();
        this.serviceId = booking.getServiceId();
        this.bookingDate = booking.getBookingDate();
        this.bookingTime = booking.getBookingTime();
        this.status = booking.getStatus() != null ? booking.getStatus().name() : "UNKNOWN";
        this.customerLocation = booking.getCustomerLocation();

        // Safely handle related entities to prevent NullPointerExceptions
        if (booking.getCustomer() != null) {
            this.customerName = booking.getCustomer().getName();
        } else {
            this.customerName = "Unknown";
        }

        if (booking.getProvider() != null) {
            this.providerName = booking.getProvider().getName();
        } else {
            this.providerName = "Unknown";
        }

        if (booking.getService() != null) {
            this.serviceName = booking.getService().getName();
        } else {
            this.serviceName = "Unknown";
        }
    }
}