package za.ac.cput.branded.domain;

import jakarta.persistence.*;

@Entity
@Table( name = "carts")
@Embeddable
public class Cart {
    @Id
    private String id;


    private String itemName;
    private double price ;

    private int  quantity;
    private double subtotal;
    private double serviceFee;
    private double total;

   protected Cart(){}

    public Cart(Builder builder){
       this.id = builder.id;
       this.itemName = builder.itemName;
       this.price = builder.price;
       this.quantity = builder.quantity;
       this.subtotal = builder.subtotal;
       this.serviceFee = builder.serviceFee;
       this.total = builder.total;
    }

    public String getId() {
        return id;
    }

    public String getItemName() {
        return itemName;
    }

    public double getPrice() {
        return price;
    }

    public int getQuantity() {
        return quantity;
    }

    public double getSubtotal() {
        return subtotal;
    }

    public double getServiceFee() {
        return serviceFee;
    }
    public double getTotal() {
        return total;
    }
    public static class Builder {
        private String id;
        private String itemName;
        private double price;
        private int quantity;
        private double subtotal;
        private double  serviceFee;
        private double total;


        public Builder setId(String id){
            this.id = id;
            return this;
        }
        public Builder setItemName(String itemName){
            this.itemName = itemName;
            return this;
        }
        public Builder setPrice(double price){
            this.price = price;
            return this;
        }
        public Builder setQuantity(int quantity){
            this.quantity = quantity;
            return this;
        }
        public Builder setSubtotal(double subtotal){
            this.subtotal = subtotal;
            return this;
        }
        public Builder setServiceFee(double  serviceFee){
            this.serviceFee = serviceFee;
            return this;
        }
        public Builder setTotal(double total){
            this.total = total;
            return this;
        }
       public Cart build(){
            if(id == null || id.isEmpty())return null;
            if(itemName == null || itemName.isEmpty())return null;
            if(price < 0)return null;
            if(quantity < 0)return null;
            if(subtotal < 0)return null;
            if(serviceFee < 0)return null;
            if(total < 0)return null;

           return new Cart(this);
       }
    }

}
