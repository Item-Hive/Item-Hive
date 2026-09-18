package za.ac.cput.branded.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import za.ac.cput.branded.domain.Admin;
import za.ac.cput.branded.domain.Student;
import za.ac.cput.branded.service.UserService;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {
    private final UserService service;

    public AuthController(UserService service) {
        this.service = service;
    }

    @PostMapping("/login/student")
    public ResponseEntity<Student> loginStudent(@RequestBody LoginRequest request) {
        Student student = service.loginStudent(request.username, request.password);
        if (student == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(student);
    }

    @PostMapping("/login/admin")
    public ResponseEntity<Admin> loginAdmin(@RequestBody LoginRequest request) {
        Admin admin = service.loginAdmin(request.username, request.password);
        if (admin == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(admin);
    }

    public static class LoginRequest {
        public String username;
        public String password;
    }
}