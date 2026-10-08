package com.kalpanaa.education.controller;

import com.kalpanaa.education.dto.AuthDto.ApiResponse;
import com.kalpanaa.education.model.Teacher;
import com.kalpanaa.education.repository.TeacherRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/teachers")
public class TeacherController {

    private final TeacherRepository teacherRepository;

    public TeacherController(TeacherRepository teacherRepository) {
        this.teacherRepository = teacherRepository;
    }

    @GetMapping
    public ResponseEntity<?> getAllTeachers(@RequestParam(required = false) String department) {
        List<Teacher> teachers = department != null ?
                teacherRepository.findByDepartment(department) :
                teacherRepository.findAll();
        return ResponseEntity.ok(new ApiResponse<>(true, "Teachers retrieved", teachers));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getTeacherById(@PathVariable Long id) {
        return teacherRepository.findById(id)
                .map(teacher -> ResponseEntity.ok(new ApiResponse<>(true, "Teacher found", teacher)))
                .orElse(ResponseEntity.status(404).body(new ApiResponse<>(false, "Teacher not found", null)));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> createTeacher(@RequestBody Teacher teacher) {
        if (teacherRepository.existsByEmployeeId(teacher.getEmployeeId())) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, "Employee ID already exists", null));
        }
        Teacher saved = teacherRepository.save(teacher);
        return ResponseEntity.ok(new ApiResponse<>(true, "Teacher created successfully", saved));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_TEACHER')")
    public ResponseEntity<?> updateTeacher(@PathVariable Long id, @RequestBody Teacher updated) {
        return teacherRepository.findById(id)
                .map(teacher -> {
                    teacher.setName(updated.getName() != null ? updated.getName() : teacher.getName());
                    teacher.setPhone(updated.getPhone() != null ? updated.getPhone() : teacher.getPhone());
                    teacher.setDepartment(updated.getDepartment() != null ? updated.getDepartment() : teacher.getDepartment());
                    teacher.setDesignation(updated.getDesignation() != null ? updated.getDesignation() : teacher.getDesignation());
                    teacher.setQualification(updated.getQualification() != null ? updated.getQualification() : teacher.getQualification());
                    teacher.setExperienceYears(updated.getExperienceYears() != null ? updated.getExperienceYears() : teacher.getExperienceYears());
                    teacher.setCabinRoom(updated.getCabinRoom() != null ? updated.getCabinRoom() : teacher.getCabinRoom());
                    teacher.setSubjectsHandled(updated.getSubjectsHandled() != null ? updated.getSubjectsHandled() : teacher.getSubjectsHandled());
                    teacher.setStatus(updated.getStatus() != null ? updated.getStatus() : teacher.getStatus());
                    Teacher saved = teacherRepository.save(teacher);
                    return ResponseEntity.ok(new ApiResponse<>(true, "Teacher updated successfully", saved));
                })
                .orElse(ResponseEntity.status(404).body(new ApiResponse<>(false, "Teacher not found", null)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> deleteTeacher(@PathVariable Long id) {
        if (teacherRepository.existsById(id)) {
            teacherRepository.deleteById(id);
            return ResponseEntity.ok(new ApiResponse<>(true, "Teacher deleted successfully", null));
        }
        return ResponseEntity.status(404).body(new ApiResponse<>(false, "Teacher not found", null));
    }
}
