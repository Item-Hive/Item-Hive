package za.ac.cput.orders.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import java.util.Objects;

@Entity
public class Order {
    @Id
    private String orderId;
    private String productName;
    private int quantity;
    private double subtotal;
    private double serviceFee;
    private double total;

    protected Order() {}

    private Order(Builder builder) {
        this.orderId = builder.orderId;
        this.productName = builder.productName;
        this.quantity = builder.quantity;
        this.subtotal = builder.subtotal;
        this.serviceFee = builder.serviceFee;
        this.total = builder.total;
    }

    public String getOrderId() { return orderId; }
    public String getProductName() { return productName; }
    public int getQuantity() { return quantity; }
    public double getSubtotal() { return subtotal; }
    public double getServiceFee() { return serviceFee; }
    public double getTotal() { return total; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Order)) return false;
        Order order = (Order) o;
        return quantity == order.quantity &&
                Double.compare(order.subtotal, subtotal) == 0 &&
                Double.compare(order.serviceFee, serviceFee) == 0 &&
                Double.compare(order.total, total) == 0 &&
                Objects.equals(orderId, order.orderId) &&
                Objects.equals(productName, order.productName);
    }

    @Override
    public int hashCode() {
        return Objects.hash(orderId, productName, quantity, subtotal, serviceFee, total);
    }

    @Override
    public String toString() {
        return "Order{" +
                "orderId='" + orderId + '\'' +
                ", productName='" + productName + '\'' +
                ", quantity=" + quantity +
                ", subtotal=" + subtotal +
                ", serviceFee=" + serviceFee +
                ", total=" + total +
                '}';
    }

    public static class Builder {
        private String orderId;
        private String productName;
        private int quantity;
        private double subtotal;
        private double serviceFee;
        private double total;

        public Builder setOrderId(String orderId) {
            this.orderId = orderId;
            return this;
        }
        public Builder setProductName(String productName) {
            this.productName = productName;
            return this;
        }
        public Builder setQuantity(int quantity) {
            this.quantity = quantity;
            return this;
        }
        public Builder setSubtotal(double subtotal) {
            this.subtotal = subtotal;
            return this;
        }
        public Builder setServiceFee(double serviceFee) {
            this.serviceFee = serviceFee;
            return this;
        }
        public Builder setTotal(double total) {
            this.total = total;
            return this;
        }

        public Builder copy(Order order) {
            this.orderId = order.orderId;
            this.productName = order.productName;
            this.quantity = order.quantity;
            this.subtotal = order.subtotal;
            this.serviceFee = order.serviceFee;
            this.total = order.total;
            return this;
        }

        public Order build() {
            return new Order(this);
        }
    }
}
