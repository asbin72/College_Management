package com.kalpanaa.education.repository;

import com.kalpanaa.education.model.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

public interface AcademicRepositories {

    @Repository
    interface ExaminationRepository extends JpaRepository<Examination, Long> {
        List<Examination> findByDepartment(String department);
    }

    @Repository
    interface MarkRepository extends JpaRepository<Mark, Long> {
        List<Mark> findByStudentRollNo(String studentRollNo);
        List<Mark> findByExamNameAndSubjectCode(String examName, String subjectCode);
    }

    @Repository
    interface AssignmentRepository extends JpaRepository<Assignment, Long> {
        List<Assignment> findByDepartmentAndSubjectCode(String department, String subjectCode);
        List<Assignment> findByDepartment(String department);
    }

    @Repository
    interface FeePaymentRepository extends JpaRepository<FeePayment, Long> {
        List<FeePayment> findByStudentRollNo(String studentRollNo);
    }

    @Repository
    interface AdmissionApplicationRepository extends JpaRepository<AdmissionApplication, Long> {
        List<AdmissionApplication> findByStatus(String status);
    }

    @Repository
    interface HelpdeskTicketRepository extends JpaRepository<HelpdeskTicket, Long> {
        List<HelpdeskTicket> findByRaisedByEmail(String raisedByEmail);
        List<HelpdeskTicket> findByStatus(String status);
    }

    @Repository
    interface LeaveRequestRepository extends JpaRepository<LeaveRequest, Long> {
        List<LeaveRequest> findByApplicantEmail(String applicantEmail);
        List<LeaveRequest> findByStatus(String status);
    }
}
