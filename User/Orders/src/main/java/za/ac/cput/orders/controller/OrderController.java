package za.ac.cput.orders.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import za.ac.cput.orders.domain.Order;
import za.ac.cput.orders.service.IOrderService;
import java.util.List;

@RestController
@RequestMapping("/order")
public class OrderController {

    private final IOrderService service;

    @Autowired
    public OrderController(IOrderService service) {
        this.service = service;
    }

    @PostMapping("/create")
    public Order create(@RequestBody Order order) {
        return service.create(order);
    }

    @GetMapping("/read/{orderId}")
    public Order read(@PathVariable String orderId) {
        return service.read(orderId);
    }

    @PutMapping("/update")
    public Order update(@RequestBody Order order) {
        return service.update(order);
    }

    @DeleteMapping("/delete/{orderId}")
    public boolean delete(@PathVariable String orderId) {
        return service.delete(orderId);
    }

    @GetMapping("/getall")
    public List<Order> getAll() {
        return service.getAll();
    }
}
