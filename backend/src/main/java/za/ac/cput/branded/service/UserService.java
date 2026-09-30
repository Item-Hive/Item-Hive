package za.ac.cput.branded.service;


import za.ac.cput.branded.DTO.UserDTO;
import za.ac.cput.branded.factory.BrandedFactory;
import za.ac.cput.branded.repository.AdminRepository;
import za.ac.cput.branded.repository.StudentRepository;
import za.ac.cput.branded.repository.UserRepository;
import za.ac.cput.branded.repository.VerificationTokenRepository;
import za.ac.cput.branded.domain.User;
import za.ac.cput.branded.domain.VerificationToken;
import za.ac.cput.branded.domain.Student;
import za.ac.cput.branded.domain.Admin;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class UserService implements IUserService {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final AdminRepository adminRepository;
    private final VerificationTokenRepository verificationTokenRepository;
    private final EmailService emailService;

    private final BCryptPasswordEncoder passwordEncoder =
            new BCryptPasswordEncoder();

    public UserService(
            UserRepository userRepository,
            StudentRepository studentRepository,
            AdminRepository adminRepository,
            VerificationTokenRepository verificationTokenRepository,
            EmailService emailService
    ) {
        this.userRepository = userRepository;
        this.studentRepository = studentRepository;
        this.adminRepository = adminRepository;
        this.verificationTokenRepository = verificationTokenRepository;
        this.emailService = emailService;
    }

    @Override
    public User create(UserDTO request) {
        // 1. Prevent duplicate emails
        if (userRepository.findByEmail(request.email) != null) {
            throw new IllegalStateException("An account with this email already exists");
        }

        String hashedPassword = passwordEncoder.encode(request.password);

        switch (request.role.toLowerCase()) {

            case "student":
                if (request.studentNumber == null || request.studentNumber.isBlank()) {
                    throw new IllegalArgumentException("Student number is required");
                }
                if (studentRepository.findByStudentNumber(request.studentNumber) != null) {
                    throw new IllegalStateException("A student with this student number already exists");
                }

                User student = BrandedFactory.createStudent(
                        request.studentNumber,
                        request.email,
                        hashedPassword,
                        request.firstName,
                        request.lastName
                );

                return saveUserAndSendVerificationEmail(student);

            case "admin":
                if (request.idNumber == null || request.idNumber.isBlank()) {
                    throw new IllegalArgumentException("ID number is required");
                }
                if (adminRepository.findByIdNumber(request.idNumber) != null) {
                    throw new IllegalStateException("An admin with this ID number already exists");
                }

                User admin = BrandedFactory.createAdmin(
                        request.idNumber,
                        request.email,
                        hashedPassword,
                        request.firstName,
                        request.lastName
                );

                return saveUserAndSendVerificationEmail(admin);

            default:
                throw new IllegalArgumentException("Invalid role");
        }
    }

    private User saveUserAndSendVerificationEmail(User user) {
        User savedUser = userRepository.save(user);

        String token = UUID.randomUUID().toString();

        VerificationToken verificationToken =
                new VerificationToken(
                        token,
                        savedUser,
                        LocalDateTime.now().plusHours(24)
                );

        verificationTokenRepository.save(verificationToken);

        emailService.sendVerificationEmail(
                savedUser.getEmail(),
                token
        );

        return savedUser;
    }

    @Override
    public User update(UserDTO request) {
        User user = userRepository.findById(request.id)
                .orElseThrow(() ->
                        new IllegalStateException("User not found")
                );

        if (request.email != null) {
            user.setEmail(request.email);
        }

        if (request.firstName != null) {
            user.setFirstName(request.firstName);
        }

        if (request.lastName != null) {
            user.setLastName(request.lastName);
        }

        if (request.password != null
                && !request.password.isBlank()) {
            user.setPassword(
                    passwordEncoder.encode(request.password)
            );
        }

        if (user instanceof Student
                && request.studentNumber != null) {
            ((Student) user).setStudentNumber(
                    request.studentNumber
            );
        } else if (user instanceof Admin
                && request.idNumber != null) {
            ((Admin) user).setIdNumber(request.idNumber);
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

    public Student loginStudent(
            String studentNumber,
            String rawPassword
    ) {
        Student student =
                studentRepository.findByStudentNumber(studentNumber);

        if (student == null) {
            return null;
        }

        if (!passwordEncoder.matches(
                rawPassword,
                student.getPassword()
        )) {
            return null;
        }

        return student;
    }

    public Admin loginAdmin(
            String idNumber,
            String rawPassword
    ) {
        Admin admin =
                adminRepository.findByIdNumber(idNumber);

        if (admin == null) {
            return null;
        }

        if (!passwordEncoder.matches(
                rawPassword,
                admin.getPassword()
        )) {
            return null;
        }

        return admin;
    }

    @Transactional
    public boolean verifyEmail(String token) {
        VerificationToken verificationToken =
                verificationTokenRepository
                        .findByToken(token)
                        .orElse(null);

        if (verificationToken == null) {
            return false;
        }

        if (verificationToken.getExpiresAt()
                .isBefore(LocalDateTime.now())) {

            verificationTokenRepository.delete(
                    verificationToken
            );

            return false;
        }

        User user = verificationToken.getUser();
        user.setEmailVerified(true);

        userRepository.save(user);
        verificationTokenRepository.delete(
                verificationToken
        );

        return true;
    }
}