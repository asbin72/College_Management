package com.kalpanaa.education.repository;

import com.kalpanaa.education.model.Teacher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TeacherRepository extends JpaRepository<Teacher, Long> {
    Optional<Teacher> findByEmployeeId(String employeeId);
    Optional<Teacher> findByEmail(String email);
    List<Teacher> findByDepartment(String department);
    Boolean existsByEmployeeId(String employeeId);
}
