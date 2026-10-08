package com.kalpanaa.education.service;

import com.kalpanaa.education.model.Student;
import java.util.List;

public interface StudentService {
    List<Student> getAllStudents(String department);
    Student getStudentById(Long id);
    Student getStudentByRollNo(String rollNo);
    Student createStudent(Student student);
    Student updateStudent(Long id, Student student);
    void deleteStudent(Long id);
}
