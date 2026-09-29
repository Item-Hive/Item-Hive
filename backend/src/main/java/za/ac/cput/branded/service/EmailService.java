package za.ac.cput.branded.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.frontend-url}")
    private String frontendUrl;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Async
    @Transactional
    public void sendVerificationEmail(String email, String token) {
        String link = frontendUrl + "/verify-email?token=" + token;

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Confirm your ItemHive email");
        message.setText(
                "Please click the link below to verify your email:\n\n" +
                link +
                "\n\nThis link expires in 24 hours."
        );

        mailSender.send(message);
    }
}