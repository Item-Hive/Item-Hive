package za.ac.cput.branded.domain;

import jakarta.persistence.*;

@Entity
@Table(name = "receipts")

public class Receipt {
    @Id
    private String id;
    @Embedded
    private Company company;

    private String itemName;
    private int quantity;
    private double price;
    private double subtotal;
    private double serviceFee;
    private double total;

    protected Receipt() {
    }

    public Receipt(Builder builder) {
        this.id = builder.id;
        this.company = builder.company;
        this.itemName = builder.itemName;
        this.quantity = builder.quantity;
        this.price = builder.price;
        this.subtotal = builder.subtotal;
        this.serviceFee = builder.serviceFee;
        this.total = builder.total;
    }

    public String getId() {
        return id;
    }

    public Company getCompany() {
        return company;
    }

    public String getItemName() {
        return itemName;
    }

    public int getQuantity() {
        return quantity;
    }

    public double getPrice() {
        return price;
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
        private Company company;
        private String itemName;
        private int quantity;
        private double price;
        private double subtotal;
        private double serviceFee;
        private double total;



        public Builder setId(String id) {
            this.id = id;
            return this;
        }

        public Builder setCompany(Company company) {
            this.company = company;
            return this;
        }

        public Builder setItemName(String itemName) {
            this.itemName = itemName;
            return this;
        }

        public Builder setQuantity(int quantity) {
            this.quantity = quantity;
            return this;
        }

        public Builder setPrice(double price) {
            this.price = price;
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
        public Receipt build(){
            if(id == null || id.isEmpty())return null;
            if(company == null)return null;
            if(itemName == null || itemName.isEmpty())return null;
            if(quantity < 0)return null;
            if(price < 0)return null;
            if(subtotal < 0)return null;
            if(serviceFee < 0)return null;
            if(total < 0)return null;
            return new Receipt(this);
    }
    }
}