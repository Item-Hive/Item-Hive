package za.ac.cput.branded.domain;

import jakarta.persistence.*;

@Entity
@Table(name = "invoices")
@Embeddable
public class Invoice {
    @Id
    private String id;

    @Embedded
    private CartDetails receipt;

    protected Invoice(){}

    public Invoice(Builder builder){
        this.id = builder.id;
        this.receipt = builder.receipt;
    }

    public String getId() {
        return id;
    }

    public CartDetails getReceipt() {
        return receipt;
    }

    public static class Builder{
        private String id;
        private CartDetails receipt;


        public Builder setId(String id){
            this.id = id;
            return this;
        }
        public Builder setCartDetails(CartDetails receipt){
            this.receipt = receipt;
            return this;
        }
        public Invoice build(){
            if(id == null || id.isEmpty())return null;
            if(receipt == null)return null;

            return new Invoice(this);
        }
    }
}
