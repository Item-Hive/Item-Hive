package za.ac.cput.branded.service;

import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;

import java.util.Map;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.frontend-url}")
    private String frontendUrl;

    @Value("${itemhive.mail.from:itemhive.noreply@gmail.com}")
    private String mailFrom;

    @Value("${emailjs.service-id:}")
    private String emailJsServiceId;

    @Value("${emailjs.verify-template-id:}")
    private String emailJsVerifyTemplateId;

    @Value("${emailjs.public-key:}")
    private String emailJsPublicKey;

    @Value("${emailjs.private-key:}")
    private String emailJsPrivateKey;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Async
    public void sendVerificationEmail(String email, String token) {
        String link = frontendUrl + "/verify-email?token=" + token;

        // Deployed (Render blocks SMTP): send through EmailJS over HTTPS
        if (!emailJsPrivateKey.isBlank() && !emailJsVerifyTemplateId.isBlank()) {
            sendVerificationViaEmailJs(email, link);
            return;
        }

        // Fallback: Gmail SMTP (works when running locally)
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(mailFrom);
            helper.setTo(email);
            helper.setSubject("Verify Your ItemHive Account");

            String htmlContent = "<h2>Welcome to ItemHive!</h2>" +
                    "<p>Please confirm your account by clicking the button below:</p>" +
                    "<a href='" + link + "' style='background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; display: inline-block; border-radius: 5px;'>Verify Email</a>" +
                    "<p><small>This link expires in 24 hours.</small></p>";

            helper.setText(htmlContent, true);
            mailSender.send(message);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void sendVerificationViaEmailJs(String email, String link) {
        try {
            Map<String, Object> body = Map.of(
                    "service_id", emailJsServiceId,
                    "template_id", emailJsVerifyTemplateId,
                    "user_id", emailJsPublicKey,
                    "accessToken", emailJsPrivateKey,
                    "template_params", Map.of(
                            "to_email", email,
                            "verify_link", link
                    )
            );

            RestClient.create()
                    .post()
                    .uri("https://api.emailjs.com/api/v1.0/email/send")
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(body)
                    .retrieve()
                    .toBodilessEntity();
        } catch (RestClientResponseException e) {
            System.err.println("EmailJS error " + e.getStatusCode() + ": " + e.getResponseBodyAsString());
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Async
    public void sendOrderConfirmationEmail(String email, String orderNumber, String totalAmount, String deliveryDetails) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(mailFrom);
            helper.setTo(email);
            helper.setSubject("ItemHive - Order Confirmation #" + orderNumber);

            String htmlContent = "<h2>Thank you for your order!</h2>" +
                    "<p>Here is your order breakdown:</p>" +
                    "<ul>" +
                    "<li><b>Order Reference:</b> " + orderNumber + "</li>" +
                    "<li><b>Total Paid:</b> R" + totalAmount + "</li>" +
                    "<li><b>Delivery Details:</b> " + deliveryDetails + "</li>" +
                    "</ul>" +
                    "<p>We're getting your items ready for dispatch!</p>";

            helper.setText(htmlContent, true);
            mailSender.send(message);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}