package com.kalpanaa.education.controller;

import com.kalpanaa.education.config.JwtTokenProvider;
import com.kalpanaa.education.dto.AuthDto.*;
import com.kalpanaa.education.model.*;
import com.kalpanaa.education.repository.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    public AuthController(AuthenticationManager authenticationManager,
                          UserRepository userRepository,
                          StudentRepository studentRepository,
                          PasswordEncoder passwordEncoder,
                          JwtTokenProvider tokenProvider) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.studentRepository = studentRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);

            User user = userRepository.findByEmail(request.getEmail())
                    .or(() -> userRepository.findByIdentifier(request.getEmail()))
                    .orElseThrow();

            Map<String, Object> claims = new HashMap<>();
            claims.put("role", user.getRole().name());
            claims.put("name", user.getName());
            claims.put("identifier", user.getIdentifier());

            String token = tokenProvider.generateToken(authentication, claims);

            AuthResponse response = new AuthResponse(
                    token,
                    user.getId(),
                    user.getName(),
                    user.getEmail(),
                    user.getRole(),
                    user.getIdentifier(),
                    user.getDepartment()
            );

            return ResponseEntity.ok(new ApiResponse<>(true, "Login successful", response));
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(401).body(new ApiResponse<>(false, "Invalid email or password", null));
        }
    }

    @PostMapping("/student-signup")
    public ResponseEntity<?> signup(@RequestBody SignupRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, "Email is already registered", null));
        }

        User user = new User(
                request.getEmail(),
                passwordEncoder.encode(request.getPassword()),
                request.getName(),
                Role.ROLE_STUDENT,
                request.getRollNo()
        );
        user.setDepartment(request.getDepartment());
        userRepository.save(user);

        Student student = new Student(
                request.getRollNo(),
                request.getEmail(),
                request.getName(),
                request.getDepartment(),
                request.getCourse(),
                request.getSemester()
        );
        studentRepository.save(student);

        Map<String, Object> claims = new HashMap<>();
        claims.put("role", Role.ROLE_STUDENT.name());
        claims.put("name", request.getName());
        claims.put("identifier", request.getRollNo());

        String token = tokenProvider.generateTokenForEmail(request.getEmail(), claims);

        AuthResponse response = new AuthResponse(
                token,
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole(),
                user.getIdentifier(),
                user.getDepartment()
        );

        return ResponseEntity.ok(new ApiResponse<>(true, "Student registered successfully", response));
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(401).body(new ApiResponse<>(false, "Not authenticated", null));
        }
        User user = userRepository.findByEmail(authentication.getName()).orElse(null);
        if (user == null) {
            return ResponseEntity.status(404).body(new ApiResponse<>(false, "User profile not found", null));
        }
        return ResponseEntity.ok(new ApiResponse<>(true, "User profile retrieved", user));
    }
}
