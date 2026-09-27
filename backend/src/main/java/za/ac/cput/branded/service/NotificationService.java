package za.ac.cput.branded.service;

import za.ac.cput.branded.domain.Order;

public interface NotificationService {
    boolean sendOrderConfirmationEmail(Order order, String toEmail);
}