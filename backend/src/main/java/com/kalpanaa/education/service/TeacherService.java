package com.kalpanaa.education.service;

import com.kalpanaa.education.model.Teacher;
import java.util.List;

public interface TeacherService {
    List<Teacher> getAllTeachers(String department);
    Teacher getTeacherById(Long id);
    Teacher createTeacher(Teacher teacher);
    Teacher updateTeacher(Long id, Teacher teacher);
    void deleteTeacher(Long id);
}
