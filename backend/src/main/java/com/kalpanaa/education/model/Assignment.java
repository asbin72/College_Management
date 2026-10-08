package com.kalpanaa.education.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "assignments")
public class Assignment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String department;
    private String subjectCode;
    private String subjectName;
    private Integer semester;
    private LocalDate dueDate;
    private Double maxMarks = 20.0;
    private String teacherName;
    private String teacherId;
    private Integer submissionCount = 0;
    private LocalDateTime createdAt = LocalDateTime.now();

    public Assignment() {}

    public Assignment(String title, String description, String department, String subjectCode, String subjectName, LocalDate dueDate, String teacherName) {
        this.title = title;
        this.description = description;
        this.department = department;
        this.subjectCode = subjectCode;
        this.subjectName = subjectName;
        this.dueDate = dueDate;
        this.teacherName = teacherName;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
    public String getSubjectCode() { return subjectCode; }
    public void setSubjectCode(String subjectCode) { this.subjectCode = subjectCode; }
    public String getSubjectName() { return subjectName; }
    public void setSubjectName(String subjectName) { this.subjectName = subjectName; }
    public Integer getSemester() { return semester; }
    public void setSemester(Integer semester) { this.semester = semester; }
    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }
    public Double getMaxMarks() { return maxMarks; }
    public void setMaxMarks(Double maxMarks) { this.maxMarks = maxMarks; }
    public String getTeacherName() { return teacherName; }
    public void setTeacherName(String teacherName) { this.teacherName = teacherName; }
    public String getTeacherId() { return teacherId; }
    public void setTeacherId(String teacherId) { this.teacherId = teacherId; }
    public Integer getSubmissionCount() { return submissionCount; }
    public void setSubmissionCount(Integer submissionCount) { this.submissionCount = submissionCount; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
