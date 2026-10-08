package com.kalpanaa.education.controller;

import com.kalpanaa.education.dto.AuthDto.ApiResponse;
import com.kalpanaa.education.model.*;
import com.kalpanaa.education.repository.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class AcademicController {

    private final DepartmentRepository departmentRepository;
    private final CourseRepository courseRepository;
    private final SubjectRepository subjectRepository;

    public AcademicController(DepartmentRepository departmentRepository,
                              CourseRepository courseRepository,
                              SubjectRepository subjectRepository) {
        this.departmentRepository = departmentRepository;
        this.courseRepository = courseRepository;
        this.subjectRepository = subjectRepository;
    }

    // Departments
    @GetMapping("/departments")
    public ResponseEntity<?> getDepartments() {
        return ResponseEntity.ok(new ApiResponse<>(true, "Departments retrieved", departmentRepository.findAll()));
    }

    @PostMapping("/departments")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> createDepartment(@RequestBody Department department) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Department created", departmentRepository.save(department)));
    }

    // Courses
    @GetMapping("/courses")
    public ResponseEntity<?> getCourses(@RequestParam(required = false) String department) {
        if (department != null) {
            return ResponseEntity.ok(new ApiResponse<>(true, "Courses retrieved", courseRepository.findByDepartment(department)));
        }
        return ResponseEntity.ok(new ApiResponse<>(true, "Courses retrieved", courseRepository.findAll()));
    }

    @PostMapping("/courses")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> createCourse(@RequestBody Course course) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Course created", courseRepository.save(course)));
    }

    // Subjects
    @GetMapping("/subjects")
    public ResponseEntity<?> getSubjects(@RequestParam(required = false) String department,
                                         @RequestParam(required = false) Integer semester) {
        if (department != null && semester != null) {
            return ResponseEntity.ok(new ApiResponse<>(true, "Subjects retrieved", subjectRepository.findByDepartmentAndSemester(department, semester)));
        } else if (department != null) {
            return ResponseEntity.ok(new ApiResponse<>(true, "Subjects retrieved", subjectRepository.findByDepartment(department)));
        }
        return ResponseEntity.ok(new ApiResponse<>(true, "Subjects retrieved", subjectRepository.findAll()));
    }

    @PostMapping("/subjects")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> createSubject(@RequestBody Subject subject) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Subject created", subjectRepository.save(subject)));
    }
}
