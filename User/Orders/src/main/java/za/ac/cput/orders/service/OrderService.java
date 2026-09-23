package za.ac.cput.orders.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import za.ac.cput.orders.domain.Order;
import za.ac.cput.orders.repository.OrderRepository;
import java.util.List;

@Service
public class OrderService implements IOrderService {

    private final OrderRepository repository;

    @Autowired
    public OrderService(OrderRepository repository) {
        this.repository = repository;
    }

    @Override
    public Order create(Order order) {
        return repository.save(order);
    }

    @Override
    public Order read(String orderId) {
        return repository.findById(orderId).orElse(null);
    }

    @Override
    public Order update(Order order) {
        return repository.save(order);
    }

    @Override
    public boolean delete(String orderId) {
        if (!repository.existsById(orderId)) return false;
        repository.deleteById(orderId);
        return true;
    }

    @Override
    public List<Order> getAll() {
        return repository.findAll();
    }
}
