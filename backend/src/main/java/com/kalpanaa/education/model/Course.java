package com.kalpanaa.education.model;

import jakarta.persistence.*;

@Entity
@Table(name = "courses")
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String code; // e.g. "BTECH-CSE"

    @Column(nullable = false)
    private String name;

    private String department;
    private Integer durationYears = 4;
    private Integer totalSemesters = 8;
    private Double annualFee = 75000.0;
    private Integer intakeCapacity = 120;

    public Course() {}

    public Course(String code, String name, String department, Integer durationYears, Integer totalSemesters, Double annualFee) {
        this.code = code;
        this.name = name;
        this.department = department;
        this.durationYears = durationYears;
        this.totalSemesters = totalSemesters;
        this.annualFee = annualFee;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
    public Integer getDurationYears() { return durationYears; }
    public void setDurationYears(Integer durationYears) { this.durationYears = durationYears; }
    public Integer getTotalSemesters() { return totalSemesters; }
    public void setTotalSemesters(Integer totalSemesters) { this.totalSemesters = totalSemesters; }
    public Double getAnnualFee() { return annualFee; }
    public void setAnnualFee(Double annualFee) { this.annualFee = annualFee; }
    public Integer getIntakeCapacity() { return intakeCapacity; }
    public void setIntakeCapacity(Integer intakeCapacity) { this.intakeCapacity = intakeCapacity; }
}
