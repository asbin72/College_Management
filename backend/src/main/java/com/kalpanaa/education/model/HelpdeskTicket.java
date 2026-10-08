package com.kalpanaa.education.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "helpdesk_tickets")
public class HelpdeskTicket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String ticketId;

    @Column(nullable = false)
    private String subject;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String category; // "Academic", "Fee", "Hostel", "IT Support", "General"
    private String priority; // "Low", "Medium", "High", "Urgent"
    private String raisedByEmail;
    private String raisedByName;
    private String raisedByRole;
    private String status = "Open"; // "Open", "In Progress", "Resolved", "Closed"
    private String resolution;
    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime resolvedAt;

    public HelpdeskTicket() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTicketId() { return ticketId; }
    public void setTicketId(String ticketId) { this.ticketId = ticketId; }
    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }
    public String getRaisedByEmail() { return raisedByEmail; }
    public void setRaisedByEmail(String raisedByEmail) { this.raisedByEmail = raisedByEmail; }
    public String getRaisedByName() { return raisedByName; }
    public void setRaisedByName(String raisedByName) { this.raisedByName = raisedByName; }
    public String getRaisedByRole() { return raisedByRole; }
    public void setRaisedByRole(String raisedByRole) { this.raisedByRole = raisedByRole; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getResolution() { return resolution; }
    public void setResolution(String resolution) { this.resolution = resolution; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getResolvedAt() { return resolvedAt; }
    public void setResolvedAt(LocalDateTime resolvedAt) { this.resolvedAt = resolvedAt; }
}
