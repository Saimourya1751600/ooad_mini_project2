package com.urbanconnect.dto;

import com.urbanconnect.entity.PAYMENTMETHOD;
import com.urbanconnect.entity.PAYSTAT;
import com.urbanconnect.entity.Payment;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentDTO {
    private Integer paymentId; // Changed to Integer
    private Integer bookingId;
    private BigDecimal amount;
    private String paymentMethod;
    private String paymentStatus;
    private LocalDateTime transactionDate;
    private String customerName;
    private String serviceName;

    public Payment toEntity() {
        Payment payment = new Payment();
        payment.setBookingId(this.bookingId);
        payment.setAmount(this.amount);
        if (this.paymentMethod != null) {
            payment.setPaymentMethod(PAYMENTMETHOD.valueOf(this.paymentMethod));
        }
        if (this.paymentStatus != null) {
            payment.setPaymentStatus(PAYSTAT.valueOf(this.paymentStatus.toUpperCase()));
        } else {
            payment.setPaymentStatus(PAYSTAT.PENDING);
        }
        payment.setTransactionDate(this.transactionDate);
        return payment;
    }

    public static PaymentDTO fromEntity(Payment payment) {
        return new PaymentDTO(
                payment.getPaymentId(),
                payment.getBookingId(),
                payment.getAmount(),
                payment.getPaymentMethod() != null ? payment.getPaymentMethod().name() : null,
                payment.getPaymentStatus() != null ? payment.getPaymentStatus().name() : null,
                payment.getTransactionDate(),
                null,
                null
        );
    }
}