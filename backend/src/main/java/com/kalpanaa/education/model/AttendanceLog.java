package com.kalpanaa.education.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "attendance_logs")
public class AttendanceLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String studentRollNo;

    private String studentName;
    private String department;
    private String subjectCode;
    private String subjectName;
    private Integer semester;
    private String section;
    private LocalDate date;
    private String period; // e.g. "Period 1 (09:00 - 10:00)"
    private String status; // "Present", "Absent", "Late", "On Leave"
    private String markedBy;
    private LocalDateTime timestamp = LocalDateTime.now();

    public AttendanceLog() {}

    public AttendanceLog(String studentRollNo, String studentName, String department, String subjectCode, LocalDate date, String status, String markedBy) {
        this.studentRollNo = studentRollNo;
        this.studentName = studentName;
        this.department = department;
        this.subjectCode = subjectCode;
        this.date = date;
        this.status = status;
        this.markedBy = markedBy;
        this.timestamp = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getStudentRollNo() { return studentRollNo; }
    public void setStudentRollNo(String studentRollNo) { this.studentRollNo = studentRollNo; }
    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }
    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
    public String getSubjectCode() { return subjectCode; }
    public void setSubjectCode(String subjectCode) { this.subjectCode = subjectCode; }
    public String getSubjectName() { return subjectName; }
    public void setSubjectName(String subjectName) { this.subjectName = subjectName; }
    public Integer getSemester() { return semester; }
    public void setSemester(Integer semester) { this.semester = semester; }
    public String getSection() { return section; }
    public void setSection(String section) { this.section = section; }
    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }
    public String getPeriod() { return period; }
    public void setPeriod(String period) { this.period = period; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getMarkedBy() { return markedBy; }
    public void setMarkedBy(String markedBy) { this.markedBy = markedBy; }
    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}
