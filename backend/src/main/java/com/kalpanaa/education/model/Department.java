package com.kalpanaa.education.model;

import jakarta.persistence.*;

@Entity
@Table(name = "departments")
public class Department {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String code; // e.g. "CSE", "ECE"

    @Column(nullable = false)
    private String name;

    private String hod;
    private String email;
    private String phone;
    private Integer totalFaculty = 0;
    private Integer totalStudents = 0;

    public Department() {}

    public Department(String code, String name, String hod, String email, String phone) {
        this.code = code;
        this.name = name;
        this.hod = hod;
        this.email = email;
        this.phone = phone;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getHod() { return hod; }
    public void setHod(String hod) { this.hod = hod; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public Integer getTotalFaculty() { return totalFaculty; }
    public void setTotalFaculty(Integer totalFaculty) { this.totalFaculty = totalFaculty; }
    public Integer getTotalStudents() { return totalStudents; }
    public void setTotalStudents(Integer totalStudents) { this.totalStudents = totalStudents; }
}
