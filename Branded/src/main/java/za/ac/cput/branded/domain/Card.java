package za.ac.cput.branded.domain;

import jakarta.persistence.Embeddable;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import org.springframework.web.bind.annotation.*;
import za.ac.cput.branded.service.UserService;

import java.util.Date;
import java.util.List;

@Entity
@Table(name = "cards")
@Embeddable
public class Card {
    @Id
    private String id;

    private String bank;
    private String cardHolder;
    private int cardNumber;
    private Date expiryDate;
    private int ccv;

    protected Card(){
    }
    public Card(Builder builder){
        this.id = builder.id;
        this.bank = builder.bank;
        this.cardHolder = builder.cardHolder;
        this.cardNumber = builder.cardNumber;
        this.expiryDate = builder.expiryDate;
        this.ccv = builder.ccv;
    }
    public String getId(){
        return id;

    }
    public String getBank(){
        return bank;
    }
    public String getCardHolder(){
        return cardHolder;
    }
    public int getCardNumber(){
        return cardNumber;
    }
    public Date getExpiryDate(){
        return expiryDate;
    }
    public int getCcv() {
       return ccv;
    }
    public static class Builder{
        private String id;
        private String bank;
        private String cardHolder;
        private int cardNumber;
        private Date expiryDate;
        private int ccv;
/*
        public Builder(String id, String bank, String cardHolder, int cardNumber, Date expiryDate, int ccv){
            this.id = id;
            this.bank = bank;
            this.cardHolder = cardHolder;
            this.cardNumber = cardNumber;
            this.expiryDate = expiryDate;
            this.ccv = ccv;
        }

 */
        public Builder setId(String id){
            this.id = id;
            return this;
        }
        public Builder setBank(String bank){
            this.bank = bank;
            return this;
        }
        public Builder setCardHolder(String cardHolder){
            this.cardHolder = cardHolder;
            return this;
        }
        public Builder setCardNumber(int cardNumber){
            this.cardNumber = cardNumber;
            return this;
        }
        public Builder setExpiryDate(Date expiryDate){
            this.expiryDate = expiryDate;
            return this;
        }
        public Builder setCcv(int ccv){
            this.ccv = ccv;
            return this;
        }
        public Card build(){
            if(id == null || id.isEmpty())return null;
            if(bank == null || bank.isEmpty())return null;
            if(cardHolder == null || cardHolder.isEmpty())return null;
            if(cardNumber < 0)return null;
            if(expiryDate == null)return null;
            if(ccv < 0||ccv>999)return null;

            return new Card(this);
        }
    }

    public static class UserController {
        private final UserService userService;

        private UserController(UserService UserService){
            this.userService = userService ;
        }
        @PostMapping
        public User create(@RequestBody User user){
            return userService.create(user);
        }
        @PutMapping
        public User update(@RequestBody User user ){
            return userService.update(user);
        }
        @GetMapping("/{id}")
        public User read(String id){
            return userService.read(id);
        }
        @GetMapping
        public List<User> getAll() {
            return userService.getAll();
        }
        @DeleteMapping("/{id}")
        public void delete(String id){
            userService.delete(id);
        }
    }
}
