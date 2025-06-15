package com.urbanconnect.service;

import com.urbanconnect.dto.PaymentDTO;
import com.urbanconnect.entity.PAYSTAT;
import com.urbanconnect.entity.Payment;
import com.urbanconnect.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;

    @Autowired
    public PaymentService(PaymentRepository paymentRepository) {
        this.paymentRepository = paymentRepository;
    }

    @Transactional
    public Payment createPayment(Payment payment) {
        return paymentRepository.save(payment);
    }

    public List<PaymentDTO> getAllPayments() {
        return paymentRepository.findAll().stream()
                .map(PaymentDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public Optional<Payment> getPaymentById(Long paymentId) {
        return paymentRepository.findById(paymentId);
    }

    public Optional<Payment> getPaymentByBookingId(Integer bookingId) {
        return paymentRepository.findByBookingId(bookingId);
    }

    public List<Payment> getAllPaymentsByBookingId(Integer bookingId) {
        return paymentRepository.findAllByBookingId(bookingId);
    }

    @Transactional
    public Payment updatePaymentStatus(Long paymentId, PAYSTAT status) {
        Optional<Payment> paymentOpt = paymentRepository.findById(paymentId);
        if (paymentOpt.isPresent()) {
            Payment payment = paymentOpt.get();
            payment.setPaymentStatus(status);
            return paymentRepository.save(payment);
        }
        throw new RuntimeException("Payment not found with id: " + paymentId);
    }

    @Transactional
    public void deletePayment(Long paymentId) {
        if (!paymentRepository.existsById(paymentId)) {
            throw new RuntimeException("Payment not found with id: " + paymentId);
        }
        paymentRepository.deleteById(paymentId);
    }

    @Transactional
    public Payment processPayment(Payment payment) {
        // For demonstration, set status to SUCCESS
        // In a real application, integrate with a payment gateway
        payment.setPaymentStatus(PAYSTAT.SUCCESS);
        return paymentRepository.save(payment);
    }

    public List<PaymentDTO> getPaymentDetailsByProviderId(Long providerId) {
        return paymentRepository.findByProviderId(providerId).stream()
                .map(payment -> {
                    PaymentDTO dto = PaymentDTO.fromEntity(payment);
                    // Placeholder for customerName and serviceName
                    dto.setCustomerName(getCustomerNameForPayment(payment));
                    dto.setServiceName(getServiceNameForPayment(payment));
                    return dto;
                })
                .collect(Collectors.toList());
    }

    public BigDecimal getTotalEarningsByProviderId(Long providerId) {
        return paymentRepository.findByProviderId(providerId).stream()
                .filter(payment -> payment.getPaymentStatus() == PAYSTAT.SUCCESS)
                .map(Payment::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    // Placeholder for customerName
    private String getCustomerNameForPayment(Payment payment) {
        // Replace with actual logic (e.g., join with Booking and Customer)
        return "Customer_" + payment.getBookingId();
    }

    // Placeholder for serviceName
    private String getServiceNameForPayment(Payment payment) {
        // Replace with actual logic (e.g., join with Booking and Service)
        return "Service_" + payment.getBookingId();
    }
}