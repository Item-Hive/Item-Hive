package za.ac.cput.branded.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import za.ac.cput.branded.domain.User;
import za.ac.cput.branded.domain.VerificationToken;
import za.ac.cput.branded.repository.UserRepository;
import za.ac.cput.branded.repository.VerificationTokenRepository;
import za.ac.cput.branded.service.EmailService;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Lets a signed-in user change their email address.
 * It lives under /api/auth (already public in SecurityConfig) and is protected
 * by requiring the user's current password, the same check as logging in.
 */
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:5173", "https://item-hive.vercel.app"})
public class AccountController {

    private final UserRepository userRepository;
    private final VerificationTokenRepository verificationTokenRepository;
    private final EmailService emailService;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public record ChangeEmailRequest(String userId, String password, String newEmail) {}

    public AccountController(
            UserRepository userRepository,
            VerificationTokenRepository verificationTokenRepository,
            EmailService emailService
    ) {
        this.userRepository = userRepository;
        this.verificationTokenRepository = verificationTokenRepository;
        this.emailService = emailService;
    }

    @PostMapping("/update-email")
    public ResponseEntity<String> updateEmail(@RequestBody ChangeEmailRequest req) {
        if (req.userId() == null || req.password() == null || req.newEmail() == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Missing details.");
        }

        String newEmail = req.newEmail().trim();
        if (!newEmail.matches("\\S+@\\S+\\.\\S+")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Enter a valid email address.");
        }

        User user = userRepository.findById(req.userId()).orElse(null);
        if (user == null || !passwordEncoder.matches(req.password(), user.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Incorrect password.");
        }

        User existing = userRepository.findByEmail(newEmail);
        if (existing != null && !existing.getId().equals(user.getId())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("An account with this email already exists.");
        }

        user.setEmail(newEmail);
        user.setEmailVerified(false);
        User saved = userRepository.save(user);

        String token = UUID.randomUUID().toString();
        verificationTokenRepository.save(
                new VerificationToken(token, saved, LocalDateTime.now().plusHours(24))
        );
        emailService.sendVerificationEmail(saved.getEmail(), token);

        return ResponseEntity.ok("Email updated.");
    }
}