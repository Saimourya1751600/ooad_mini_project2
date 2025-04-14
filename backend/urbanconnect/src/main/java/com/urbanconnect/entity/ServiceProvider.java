package com.urbanconnect.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@DiscriminatorValue("SERVICEPROVIDER")
public class ServiceProvider extends User {

    @OneToMany(mappedBy = "provider")
    @JsonIgnore // Add JsonIgnore to prevent circular reference
    private List<Booking> bookings = new ArrayList<>();

    public ServiceProvider() {
        super();
        this.setUser_type(Usertype.SERVICEPROVIDER);
    }

    public ServiceProvider(String name, String email, String password, String phone, String address) {
        super();
        this.setName(name);
        this.setEmail(email);
        this.setPassword(password);
        this.setPhone(phone);
        this.setAddress(address);
        this.setUser_type(Usertype.SERVICEPROVIDER);
    }

    public List<Booking> getBookings() {
        return bookings;
    }

    public void setBookings(List<Booking> bookings) {
        this.bookings = bookings;
    }

    @Override
    public String toString() {
        return "ServiceProvider{" +
                "userId=" + getUserId() +
                ", name='" + getName() + '\'' +
                ", email='" + getEmail() + '\'' +
                ", phone='" + getPhone() + '\'' +
                ", address='" + getAddress() + '\'' +
                ", bookingsCount=" + (bookings != null ? bookings.size() : 0) +
                '}';
    }
}