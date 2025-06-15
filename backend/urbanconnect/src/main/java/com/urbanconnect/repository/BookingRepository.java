package com.urbanconnect.repository;

import com.urbanconnect.entity.Booking;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Integer> {

    // Fetch bookings by customerId with pagination and related entities
    @Query("SELECT b FROM Booking b LEFT JOIN FETCH b.customer LEFT JOIN FETCH b.provider LEFT JOIN FETCH b.service WHERE b.customerId = :customerId")
    List<Booking> findByCustomerId(@Param("customerId") Integer customerId);

    // Fetch bookings by providerId
    List<Booking> findByProviderId(Integer providerId);

    // Fetch bookings by customerId and status
    List<Booking> findByCustomerIdAndStatus(Integer customerId, Booking.BookingStatus status);

    // Fetch bookings by providerId and status
    List<Booking> findByProviderIdAndStatus(Integer providerId, Booking.BookingStatus status);

    // Fetch all bookings with their related entities (without pagination)
    @Query("SELECT b FROM Booking b LEFT JOIN FETCH b.customer LEFT JOIN FETCH b.provider LEFT JOIN FETCH b.service")
    List<Booking> findAllWithDetails();

    // New query to fetch bookings by status with pagination and related entities
    @Query("SELECT b FROM Booking b LEFT JOIN FETCH b.customer LEFT JOIN FETCH b.provider LEFT JOIN FETCH b.service WHERE b.status = :status")
    Page<Booking> findByStatus(Booking.BookingStatus status, Pageable pageable);

    // Fetch all bookings with pagination and related entities
    @Query("SELECT b FROM Booking b LEFT JOIN FETCH b.customer LEFT JOIN FETCH b.provider LEFT JOIN FETCH b.service")
    Page<Booking> findAllWithDetails(Pageable pageable);
}
