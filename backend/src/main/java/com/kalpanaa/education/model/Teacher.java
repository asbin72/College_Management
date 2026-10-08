package com.kalpanaa.education.model;

import jakarta.persistence.*;

@Entity
@Table(name = "teachers")
public class Teacher {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String employeeId;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String name;

    private String department;
    private String designation; // e.g. "Associate Professor", "Assistant Professor", "HOD"
    private String qualification; // e.g. "Ph.D. in Computer Science"
    private String experienceYears;
    private String phone;
    private String cabinRoom;
    private String subjectsHandled;
    private String status = "Active";

    public Teacher() {}

    public Teacher(String employeeId, String email, String name, String department, String designation, String qualification) {
        this.employeeId = employeeId;
        this.email = email;
        this.name = name;
        this.department = department;
        this.designation = designation;
        this.qualification = qualification;
        this.status = "Active";
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getEmployeeId() { return employeeId; }
    public void setEmployeeId(String employeeId) { this.employeeId = employeeId; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
    public String getDesignation() { return designation; }
    public void setDesignation(String designation) { this.designation = designation; }
    public String getQualification() { return qualification; }
    public void setQualification(String qualification) { this.qualification = qualification; }
    public String getExperienceYears() { return experienceYears; }
    public void setExperienceYears(String experienceYears) { this.experienceYears = experienceYears; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getCabinRoom() { return cabinRoom; }
    public void setCabinRoom(String cabinRoom) { this.cabinRoom = cabinRoom; }
    public String getSubjectsHandled() { return subjectsHandled; }
    public void setSubjectsHandled(String subjectsHandled) { this.subjectsHandled = subjectsHandled; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
