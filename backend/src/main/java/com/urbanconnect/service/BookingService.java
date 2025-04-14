package com.urbanconnect.service;

import com.urbanconnect.dto.BookingRequest;
import com.urbanconnect.dto.BookingResponse;
import com.urbanconnect.entity.Booking;
import com.urbanconnect.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.logging.Logger;

@Service
public class BookingService {

    private static final Logger logger = Logger.getLogger(BookingService.class.getName());

    @Autowired
    private BookingRepository bookingRepository;

    // Updated method to get all bookings with pagination and optional status filter
    public List<BookingResponse> getBookings(int page, int size, String status) {
        try {
            status = status.toUpperCase();
            Page<Booking> bookingPage;

            if ("ALL".equals(status)) {
                bookingPage = bookingRepository.findAll(PageRequest.of(page, size));
            } else {
                Booking.BookingStatus bookingStatus = Booking.BookingStatus.valueOf(status);
                bookingPage = bookingRepository.findByStatus(bookingStatus, PageRequest.of(page, size));
            }

            return bookingPage.getContent().stream()
                    .map(BookingResponse::new)
                    .collect(Collectors.toList());

        } catch (IllegalArgumentException e) {
            logger.severe("Invalid booking status: " + status);
            throw new RuntimeException("Invalid booking status: " + status, e);
        } catch (Exception e) {
            logger.severe("Error retrieving all bookings: " + e.getMessage());
            throw e;
        }
    }


    public BookingResponse createBooking(BookingRequest bookingRequest) {
        Booking booking = new Booking();
        booking.setCustomerId(bookingRequest.getCustomerId());
        booking.setProviderId(bookingRequest.getProviderId());
        booking.setServiceId(bookingRequest.getServiceId());
        booking.setBookingDate(LocalDate.parse(bookingRequest.getBookingDate()));
        booking.setBookingTime(LocalTime.parse(bookingRequest.getBookingTime()));
        booking.setCustomerLocation(bookingRequest.getCustomerLocation());
        if (bookingRequest.getStatus() != null && !bookingRequest.getStatus().isEmpty()) {
            booking.setStatus(Booking.BookingStatus.valueOf(bookingRequest.getStatus().toUpperCase()));
        }
        Booking savedBooking = bookingRepository.save(booking);
        return new BookingResponse(savedBooking);
    }

    public List<BookingResponse> getCustomerBookings(Integer customerId) {
        return bookingRepository.findByCustomerId(customerId).stream()
                .map(booking -> new BookingResponse(booking))
                .collect(Collectors.toList());
    }

    public List<BookingResponse> getProviderBookings(Integer providerId) {
        return bookingRepository.findByProviderId(providerId).stream()
                .map(booking -> new BookingResponse(booking))
                .collect(Collectors.toList());
    }

    public BookingResponse getBookingById(Integer bookingId) {
        Optional<Booking> bookingOpt = bookingRepository.findById(bookingId);
        return bookingOpt.map(booking -> new BookingResponse(booking)).orElse(null);
    }

    public BookingResponse updateBookingStatus(Integer bookingId, String status) {
        Optional<Booking> bookingOpt = bookingRepository.findById(bookingId);
        if (bookingOpt.isPresent()) {
            Booking booking = bookingOpt.get();
            booking.setStatus(Booking.BookingStatus.valueOf(status.toUpperCase()));
            booking = bookingRepository.save(booking);
            return new BookingResponse(booking);
        }
        return null;
    }

    public List<BookingResponse> getCustomerBookingsByStatus(Integer customerId, String status) {
        return bookingRepository.findByCustomerIdAndStatus(
                        customerId,
                        Booking.BookingStatus.valueOf(status.toUpperCase())
                ).stream()
                .map(booking -> new BookingResponse(booking))
                .collect(Collectors.toList());
    }

    public List<BookingResponse> getProviderBookingsByStatus(Integer providerId, String status) {
        return bookingRepository.findByProviderIdAndStatus(
                        providerId,
                        Booking.BookingStatus.valueOf(status.toUpperCase())
                ).stream()
                .map(booking -> new BookingResponse(booking))
                .collect(Collectors.toList());
    }
}
