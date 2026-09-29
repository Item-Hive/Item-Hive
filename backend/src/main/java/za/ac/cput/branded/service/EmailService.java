package za.ac.cput.branded.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class EmailService {

    @Value("${resend.api.key}")
    private String resendApiKey;

    @Value("${app.frontend-url}")
    private String frontendUrl;

    @Value("${itemhive.mail.from}")
    private String fromEmail;

    private final RestTemplate restTemplate = new RestTemplate();

    public void sendVerificationEmail(String email, String token) {
        String link = frontendUrl + "/verify-email?token=" + token;

        Map<String, Object> body = new HashMap<>();
        body.put("from", "ItemHive <" + fromEmail + ">");
        body.put("to", new String[]{email});
        body.put("subject", "Confirm your ItemHive email");
        body.put("text",
                "Please click the link below to verify your email:\n\n" +
                link +
                "\n\nThis link expires in 24 hours."
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(resendApiKey);
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

        try {
            restTemplate.postForEntity("https://api.resend.com/emails", request, String.class);
        } catch (Exception e) {
            System.err.println("Failed to send verification email: " + e.getMessage());
        }
    }
}
