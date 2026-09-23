package za.ac.cput.orders.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import za.ac.cput.orders.domain.Order;

public interface OrderRepository extends JpaRepository<Order, String> {
}
