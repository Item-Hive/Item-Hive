package za.ac.cput.branded.domain;

import java.util.List;

public class CheckoutRequestDTO {
    private String userId;
    private double total;
    private String paymentMethod;
    private String deliveryType;
    private String deliverySummary;
    private List<CheckoutItemDTO> items;

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public double getTotal() { return total; }
    public void setTotal(double total) { this.total = total; }
    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }
    public String getDeliveryType() { return deliveryType; }
    public void setDeliveryType(String deliveryType) { this.deliveryType = deliveryType; }
    public String getDeliverySummary() { return deliverySummary; }
    public void setDeliverySummary(String deliverySummary) { this.deliverySummary = deliverySummary; }
    public List<CheckoutItemDTO> getItems() { return items; }
    public void setItems(List<CheckoutItemDTO> items) { this.items = items; }

    public static class CheckoutItemDTO {
        private String itemName;
        private int quantity;
        private double price;
        private double lineTotal;

        public String getItemName() { return itemName; }
        public void setItemName(String itemName) { this.itemName = itemName; }
        public int getQuantity() { return quantity; }
        public void setQuantity(int quantity) { this.quantity = quantity; }
        public double getPrice() { return price; }
        public void setPrice(double price) { this.price = price; }
        public double getLineTotal() { return lineTotal; }
        public void setLineTotal(double lineTotal) { this.lineTotal = lineTotal; }
    }
}