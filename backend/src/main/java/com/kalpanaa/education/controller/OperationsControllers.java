package com.kalpanaa.education.controller;

import com.kalpanaa.education.dto.AuthDto.ApiResponse;
import com.kalpanaa.education.model.*;
import com.kalpanaa.education.repository.AcademicRepositories.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api")
public class OperationsControllers {

    private final ExaminationRepository examinationRepository;
    private final MarkRepository markRepository;
    private final AssignmentRepository assignmentRepository;
    private final FeePaymentRepository feePaymentRepository;
    private final AdmissionApplicationRepository admissionRepository;
    private final HelpdeskTicketRepository helpdeskRepository;
    private final LeaveRequestRepository leaveRepository;

    public OperationsControllers(ExaminationRepository examinationRepository,
                                 MarkRepository markRepository,
                                 AssignmentRepository assignmentRepository,
                                 FeePaymentRepository feePaymentRepository,
                                 AdmissionApplicationRepository admissionRepository,
                                 HelpdeskTicketRepository helpdeskRepository,
                                 LeaveRequestRepository leaveRepository) {
        this.examinationRepository = examinationRepository;
        this.markRepository = markRepository;
        this.assignmentRepository = assignmentRepository;
        this.feePaymentRepository = feePaymentRepository;
        this.admissionRepository = admissionRepository;
        this.helpdeskRepository = helpdeskRepository;
        this.leaveRepository = leaveRepository;
    }

    // Health
    @GetMapping("/health")
    public ResponseEntity<?> checkHealth() {
        Map<String, Object> health = new HashMap<>();
        health.put("status", "UP");
        health.put("service", "Kalpanaaa Education Spring Boot 3 Backend");
        health.put("javaVersion", System.getProperty("java.version"));
        health.put("timestamp", System.currentTimeMillis());
        return ResponseEntity.ok(health);
    }

    // Examinations
    @GetMapping("/examinations")
    public ResponseEntity<?> getExaminations() {
        return ResponseEntity.ok(new ApiResponse<>(true, "Examinations", examinationRepository.findAll()));
    }

    @PostMapping("/examinations")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> createExam(@RequestBody Examination exam) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Examination scheduled", examinationRepository.save(exam)));
    }

    // Marks
    @GetMapping("/marks")
    public ResponseEntity<?> getMarks(@RequestParam(required = false) String studentRollNo) {
        if (studentRollNo != null) {
            return ResponseEntity.ok(new ApiResponse<>(true, "Student marks", markRepository.findByStudentRollNo(studentRollNo)));
        }
        return ResponseEntity.ok(new ApiResponse<>(true, "All marks", markRepository.findAll()));
    }

    @PostMapping("/marks")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_TEACHER')")
    public ResponseEntity<?> enterMark(@RequestBody Mark mark) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Marks recorded", markRepository.save(mark)));
    }

    // Assignments
    @GetMapping("/assignments")
    public ResponseEntity<?> getAssignments(@RequestParam(required = false) String department) {
        if (department != null) {
            return ResponseEntity.ok(new ApiResponse<>(true, "Assignments", assignmentRepository.findByDepartment(department)));
        }
        return ResponseEntity.ok(new ApiResponse<>(true, "Assignments", assignmentRepository.findAll()));
    }

    @PostMapping("/assignments")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_TEACHER')")
    public ResponseEntity<?> createAssignment(@RequestBody Assignment assignment) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Assignment created", assignmentRepository.save(assignment)));
    }

    // Fees
    @GetMapping("/fees")
    public ResponseEntity<?> getFees(@RequestParam(required = false) String studentRollNo) {
        if (studentRollNo != null) {
            return ResponseEntity.ok(new ApiResponse<>(true, "Fee records", feePaymentRepository.findByStudentRollNo(studentRollNo)));
        }
        return ResponseEntity.ok(new ApiResponse<>(true, "All fee payments", feePaymentRepository.findAll()));
    }

    @PostMapping("/fees/pay")
    public ResponseEntity<?> processFeePayment(@RequestBody FeePayment payment) {
        if (payment.getTransactionId() == null || payment.getTransactionId().isBlank()) {
            payment.setTransactionId("TXN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        }
        payment.setStatus("Success");
        return ResponseEntity.ok(new ApiResponse<>(true, "Fee payment processed successfully", feePaymentRepository.save(payment)));
    }

    // Admissions
    @GetMapping("/admissions")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> getAdmissions() {
        return ResponseEntity.ok(new ApiResponse<>(true, "Admission applications", admissionRepository.findAll()));
    }

    @PostMapping("/admissions/apply")
    public ResponseEntity<?> applyAdmission(@RequestBody AdmissionApplication app) {
        app.setApplicationNumber("APP-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        app.setStatus("Pending");
        return ResponseEntity.ok(new ApiResponse<>(true, "Application submitted successfully", admissionRepository.save(app)));
    }

    // Helpdesk
    @GetMapping("/helpdesk")
    public ResponseEntity<?> getHelpdeskTickets(@RequestParam(required = false) String email) {
        if (email != null) {
            return ResponseEntity.ok(new ApiResponse<>(true, "Tickets", helpdeskRepository.findByRaisedByEmail(email)));
        }
        return ResponseEntity.ok(new ApiResponse<>(true, "All tickets", helpdeskRepository.findAll()));
    }

    @PostMapping("/helpdesk")
    public ResponseEntity<?> createTicket(@RequestBody HelpdeskTicket ticket) {
        ticket.setTicketId("TICK-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase());
        ticket.setStatus("Open");
        return ResponseEntity.ok(new ApiResponse<>(true, "Ticket raised", helpdeskRepository.save(ticket)));
    }

    // Leave Requests
    @GetMapping("/leave-requests")
    public ResponseEntity<?> getLeaveRequests(@RequestParam(required = false) String email) {
        if (email != null) {
            return ResponseEntity.ok(new ApiResponse<>(true, "Leave requests", leaveRepository.findByApplicantEmail(email)));
        }
        return ResponseEntity.ok(new ApiResponse<>(true, "All leave requests", leaveRepository.findAll()));
    }

    @PostMapping("/leave-requests")
    public ResponseEntity<?> applyLeave(@RequestBody LeaveRequest request) {
        request.setStatus("Pending");
        return ResponseEntity.ok(new ApiResponse<>(true, "Leave application submitted", leaveRepository.save(request)));
    }
}
