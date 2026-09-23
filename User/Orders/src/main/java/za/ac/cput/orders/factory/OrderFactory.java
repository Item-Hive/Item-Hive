package za.ac.cput.orders.factory;

import za.ac.cput.orders.domain.Order;
import java.util.UUID;

public class OrderFactory {

    public static Order createOrder(String productName, int quantity, double subtotal, double serviceFee) {
        if (productName == null || productName.isBlank()) return null;
        if (quantity <= 0) return null;
        if (subtotal < 0 || serviceFee < 0) return null;

        double total = subtotal + serviceFee;

        return new Order.Builder()
                .setOrderId(UUID.randomUUID().toString())
                .setProductName(productName)
                .setQuantity(quantity)
                .setSubtotal(subtotal)
                .setServiceFee(serviceFee)
                .setTotal(total)
                .build();
    }
}
