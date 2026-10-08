package com.kalpanaa.education.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "admission_applications")
public class AdmissionApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String applicationNumber;

    @Column(nullable = false)
    private String fullName;

    @Column(nullable = false)
    private String email;

    private String phone;
    private String department;
    private String course;
    private Double qualifyingPercentage;
    private String previousInstitution;
    private String status = "Pending"; // "Pending", "Approved", "Rejected", "Under Review"
    private String remarks;
    private LocalDateTime appliedAt = LocalDateTime.now();

    public AdmissionApplication() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getApplicationNumber() { return applicationNumber; }
    public void setApplicationNumber(String applicationNumber) { this.applicationNumber = applicationNumber; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
    public String getCourse() { return course; }
    public void setCourse(String course) { this.course = course; }
    public Double getQualifyingPercentage() { return qualifyingPercentage; }
    public void setQualifyingPercentage(Double qualifyingPercentage) { this.qualifyingPercentage = qualifyingPercentage; }
    public String getPreviousInstitution() { return previousInstitution; }
    public void setPreviousInstitution(String previousInstitution) { this.previousInstitution = previousInstitution; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
    public LocalDateTime getAppliedAt() { return appliedAt; }
    public void setAppliedAt(LocalDateTime appliedAt) { this.appliedAt = appliedAt; }
}
