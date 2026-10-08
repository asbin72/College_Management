package com.kalpanaa.education.service.impl;

import com.kalpanaa.education.exception.ResourceNotFoundException;
import com.kalpanaa.education.model.Teacher;
import com.kalpanaa.education.repository.TeacherRepository;
import com.kalpanaa.education.service.TeacherService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class TeacherServiceImpl implements TeacherService {

    private final TeacherRepository teacherRepository;

    public TeacherServiceImpl(TeacherRepository teacherRepository) {
        this.teacherRepository = teacherRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Teacher> getAllTeachers(String department) {
        if (department != null && !department.isBlank()) {
            return teacherRepository.findByDepartment(department);
        }
        return teacherRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Teacher getTeacherById(Long id) {
        return teacherRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found with ID: " + id));
    }

    @Override
    public Teacher createTeacher(Teacher teacher) {
        if (teacherRepository.existsByEmployeeId(teacher.getEmployeeId())) {
            throw new IllegalArgumentException("Teacher employee ID already exists: " + teacher.getEmployeeId());
        }
        return teacherRepository.save(teacher);
    }

    @Override
    public Teacher updateTeacher(Long id, Teacher updated) {
        Teacher teacher = getTeacherById(id);
        if (updated.getName() != null) teacher.setName(updated.getName());
        if (updated.getPhone() != null) teacher.setPhone(updated.getPhone());
        if (updated.getDepartment() != null) teacher.setDepartment(updated.getDepartment());
        if (updated.getDesignation() != null) teacher.setDesignation(updated.getDesignation());
        if (updated.getQualification() != null) teacher.setQualification(updated.getQualification());
        if (updated.getExperienceYears() != null) teacher.setExperienceYears(updated.getExperienceYears());
        if (updated.getCabinRoom() != null) teacher.setCabinRoom(updated.getCabinRoom());
        if (updated.getSubjectsHandled() != null) teacher.setSubjectsHandled(updated.getSubjectsHandled());
        if (updated.getStatus() != null) teacher.setStatus(updated.getStatus());
        return teacherRepository.save(teacher);
    }

    @Override
    public void deleteTeacher(Long id) {
        Teacher teacher = getTeacherById(id);
        teacherRepository.delete(teacher);
    }
}
