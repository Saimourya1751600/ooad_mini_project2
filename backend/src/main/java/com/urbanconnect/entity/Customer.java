package com.urbanconnect.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Entity
@DiscriminatorValue("CUSTOMER")
public class Customer extends User {

    @OneToMany(mappedBy = "customer")
    @JsonIgnore // Add JsonIgnore to prevent circular reference
    private List<Booking> bookings = new ArrayList<>();

    public Customer() {
        super();
        this.setUser_type(Usertype.CUSTOMER);
    }

    public Customer(String name, String email, String password, String phone, String address) {
        super();
        this.setName(name);
        this.setEmail(email);
        this.setPassword(password);
        this.setPhone(phone);
        this.setAddress(address);
        this.setUser_type(Usertype.CUSTOMER);
    }

    public List<Booking> getBookings() {
        return bookings;
    }

    public void setBookings(List<Booking> bookings) {
        this.bookings = bookings;
    }

    // These methods will not cause serialization issues since the main bookings field is ignored
    @JsonIgnore
    public List<Booking> getActiveBookings() {
        return bookings.stream()
                .filter(b -> b.getStatus() == Booking.BookingStatus.CONFIRMED)
                .collect(Collectors.toList());
    }

    @JsonIgnore
    public List<Booking> getCompletedBookings() {
        return bookings.stream()
                .filter(b -> b.getStatus() == Booking.BookingStatus.COMPLETED)
                .collect(Collectors.toList());
    }

    @JsonIgnore
    public List<Booking> getCancelledBookings() {
        return bookings.stream()
                .filter(b -> b.getStatus() == Booking.BookingStatus.CANCELLED)
                .collect(Collectors.toList());
    }

    @Override
    public String toString() {
        return "Customer{" +
                "userId=" + getUserId() +
                ", name='" + getName() + '\'' +
                ", email='" + getEmail() + '\'' +
                ", phone='" + getPhone() + '\'' +
                ", address='" + getAddress() + '\'' +
                ", bookingsCount=" + (bookings != null ? bookings.size() : 0) +
                '}';
    }
}