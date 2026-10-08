package com.kalpanaa.education.repository;

import com.kalpanaa.education.model.Subject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubjectRepository extends JpaRepository<Subject, Long> {
    List<Subject> findByDepartment(String department);
    List<Subject> findByDepartmentAndSemester(String department, Integer semester);
}
