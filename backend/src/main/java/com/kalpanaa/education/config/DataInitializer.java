package com.kalpanaa.education.config;

import com.kalpanaa.education.model.*;
import com.kalpanaa.education.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final TeacherRepository teacherRepository;
    private final DepartmentRepository departmentRepository;
    private final CourseRepository courseRepository;
    private final SubjectRepository subjectRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
                           StudentRepository studentRepository,
                           TeacherRepository teacherRepository,
                           DepartmentRepository departmentRepository,
                           CourseRepository courseRepository,
                           SubjectRepository subjectRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.studentRepository = studentRepository;
        this.teacherRepository = teacherRepository;
        this.departmentRepository = departmentRepository;
        this.courseRepository = courseRepository;
        this.subjectRepository = subjectRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            return; // already initialized
        }

        // 1. Seed Departments
        Department cse = new Department("CSE", "Computer Science & Engineering", "Dr. Alan Turing", "cse@kalpanaaa.edu", "+91 98765 43210");
        cse.setTotalFaculty(18);
        cse.setTotalStudents(480);
        departmentRepository.save(cse);

        Department ece = new Department("ECE", "Electronics & Communication Engineering", "Dr. Claude Shannon", "ece@kalpanaaa.edu", "+91 98765 43211");
        ece.setTotalFaculty(14);
        ece.setTotalStudents(360);
        departmentRepository.save(ece);

        Department me = new Department("ME", "Mechanical Engineering", "Dr. Nikola Tesla", "me@kalpanaaa.edu", "+91 98765 43212");
        me.setTotalFaculty(12);
        me.setTotalStudents(240);
        departmentRepository.save(me);

        // 2. Seed Courses
        courseRepository.save(new Course("BTECH-CSE", "Bachelor of Technology in Computer Science", "CSE", 4, 8, 85000.0));
        courseRepository.save(new Course("BTECH-ECE", "Bachelor of Technology in Electronics", "ECE", 4, 8, 80000.0));
        courseRepository.save(new Course("MTECH-AI", "Master of Technology in Artificial Intelligence", "CSE", 2, 4, 110000.0));

        // 3. Seed Subjects
        subjectRepository.save(new Subject("CS301", "Data Structures & Algorithms", "CSE", 3, 4, "Dr. Sarah Jenkins"));
        subjectRepository.save(new Subject("CS302", "Database Management Systems", "CSE", 3, 4, "Dr. Sarah Jenkins"));
        subjectRepository.save(new Subject("CS303", "Operating Systems", "CSE", 3, 3, "Prof. Michael Chang"));
        subjectRepository.save(new Subject("CS304", "Computer Networks", "CSE", 3, 3, "Prof. Rajesh Kumar"));

        // 4. Seed Admin User
        User admin = new User("admin@kalpanaaa.edu", passwordEncoder.encode("admin123"), "Super Administrator", Role.ROLE_ADMIN, "ADM-001");
        admin.setDepartment("Central Administration");
        userRepository.save(admin);

        // 5. Seed Teacher User & Record
        User teacherUser = new User("teacher@kalpanaaa.edu", passwordEncoder.encode("teacher123"), "Dr. Sarah Jenkins", Role.ROLE_TEACHER, "EMP-101");
        teacherUser.setDepartment("CSE");
        userRepository.save(teacherUser);

        Teacher teacher = new Teacher("EMP-101", "teacher@kalpanaaa.edu", "Dr. Sarah Jenkins", "CSE", "Associate Professor", "Ph.D. in Computer Science");
        teacher.setExperienceYears("8");
        teacher.setCabinRoom("B-Block 304");
        teacher.setSubjectsHandled("Data Structures, Database Systems");
        teacherRepository.save(teacher);

        // 6. Seed Student User & Record
        User studentUser = new User("student@kalpanaaa.edu", passwordEncoder.encode("student123"), "Alex Morgan", Role.ROLE_STUDENT, "CS2026-042");
        studentUser.setDepartment("CSE");
        userRepository.save(studentUser);

        Student student = new Student("CS2026-042", "student@kalpanaaa.edu", "Alex Morgan", "CSE", "BTECH-CSE", 3);
        student.setGpa(3.85);
        student.setAttendancePercentage(94.5);
        student.setDob(LocalDate.of(2004, 5, 14));
        student.setBloodGroup("O+");
        student.setGuardianName("Robert Morgan");
        studentRepository.save(student);

        System.out.println("✅ Kalpanaaa Education database initialized with demo credentials!");
    }
}
