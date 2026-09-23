package za.ac.cput.orders;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import za.ac.cput.orders.domain.Order;
import za.ac.cput.orders.factory.OrderFactory;
import za.ac.cput.orders.service.IOrderService;

@SpringBootApplication
public class OrdersApplication {

    public static void main(String[] args) {
        SpringApplication.run(OrdersApplication.class, args);
    }

    @Bean
    public CommandLineRunner run(IOrderService orderService) {
        return args -> {
            Order order = OrderFactory.createOrder("Wireless Mouse", 2, 300.00, 25.00);

            if (order == null) {
                System.out.println("Failed to create order: invalid input.");
                return;
            }

            Order saved = orderService.create(order);
            System.out.println("Order saved: " + saved);

            Order fetched = orderService.read(saved.getOrderId());
            System.out.println("Order fetched: " + fetched);
        };
    }
}
