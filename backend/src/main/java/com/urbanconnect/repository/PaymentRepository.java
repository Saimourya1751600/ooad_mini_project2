package com.urbanconnect.repository;

import com.urbanconnect.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Optional<Payment> findByBookingId(Integer bookingId);
    List<Payment> findAllByBookingId(Integer bookingId);
    @Query("SELECT p FROM Payment p JOIN Booking b ON p.bookingId = b.id WHERE b.providerId = :providerId")
    List<Payment> findByProviderId(@Param("providerId") Long providerId);
}