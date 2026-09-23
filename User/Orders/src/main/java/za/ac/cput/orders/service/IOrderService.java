package za.ac.cput.orders.service;

import za.ac.cput.orders.domain.Order;
import java.util.List;

public interface IOrderService {
    Order create(Order order);
    Order read(String orderId);
    Order update(Order order);
    boolean delete(String orderId);
    List<Order> getAll();
}
