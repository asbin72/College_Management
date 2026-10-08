package com.kalpanaa.education.dto;

import com.kalpanaa.education.model.Role;

public class AuthDto {

    public static class LoginRequest {
        private String email;
        private String password;

        public LoginRequest() {}
        public LoginRequest(String email, String password) {
            this.email = email;
            this.password = password;
        }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    public static class SignupRequest {
        private String name;
        private String email;
        private String password;
        private String rollNo;
        private String department;
        private String course;
        private Integer semester = 1;

        public SignupRequest() {}

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
        public String getRollNo() { return rollNo; }
        public void setRollNo(String rollNo) { this.rollNo = rollNo; }
        public String getDepartment() { return department; }
        public void setDepartment(String department) { this.department = department; }
        public String getCourse() { return course; }
        public void setCourse(String course) { this.course = course; }
        public Integer getSemester() { return semester; }
        public void setSemester(Integer semester) { this.semester = semester; }
    }

    public static class AuthResponse {
        private String token;
        private String tokenType = "Bearer";
        private Long id;
        private String name;
        private String email;
        private Role role;
        private String identifier;
        private String department;

        public AuthResponse(String token, Long id, String name, String email, Role role, String identifier, String department) {
            this.token = token;
            this.id = id;
            this.name = name;
            this.email = email;
            this.role = role;
            this.identifier = identifier;
            this.department = department;
        }

        public String getToken() { return token; }
        public String getTokenType() { return tokenType; }
        public Long getId() { return id; }
        public String getName() { return name; }
        public String getEmail() { return email; }
        public Role getRole() { return role; }
        public String getIdentifier() { return identifier; }
        public String getDepartment() { return department; }
    }

    public static class ApiResponse<T> {
        private boolean success;
        private String message;
        private T data;

        public ApiResponse(boolean success, String message, T data) {
            this.success = success;
            this.message = message;
            this.data = data;
        }

        public boolean isSuccess() { return success; }
        public String getMessage() { return message; }
        public T getData() { return data; }
    }
}
