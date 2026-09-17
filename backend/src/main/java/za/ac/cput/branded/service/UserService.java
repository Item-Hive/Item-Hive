package za.ac.cput.branded.service;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import za.ac.cput.branded.domain.*;
import za.ac.cput.branded.factory.BrandedFactory;
import za.ac.cput.branded.repository.AdminRepository;
import za.ac.cput.branded.repository.StudentRepository;
import za.ac.cput.branded.repository.UserRepository;

import java.util.List;

@Service
public class UserService implements IUserService {
    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final AdminRepository adminRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public UserService(UserRepository userRepository, StudentRepository studentRepository, AdminRepository adminRepository) {
        this.userRepository = userRepository;
        this.studentRepository = studentRepository;
        this.adminRepository = adminRepository;
    }

    @Override
    public User create(UserDTO request) {
        User user;
        String hashedPassword = passwordEncoder.encode(request.password);
        switch (request.role.toLowerCase()) {
            case "student":
                user = BrandedFactory.createStudent(request.studentNumber, request.email, hashedPassword);
                break;
            case "admin":
                user = BrandedFactory.createAdmin(request.idNumber, request.email, hashedPassword);
                break;
            default:
                throw new IllegalArgumentException("Invalid role");
        }
        return userRepository.save(user);
    }

    // login: student number + raw password -> matching Student, or null if no match
    public Student loginStudent(String studentNumber, String rawPassword) {
        Student student = studentRepository.findByStudentNumber(studentNumber);
        if (student == null) return null;
        if (!passwordEncoder.matches(rawPassword, student.getPassword())) return null;
        return student;
    }

    public Admin loginAdmin(String idNumber, String rawPassword) {
        Admin admin = adminRepository.findByIdNumber(idNumber);
        if (admin == null) return null;
        if (!passwordEncoder.matches(rawPassword, admin.getPassword())) return null;
        return admin;
    }

    // ...update(), read(), getAll(), delete() stay the same as before,
    // except update() should get the same hashedPassword treatment as create()
}
