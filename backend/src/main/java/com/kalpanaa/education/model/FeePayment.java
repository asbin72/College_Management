package com.kalpanaa.education.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "fee_payments")
public class FeePayment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String transactionId;

    @Column(nullable = false)
    private String studentRollNo;

    private String studentName;
    private String department;
    private String feeType; // "Tuition Fee", "Examination Fee", "Library Fee", "Hostel Fee"
    private Double amount;
    private String paymentMethod; // "Credit Card", "UPI", "Net Banking", "Cash"
    private String status; // "Success", "Pending", "Failed"
    private LocalDate paymentDate;
    private LocalDateTime timestamp = LocalDateTime.now();

    public FeePayment() {}

    public FeePayment(String transactionId, String studentRollNo, String studentName, String feeType, Double amount, String paymentMethod, String status) {
        this.transactionId = transactionId;
        this.studentRollNo = studentRollNo;
        this.studentName = studentName;
        this.feeType = feeType;
        this.amount = amount;
        this.paymentMethod = paymentMethod;
        this.status = status;
        this.paymentDate = LocalDate.now();
        this.timestamp = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTransactionId() { return transactionId; }
    public void setTransactionId(String transactionId) { this.transactionId = transactionId; }
    public String getStudentRollNo() { return studentRollNo; }
    public void setStudentRollNo(String studentRollNo) { this.studentRollNo = studentRollNo; }
    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }
    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
    public String getFeeType() { return feeType; }
    public void setFeeType(String feeType) { this.feeType = feeType; }
    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }
    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public LocalDate getPaymentDate() { return paymentDate; }
    public void setPaymentDate(LocalDate paymentDate) { this.paymentDate = paymentDate; }
    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}
