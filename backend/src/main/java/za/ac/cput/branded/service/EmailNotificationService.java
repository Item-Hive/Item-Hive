package za.ac.cput.branded.service;

import za.ac.cput.branded.domain.Order;
import za.ac.cput.branded.model.OrderItemSnapshot;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class EmailNotificationService implements NotificationService {

    private static final Logger log = LoggerFactory.getLogger(EmailNotificationService.class);

    @Value("${resend.api.key}")
    private String resendApiKey;

    @Value("${itemhive.mail.from}")
    private String mailFrom;

    private final RestTemplate restTemplate = new RestTemplate();

    @Override
    public boolean sendOrderConfirmationEmail(Order order, String toEmail) {
        if (toEmail == null || toEmail.isBlank()) return false;
        try {
            Map<String, Object> body = new HashMap<>();
            body.put("from", "ItemHive <" + mailFrom + ">");
            body.put("to", new String[]{toEmail});
            body.put("subject", "ItemHive Order Confirmation – " + order.getOrderNumber());
            body.put("text", buildEmailBody(order));

            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(resendApiKey);
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
            restTemplate.postForEntity("https://api.resend.com/emails", request, String.class);
            return true;
        } catch (Exception e) {
            log.error("Failed to send confirmation email for order {}", order.getOrderNumber(), e);
            return false;
        }
    }

    private String buildEmailBody(Order order) {
        StringBuilder sb = new StringBuilder();
        sb.append("Thanks for your order!\n\n");
        sb.append("Order number: ").append(order.getOrderNumber()).append("\n");
        sb.append("Delivery: ").append(order.getDeliverySummary()).append("\n\n");
        sb.append("Items:\n");
        for (OrderItemSnapshot item : order.getItems()) {
            sb.append(" - ").append(item.getItemName())
                    .append(" x").append(item.getQuantity())
                    .append(" = R").append(item.getLineTotal()).append("\n");
        }
        sb.append("\nTotal charged: R").append(order.getTotal()).append(" via ").append(order.getPaymentMethod());
        sb.append("\n\nKeep your order number for any queries. – ItemHive");
        return sb.toString();
    }
}
