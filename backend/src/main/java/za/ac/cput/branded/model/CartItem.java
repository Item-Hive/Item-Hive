package za.ac.cput.branded.model;

import za.ac.cput.branded.domain.Item;

public class CartItem {
    private final Item itemId;
    private int quantity;
    private Money price;

    public CartItem(Item itemId, int quantity, Money price){
        this.itemId = itemId;
        this.quantity = quantity;
        this.price = price;
    }
    public Item getItemId(){
        return itemId;
    }
    public void increaseQuantity(int qty){
        this.quantity += qty;
    }
    public Money getTotal(){
        return price.multiply(quantity);
    }
}
