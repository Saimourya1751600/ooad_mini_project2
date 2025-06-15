package com.urbanconnect.controller;

import com.urbanconnect.dto.PaymentDTO;
import com.urbanconnect.entity.PAYMENTMETHOD;
import com.urbanconnect.entity.PAYSTAT;
import com.urbanconnect.entity.Payment;
import com.urbanconnect.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "*")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    // Fetch all payments
    @GetMapping
    public ResponseEntity<List<PaymentDTO>> getAllPayments() {
        List<PaymentDTO> paymentDetails = paymentService.getAllPayments();
        return ResponseEntity.ok(paymentDetails);
    }

    @GetMapping("/provider/{providerId}")
    public ResponseEntity<List<PaymentDTO>> getPaymentDetailsByProviderId(@PathVariable Long providerId) {
        List<PaymentDTO> paymentDetails = paymentService.getPaymentDetailsByProviderId(providerId);
        return ResponseEntity.ok(paymentDetails);
    }

    @GetMapping("/provider/{providerId}/total")
    public ResponseEntity<BigDecimal> getTotalEarningsByProviderId(@PathVariable Long providerId) {
        BigDecimal totalEarnings = paymentService.getTotalEarningsByProviderId(providerId);
        return ResponseEntity.ok(totalEarnings);
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> processPayment(@RequestBody Map<String, Object> paymentData) {
        try {
            Integer bookingId = ((Number) paymentData.get("bookingId")).intValue();
            Double amount = ((Number) paymentData.get("amount")).doubleValue();
            String paymentMethod = (String) paymentData.get("paymentMethod");
            String paymentStatus = (String) paymentData.get("paymentStatus");

            Payment payment = new Payment();
            payment.setBookingId(bookingId);
            payment.setAmount(BigDecimal.valueOf(amount));
            payment.setPaymentMethod(PAYMENTMETHOD.valueOf(paymentMethod));
            payment.setPaymentStatus(PAYSTAT.valueOf(paymentStatus.toUpperCase()));

            Payment savedPayment = paymentService.processPayment(payment);

            Map<String, Object> response = new HashMap<>();
            response.put("paymentId", savedPayment.getPaymentId());
            response.put("message", "Payment confirmed and updated successfully");
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(Map.of("error", "Error processing payment: " + e.getMessage()), HttpStatus.BAD_REQUEST);
        }
    }
}
