package com.urbanconnect.controller;

import com.urbanconnect.dto.BookingResponse;
import com.urbanconnect.dto.BookingRequest;
import com.urbanconnect.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.logging.Logger;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*")
public class BookingController {

    private static final Logger logger = Logger.getLogger(BookingController.class.getName());

    @Autowired
    private BookingService bookingService;

    // New endpoint to get all bookings with pagination and optional status filter
    @GetMapping
    public ResponseEntity<List<BookingResponse>> getAllBookings(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "ALL") String status) {
        try {
            // Fetch the bookings from the service layer based on the parameters
            List<BookingResponse> bookings = bookingService.getBookings(page, size, status);
            return new ResponseEntity<>(bookings, HttpStatus.OK);
        } catch (Exception e) {
            logger.severe("Error fetching all bookings: " + e.getMessage());
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping
    public ResponseEntity<?> createBooking(@RequestBody BookingRequest bookingRequest) {
        try {
            logger.info("Received booking request: " + bookingRequest);
            BookingResponse response = bookingService.createBooking(bookingRequest);
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (Exception e) {
            logger.severe("Error creating booking: " + e.getMessage());
            return new ResponseEntity<>("Error creating booking: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<BookingResponse>> getCustomerBookings(@PathVariable Integer customerId) {
        List<BookingResponse> bookings = bookingService.getCustomerBookings(customerId);
        return new ResponseEntity<>(bookings, HttpStatus.OK);
    }

    @GetMapping("/provider/{providerId}")
    public ResponseEntity<List<BookingResponse>> getProviderBookings(@PathVariable Integer providerId) {
        List<BookingResponse> bookings = bookingService.getProviderBookings(providerId);
        return new ResponseEntity<>(bookings, HttpStatus.OK);
    }

    @GetMapping("/{bookingId}")
    public ResponseEntity<?> getBookingById(@PathVariable Integer bookingId) {
        BookingResponse booking = bookingService.getBookingById(bookingId);
        if (booking != null) {
            return new ResponseEntity<>(booking, HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Booking not found", HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/{bookingId}/status")
    public ResponseEntity<?> updateBookingStatus(
            @PathVariable Integer bookingId,
            @RequestParam String status) {
        try {
            // Validate the status
            if (!"CANCELLED".equalsIgnoreCase(status) && !"COMPLETED".equalsIgnoreCase(status)) {
                return new ResponseEntity<>("Invalid status. Use CANCELLED or COMPLETED.", HttpStatus.BAD_REQUEST);
            }

            // Update the booking status
            BookingResponse updatedBooking = bookingService.updateBookingStatus(bookingId, status);
            if (updatedBooking != null) {
                logger.info("Booking status updated to " + status + " for bookingId: " + bookingId);
                return new ResponseEntity<>(updatedBooking, HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Booking not found", HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            logger.severe("Error updating booking status: " + e.getMessage());
            return new ResponseEntity<>("Error updating booking status: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/customer/{customerId}/status/{status}")
    public ResponseEntity<List<BookingResponse>> getCustomerBookingsByStatus(
            @PathVariable Integer customerId,
            @PathVariable String status) {
        List<BookingResponse> bookings = bookingService.getCustomerBookingsByStatus(customerId, status);
        return new ResponseEntity<>(bookings, HttpStatus.OK);
    }

    @GetMapping("/provider/{providerId}/status/{status}")
    public ResponseEntity<List<BookingResponse>> getProviderBookingsByStatus(
            @PathVariable Integer providerId,
            @PathVariable String status) {
        List<BookingResponse> bookings = bookingService.getProviderBookingsByStatus(providerId, status);
        return new ResponseEntity<>(bookings, HttpStatus.OK);
    }
}
