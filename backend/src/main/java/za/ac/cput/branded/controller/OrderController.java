package za.ac.cput.branded.controller;

import za.ac.cput.branded.domain.CheckoutRequestDTO;
import za.ac.cput.branded.domain.OrderConfirmationResponseDTO;
import za.ac.cput.branded.service.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/order")
@CrossOrigin
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping("/checkout")
    public ResponseEntity<OrderConfirmationResponseDTO> checkout(@RequestBody CheckoutRequestDTO request) {
        OrderConfirmationResponseDTO response = orderService.placeOrder(request);
        return ResponseEntity.ok(response);
    }
}