package za.ac.cput.branded.domain;

import jakarta.persistence.*;
import za.ac.cput.branded.model.OrderItemSnapshot;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "orders")
public class Order {

    @Id
    private String id;

    @Column(unique = true, nullable = false)
    private String orderNumber;

    private String userId;
    private double total;
    private String paymentMethod;
    private String deliveryType;
    private String deliverySummary;
    private String status;

    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @ElementCollection
    @CollectionTable(name = "order_items", joinColumns = @JoinColumn(name = "order_id"))
    private List<OrderItemSnapshot> items;

    protected Order() {
    }

    public static Builder builder() {
        return new Builder();
    }

    public String getId() { return id; }
    public String getOrderNumber() { return orderNumber; }
    public void setOrderNumber(String orderNumber) { this.orderNumber = orderNumber; }
    public String getUserId() { return userId; }
    public double getTotal() { return total; }
    public String getPaymentMethod() { return paymentMethod; }
    public String getDeliveryType() { return deliveryType; }
    public String getDeliverySummary() { return deliverySummary; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public Instant getCreatedAt() { return createdAt; }
    public List<OrderItemSnapshot> getItems() { return items; }

    public static class Builder {
        private final Order order = new Order();

        public Builder setUserId(String userId) { order.userId = userId; return this; }
        public Builder setTotal(double total) { order.total = total; return this; }
        public Builder setPaymentMethod(String paymentMethod) { order.paymentMethod = paymentMethod; return this; }
        public Builder setDeliveryType(String deliveryType) { order.deliveryType = deliveryType; return this; }
        public Builder setDeliverySummary(String deliverySummary) { order.deliverySummary = deliverySummary; return this; }
        public Builder setItems(List<OrderItemSnapshot> items) { order.items = items; return this; }
        public Builder copy(Order source) {
            order.id = source.id;
            order.orderNumber = source.orderNumber;
            order.userId = source.userId;
            order.total = source.total;
            order.paymentMethod = source.paymentMethod;
            order.deliveryType = source.deliveryType;
            order.deliverySummary = source.deliverySummary;
            order.status = source.status;
            order.createdAt = source.createdAt;
            order.items = source.items;
            return this;
        }

        /** Returns null if a required field is missing, per project convention. */
        public Order build() {
            if (order.userId == null || order.items == null || order.items.isEmpty() || order.total <= 0) {
                return null;
            }
            if (order.id == null) order.id = UUID.randomUUID().toString();
            if (order.createdAt == null) order.createdAt = Instant.now();
            if (order.status == null) order.status = "PLACED";
            return order;
        }
    }
}