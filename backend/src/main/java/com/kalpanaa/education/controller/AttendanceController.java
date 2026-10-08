package com.kalpanaa.education.controller;

import com.kalpanaa.education.dto.AuthDto.ApiResponse;
import com.kalpanaa.education.model.AttendanceLog;
import com.kalpanaa.education.repository.AttendanceLogRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/attendance")
public class AttendanceController {

    private final AttendanceLogRepository attendanceLogRepository;

    public AttendanceController(AttendanceLogRepository attendanceLogRepository) {
        this.attendanceLogRepository = attendanceLogRepository;
    }

    @GetMapping
    public ResponseEntity<?> getAttendance(
            @RequestParam(required = false) String studentRollNo,
            @RequestParam(required = false) String department,
            @RequestParam(required = false) String subjectCode,
            @RequestParam(required = false) String date) {

        if (studentRollNo != null) {
            List<AttendanceLog> logs = attendanceLogRepository.findByStudentRollNo(studentRollNo);
            return ResponseEntity.ok(new ApiResponse<>(true, "Attendance logs retrieved", logs));
        }

        if (department != null && subjectCode != null && date != null) {
            LocalDate logDate = LocalDate.parse(date);
            List<AttendanceLog> logs = attendanceLogRepository.findByDepartmentAndSubjectCodeAndDate(department, subjectCode, logDate);
            return ResponseEntity.ok(new ApiResponse<>(true, "Class attendance retrieved", logs));
        }

        return ResponseEntity.ok(new ApiResponse<>(true, "Attendance records", attendanceLogRepository.findAll()));
    }

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_TEACHER')")
    public ResponseEntity<?> markAttendance(@RequestBody AttendanceLog log) {
        if (log.getDate() == null) {
            log.setDate(LocalDate.now());
        }
        AttendanceLog saved = attendanceLogRepository.save(log);
        return ResponseEntity.ok(new ApiResponse<>(true, "Attendance marked successfully", saved));
    }

    @PostMapping("/bulk")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_TEACHER')")
    public ResponseEntity<?> markBulkAttendance(@RequestBody List<AttendanceLog> logs) {
        for (AttendanceLog log : logs) {
            if (log.getDate() == null) {
                log.setDate(LocalDate.now());
            }
        }
        List<AttendanceLog> savedList = attendanceLogRepository.saveAll(logs);
        return ResponseEntity.ok(new ApiResponse<>(true, "Bulk attendance saved (" + savedList.size() + " records)", savedList));
    }
}
