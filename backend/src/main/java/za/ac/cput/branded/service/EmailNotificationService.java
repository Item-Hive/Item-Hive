package za.ac.cput.branded.service;

import za.ac.cput.branded.domain.Order;
import za.ac.cput.branded.model.OrderItemSnapshot;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailNotificationService implements NotificationService {

    private static final Logger log = LoggerFactory.getLogger(EmailNotificationService.class);

    private final JavaMailSender mailSender;

    @Value("${itemhive.mail.from}")
    private String mailFrom;

    public EmailNotificationService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Override
    public boolean sendOrderConfirmationEmail(Order order, String toEmail) {
        if (toEmail == null || toEmail.isBlank()) return false;
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(mailFrom);
            message.setTo(toEmail);
            message.setSubject("ItemHive Order Confirmation – " + order.getOrderNumber());
            message.setText(buildEmailBody(order));
            mailSender.send(message);
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