package com.kalpanaa.education.model;

import jakarta.persistence.*;

@Entity
@Table(name = "marks")
public class Mark {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String studentRollNo;

    private String studentName;
    private String examName;
    private String subjectCode;
    private String subjectName;
    private Double marksObtained = 0.0;
    private Double maxMarks = 100.0;
    private String grade; // "A+", "A", "B", "C", "F"
    private String remarks;

    public Mark() {}

    public Mark(String studentRollNo, String studentName, String examName, String subjectCode, String subjectName, Double marksObtained, Double maxMarks) {
        this.studentRollNo = studentRollNo;
        this.studentName = studentName;
        this.examName = examName;
        this.subjectCode = subjectCode;
        this.subjectName = subjectName;
        this.marksObtained = marksObtained;
        this.maxMarks = maxMarks;
        this.grade = calculateGrade(marksObtained, maxMarks);
    }

    public static String calculateGrade(Double obtained, Double max) {
        if (obtained == null || max == null || max == 0) return "F";
        double pct = (obtained / max) * 100.0;
        if (pct >= 90) return "A+";
        if (pct >= 80) return "A";
        if (pct >= 70) return "B";
        if (pct >= 60) return "C";
        if (pct >= 50) return "D";
        return "F";
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getStudentRollNo() { return studentRollNo; }
    public void setStudentRollNo(String studentRollNo) { this.studentRollNo = studentRollNo; }
    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }
    public String getExamName() { return examName; }
    public void setExamName(String examName) { this.examName = examName; }
    public String getSubjectCode() { return subjectCode; }
    public void setSubjectCode(String subjectCode) { this.subjectCode = subjectCode; }
    public String getSubjectName() { return subjectName; }
    public void setSubjectName(String subjectName) { this.subjectName = subjectName; }
    public Double getMarksObtained() { return marksObtained; }
    public void setMarksObtained(Double marksObtained) {
        this.marksObtained = marksObtained;
        this.grade = calculateGrade(marksObtained, this.maxMarks);
    }
    public Double getMaxMarks() { return maxMarks; }
    public void setMaxMarks(Double maxMarks) {
        this.maxMarks = maxMarks;
        this.grade = calculateGrade(this.marksObtained, maxMarks);
    }
    public String getGrade() { return grade; }
    public void setGrade(String grade) { this.grade = grade; }
    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
}
