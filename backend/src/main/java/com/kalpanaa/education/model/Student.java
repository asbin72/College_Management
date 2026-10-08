package com.kalpanaa.education.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "students")
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String rollNo;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String name;

    private String department;
    private String course;
    private Integer semester = 1;
    private String section = "A";
    private String phone;
    private String gender;
    private LocalDate dob;
    private String bloodGroup;
    private String address;
    private String guardianName;
    private String guardianPhone;
    private Double gpa = 0.0;
    private Double attendancePercentage = 100.0;
    private String status = "Active";

    public Student() {}

    public Student(String rollNo, String email, String name, String department, String course, Integer semester) {
        this.rollNo = rollNo;
        this.email = email;
        this.name = name;
        this.department = department;
        this.course = course;
        this.semester = semester;
        this.status = "Active";
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getRollNo() { return rollNo; }
    public void setRollNo(String rollNo) { this.rollNo = rollNo; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
    public String getCourse() { return course; }
    public void setCourse(String course) { this.course = course; }
    public Integer getSemester() { return semester; }
    public void setSemester(Integer semester) { this.semester = semester; }
    public String getSection() { return section; }
    public void setSection(String section) { this.section = section; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }
    public LocalDate getDob() { return dob; }
    public void setDob(LocalDate dob) { this.dob = dob; }
    public String getBloodGroup() { return bloodGroup; }
    public void setBloodGroup(String bloodGroup) { this.bloodGroup = bloodGroup; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public String getGuardianName() { return guardianName; }
    public void setGuardianName(String guardianName) { this.guardianName = guardianName; }
    public String getGuardianPhone() { return guardianPhone; }
    public void setGuardianPhone(String guardianPhone) { this.guardianPhone = guardianPhone; }
    public Double getGpa() { return gpa; }
    public void setGpa(Double gpa) { this.gpa = gpa; }
    public Double getAttendancePercentage() { return attendancePercentage; }
    public void setAttendancePercentage(Double attendancePercentage) { this.attendancePercentage = attendancePercentage; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
