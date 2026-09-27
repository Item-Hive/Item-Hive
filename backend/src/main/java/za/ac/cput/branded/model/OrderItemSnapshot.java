package za.ac.cput.branded.model;

import jakarta.persistence.Embeddable;

@Embeddable
public class OrderItemSnapshot {

    private String itemName;
    private int quantity;
    private double price;
    private double lineTotal;

    protected OrderItemSnapshot() {
    }

    public OrderItemSnapshot(String itemName, int quantity, double price, double lineTotal) {
        this.itemName = itemName;
        this.quantity = quantity;
        this.price = price;
        this.lineTotal = lineTotal;
    }

    public String getItemName() { return itemName; }
    public int getQuantity() { return quantity; }
    public double getPrice() { return price; }
    public double getLineTotal() { return lineTotal; }
}