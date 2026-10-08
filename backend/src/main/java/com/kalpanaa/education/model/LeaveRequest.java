package com.kalpanaa.education.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "leave_requests")
public class LeaveRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String applicantEmail;

    private String applicantName;
    private String applicantRole; // "TEACHER" or "STUDENT"
    private String department;
    private String leaveType; // "Casual", "Medical", "Duty Leave", "Sick"
    private LocalDate startDate;
    private LocalDate endDate;
    private Integer totalDays = 1;
    private String reason;
    private String status = "Pending"; // "Pending", "Approved", "Rejected"
    private String reviewedBy;
    private String comments;
    private LocalDateTime appliedAt = LocalDateTime.now();

    public LeaveRequest() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getApplicantEmail() { return applicantEmail; }
    public void setApplicantEmail(String applicantEmail) { this.applicantEmail = applicantEmail; }
    public String getApplicantName() { return applicantName; }
    public void setApplicantName(String applicantName) { this.applicantName = applicantName; }
    public String getApplicantRole() { return applicantRole; }
    public void setApplicantRole(String applicantRole) { this.applicantRole = applicantRole; }
    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
    public String getLeaveType() { return leaveType; }
    public void setLeaveType(String leaveType) { this.leaveType = leaveType; }
    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }
    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }
    public Integer getTotalDays() { return totalDays; }
    public void setTotalDays(Integer totalDays) { this.totalDays = totalDays; }
    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getReviewedBy() { return reviewedBy; }
    public void setReviewedBy(String reviewedBy) { this.reviewedBy = reviewedBy; }
    public String getComments() { return comments; }
    public void setComments(String comments) { this.comments = comments; }
    public LocalDateTime getAppliedAt() { return appliedAt; }
    public void setAppliedAt(LocalDateTime appliedAt) { this.appliedAt = appliedAt; }
}
