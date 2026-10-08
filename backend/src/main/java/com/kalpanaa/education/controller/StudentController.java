package com.kalpanaa.education.controller;

import com.kalpanaa.education.dto.AuthDto.ApiResponse;
import com.kalpanaa.education.model.Student;
import com.kalpanaa.education.repository.StudentRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/students")
public class StudentController {

    private final StudentRepository studentRepository;

    public StudentController(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    @GetMapping
    public ResponseEntity<?> getAllStudents(@RequestParam(required = false) String department) {
        List<Student> students = department != null ?
                studentRepository.findByDepartment(department) :
                studentRepository.findAll();
        return ResponseEntity.ok(new ApiResponse<>(true, "Students retrieved", students));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getStudentById(@PathVariable Long id) {
        return studentRepository.findById(id)
                .map(student -> ResponseEntity.ok(new ApiResponse<>(true, "Student found", student)))
                .orElse(ResponseEntity.status(404).body(new ApiResponse<>(false, "Student not found", null)));
    }

    @GetMapping("/roll/{rollNo}")
    public ResponseEntity<?> getStudentByRollNo(@PathVariable String rollNo) {
        return studentRepository.findByRollNo(rollNo)
                .map(student -> ResponseEntity.ok(new ApiResponse<>(true, "Student found", student)))
                .orElse(ResponseEntity.status(404).body(new ApiResponse<>(false, "Student not found", null)));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> createStudent(@RequestBody Student student) {
        if (studentRepository.existsByRollNo(student.getRollNo())) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, "Roll number already exists", null));
        }
        Student saved = studentRepository.save(student);
        return ResponseEntity.ok(new ApiResponse<>(true, "Student created successfully", saved));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_STUDENT')")
    public ResponseEntity<?> updateStudent(@PathVariable Long id, @RequestBody Student updated) {
        return studentRepository.findById(id)
                .map(student -> {
                    student.setName(updated.getName() != null ? updated.getName() : student.getName());
                    student.setPhone(updated.getPhone() != null ? updated.getPhone() : student.getPhone());
                    student.setAddress(updated.getAddress() != null ? updated.getAddress() : student.getAddress());
                    student.setBloodGroup(updated.getBloodGroup() != null ? updated.getBloodGroup() : student.getBloodGroup());
                    student.setGuardianName(updated.getGuardianName() != null ? updated.getGuardianName() : student.getGuardianName());
                    student.setGuardianPhone(updated.getGuardianPhone() != null ? updated.getGuardianPhone() : student.getGuardianPhone());
                    student.setDepartment(updated.getDepartment() != null ? updated.getDepartment() : student.getDepartment());
                    student.setCourse(updated.getCourse() != null ? updated.getCourse() : student.getCourse());
                    student.setSemester(updated.getSemester() != null ? updated.getSemester() : student.getSemester());
                    student.setStatus(updated.getStatus() != null ? updated.getStatus() : student.getStatus());
                    Student saved = studentRepository.save(student);
                    return ResponseEntity.ok(new ApiResponse<>(true, "Student updated successfully", saved));
                })
                .orElse(ResponseEntity.status(404).body(new ApiResponse<>(false, "Student not found", null)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> deleteStudent(@PathVariable Long id) {
        if (studentRepository.existsById(id)) {
            studentRepository.deleteById(id);
            return ResponseEntity.ok(new ApiResponse<>(true, "Student deleted successfully", null));
        }
        return ResponseEntity.status(404).body(new ApiResponse<>(false, "Student not found", null));
    }
}
