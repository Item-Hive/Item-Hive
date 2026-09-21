package za.ac.cput.branded.service;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
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
        String hashedPassword = passwordEncoder.encode(request.password);
        switch (request.role.toLowerCase()) {
            case "student":
                if (studentRepository.findByStudentNumber(request.studentNumber) != null) {
                    throw new IllegalStateException("A student with this student number already exists");
                }
                User student = BrandedFactory.createStudent(request.studentNumber, "", hashedPassword);
                return userRepository.save(student);
            case "admin":
                if (adminRepository.findByIdNumber(request.idNumber) != null) {
                    throw new IllegalStateException("An admin with this ID number already exists");
                }
                User admin = BrandedFactory.createAdmin(request.idNumber, "", hashedPassword);
                return userRepository.save(admin);
            default:
                throw new IllegalArgumentException("Invalid role");
        }
    }

    @Override
    public User update(UserDTO request) {
        User user;
        String hashedPassword = passwordEncoder.encode(request.password);
        switch (request.role.toLowerCase()) {
            case "student":
                user = BrandedFactory.createStudent(request.studentNumber, "", hashedPassword);
                break;
            case "admin":
                user = BrandedFactory.createAdmin(request.idNumber, "", hashedPassword);
                break;
            default:
                throw new IllegalArgumentException("Invalid role");
        }
        return userRepository.save(user);
    }

    @Override
    public User read(String id) {
        return userRepository.findById(id).orElse(null);
    }

    @Override
    public List<User> getAll() {
        return userRepository.findAll();
    }

    @Override
    public void delete(String id) {
        userRepository.deleteById(id);
    }

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
}