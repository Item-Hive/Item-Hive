package za.ac.cput.branded.domain;

import jakarta.persistence.*;

@Entity
@Table(name = "items")


public class Item {

    @Id
    private String id;

    @Embedded

    @AttributeOverride(
            name = "name",
            column = @Column(name = "category_name")
    )
    private Category category;

    private String name;
    private String description;
    private double price;
    private int stockQuantity;

    private String rating;
    private String review;

    protected Item() {
    }

    public Item(Builder builder) {
        this.id = builder.id;
        this.category = builder.category;
        this.name = builder.id;
        this.description = builder.description;
        this.price = builder.price;
        this.stockQuantity = builder.stockQuantity;
        this.rating = builder.rating;
        this.review = builder.review;
    }

    public String getId() {
        return id;

    }

    public Category getCategory() {
        return category;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public double getPrice() {
        return price;
    }
    public int getStockQuantity(){
        return stockQuantity;
    }
    public String getRating() {
        return rating;
    }

    public String getReview() {
        return review;
    }

    public static class Builder {
        private String id;
        private Category category;
        private String name;
        private String description;
        private double price;
        private int stockQuantity;
        private String rating;
        private String review;


        public Builder setId(String id) {
            this.id = id;
            return this;
        }

        public Builder setCategory(Category category) {
            this.category = category;
            return this;
        }
        public Builder setName(String name) {
            this.name = name;
            return this;
        }
        public Builder setDescription(String description) {
            this.description = description;
            return this;
        }

        public Builder setPrice(double price) {
            this.price = price;
            return this;
        }

        public Builder setRating(String rating) {
            this.rating = rating;
            return this;

        }
        public Builder setStockQuantity(int stockQuantity) {
            this.stockQuantity = stockQuantity;
            return this;
        }
        public Builder setReview(String review) {
            this.review = review;
            return this;
        }


        public Item build() {
            if (id == null || id.isEmpty()) return null;
            if (category == null) return null;
            if (description == null || description.isEmpty()) return null;
            if (price < 0) return null;
            if (rating == null || rating.isEmpty()) return null;
            if (review == null || review.isEmpty()) return null;
            return new Item(this);
        }
    }
}