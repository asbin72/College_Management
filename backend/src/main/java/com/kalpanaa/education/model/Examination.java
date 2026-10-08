package com.kalpanaa.education.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "examinations")
public class Examination {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String examName; // e.g. "Mid-Term Assessment 2026", "Semester Final Exam"

    private String examType; // "Internal", "Final", "Practical"
    private String department;
    private Integer semester;
    private String academicYear = "2025-2026";
    private LocalDate startDate;
    private LocalDate endDate;
    private String status = "Scheduled"; // "Scheduled", "Ongoing", "Completed", "Published"

    public Examination() {}

    public Examination(String examName, String examType, String department, Integer semester, LocalDate startDate, LocalDate endDate) {
        this.examName = examName;
        this.examType = examType;
        this.department = department;
        this.semester = semester;
        this.startDate = startDate;
        this.endDate = endDate;
        this.status = "Scheduled";
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getExamName() { return examName; }
    public void setExamName(String examName) { this.examName = examName; }
    public String getExamType() { return examType; }
    public void setExamType(String examType) { this.examType = examType; }
    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
    public Integer getSemester() { return semester; }
    public void setSemester(Integer semester) { this.semester = semester; }
    public String getAcademicYear() { return academicYear; }
    public void setAcademicYear(String academicYear) { this.academicYear = academicYear; }
    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }
    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
