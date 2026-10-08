package com.kalpanaa.education.service.impl;

import com.kalpanaa.education.exception.ResourceNotFoundException;
import com.kalpanaa.education.model.Student;
import com.kalpanaa.education.repository.StudentRepository;
import com.kalpanaa.education.service.StudentService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class StudentServiceImpl implements StudentService {

    private final StudentRepository studentRepository;

    public StudentServiceImpl(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Student> getAllStudents(String department) {
        if (department != null && !department.isBlank()) {
            return studentRepository.findByDepartment(department);
        }
        return studentRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Student getStudentById(Long id) {
        return studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + id));
    }

    @Override
    @Transactional(readOnly = true)
    public Student getStudentByRollNo(String rollNo) {
        return studentRepository.findByRollNo(rollNo)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with Roll Number: " + rollNo));
    }

    @Override
    public Student createStudent(Student student) {
        if (studentRepository.existsByRollNo(student.getRollNo())) {
            throw new IllegalArgumentException("Student roll number already exists: " + student.getRollNo());
        }
        return studentRepository.save(student);
    }

    @Override
    public Student updateStudent(Long id, Student updated) {
        Student student = getStudentById(id);
        if (updated.getName() != null) student.setName(updated.getName());
        if (updated.getPhone() != null) student.setPhone(updated.getPhone());
        if (updated.getAddress() != null) student.setAddress(updated.getAddress());
        if (updated.getBloodGroup() != null) student.setBloodGroup(updated.getBloodGroup());
        if (updated.getGuardianName() != null) student.setGuardianName(updated.getGuardianName());
        if (updated.getGuardianPhone() != null) student.setGuardianPhone(updated.getGuardianPhone());
        if (updated.getDepartment() != null) student.setDepartment(updated.getDepartment());
        if (updated.getCourse() != null) student.setCourse(updated.getCourse());
        if (updated.getSemester() != null) student.setSemester(updated.getSemester());
        if (updated.getStatus() != null) student.setStatus(updated.getStatus());
        return studentRepository.save(student);
    }

    @Override
    public void deleteStudent(Long id) {
        Student student = getStudentById(id);
        studentRepository.delete(student);
    }
}
