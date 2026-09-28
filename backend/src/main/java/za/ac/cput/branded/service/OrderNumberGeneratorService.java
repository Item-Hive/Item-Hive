package za.ac.cput.branded.service;

import za.ac.cput.branded.repository.OrderRepository;
import org.springframework.stereotype.Component;

import java.security.SecureRandom;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@Component
public class OrderNumberGeneratorService {

    private static final DateTimeFormatter DATE_FMT = DateTimeFormatter.ofPattern("yyyyMMdd");
    private static final SecureRandom RANDOM = new SecureRandom();
    private static final String PREFIX = "IH";

    private final OrderRepository orderRepository;

    public OrderNumberGeneratorService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    /** Format: IH-YYYYMMDD-XXXXX (5 random digits), retried on the rare collision. */
    public String generate() {
        String candidate;
        do {
            String datePart = LocalDate.now().format(DATE_FMT);
            int suffix = RANDOM.nextInt(100000);
            candidate = String.format("%s-%s-%05d", PREFIX, datePart, suffix);
        } while (orderRepository.existsByOrderNumber(candidate));
        return candidate;
    }
}