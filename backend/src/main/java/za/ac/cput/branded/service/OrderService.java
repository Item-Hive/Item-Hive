package za.ac.cput.branded.service;

import za.ac.cput.branded.domain.Order;
import za.ac.cput.branded.DTO.CheckoutRequestDTO;
import za.ac.cput.branded.DTO.OrderConfirmationResponseDTO;
import za.ac.cput.branded.model.OrderItemSnapshot;
import za.ac.cput.branded.repository.OrderRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderNumberGeneratorService orderNumberGeneratorService;
    private final NotificationService notificationService;
    private final UserContactLookUpService userContactLookUpService;

    public OrderService(OrderRepository orderRepository,
                        OrderNumberGeneratorService orderNumberGeneratorService,
                        NotificationService notificationService,
                        UserContactLookUpService userContactLookUpService) {
        this.orderRepository = orderRepository;
        this.orderNumberGeneratorService = orderNumberGeneratorService;
        this.notificationService = notificationService;
        this.userContactLookUpService = userContactLookUpService;
    }

    @Transactional
    public OrderConfirmationResponseDTO placeOrder(CheckoutRequestDTO request) {
        List<OrderItemSnapshot> items = request.getItems().stream()
                .map(this::toSnapshot)
                .collect(Collectors.toList());

        Order order = Order.builder()
                .setUserId(request.getUserId())
                .setTotal(request.getTotal())
                .setPaymentMethod(request.getPaymentMethod())
                .setDeliveryType(request.getDeliveryType())
                .setDeliverySummary(request.getDeliverySummary())
                .setItems(items)
                .build();

        if (order == null) {
            return new OrderConfirmationResponseDTO(null, request.getTotal(), "FAILED_VALIDATION", false);
        }

        order.setOrderNumber(orderNumberGeneratorService.generate());
        orderRepository.save(order);

        String email = userContactLookUpService.findEmailByUserId(request.getUserId());

        boolean emailSent = email != null
                && notificationService.sendOrderConfirmationEmail(order, email);

        order.setStatus(emailSent ? "CONFIRMED" : "PLACED");
        orderRepository.save(order);

        return new OrderConfirmationResponseDTO(
                order.getOrderNumber(), order.getTotal(), order.getStatus(), emailSent);
    }

    private OrderItemSnapshot toSnapshot(CheckoutRequestDTO.CheckoutItemDTO dto) {
        return new OrderItemSnapshot(dto.getItemName(), dto.getQuantity(), dto.getPrice(), dto.getLineTotal());
    }
}