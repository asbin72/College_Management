package com.kalpanaa.education.repository;

import com.kalpanaa.education.model.AttendanceLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AttendanceLogRepository extends JpaRepository<AttendanceLog, Long> {
    List<AttendanceLog> findByStudentRollNo(String studentRollNo);
    List<AttendanceLog> findByDepartmentAndSubjectCodeAndDate(String department, String subjectCode, LocalDate date);
    List<AttendanceLog> findByDate(LocalDate date);
}
