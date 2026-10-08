package com.kalpanaa.education.repository;

import com.kalpanaa.education.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    Optional<Student> findByRollNo(String rollNo);
    Optional<Student> findByEmail(String email);
    List<Student> findByDepartment(String department);
    List<Student> findByDepartmentAndSemester(String department, Integer semester);
    Boolean existsByRollNo(String rollNo);
    Boolean existsByEmail(String email);
}
