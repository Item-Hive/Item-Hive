package za.ac.cput.branded.factory;

import za.ac.cput.branded.domain.*;

import java.util.Date;

public class BrandedFactory {
    public static Item createItem(String id, Category category , String name, String description, double price, int stockQuantity, String rating, String review){
        return new Item.Builder()
                .setId(id)
                .setCategory(category)
                .setName(name)
                .setDescription(description)
                .setPrice(price)
                .setStockQuantity(stockQuantity)
                .setRating(rating)
                .setReview(review)
                .build();
    }
public static Cart createCart(String id, String itemName, double price, int quantity, double subtotal, double serviceFee, double total){
      return new Cart.Builder()
              .setId(id)
              .setItemName(itemName)
              .setPrice(price)
              .setQuantity(quantity)
              .setSubtotal(subtotal)
              .setServiceFee(serviceFee)
              .setTotal(total)
              .build();

}
public static Card createCard(String id, String bank, String cardHolder, int cardNumber, Date expiryDate, int cvv){
    return new Card.Builder()
            .setId(id)
            .setBank(bank)
            .setCardHolder(cardHolder)
            .setCardNumber(cardNumber)
            .setExpiryDate(expiryDate)
            .setCcv(cvv)
            .build();

}
public static Receipt createReceipt(String id, Company company, String itemName, int quantity, double price, double subtotal, double serviceFee, double total){
        return new Receipt.Builder()
                .setId(id)
                .setCompany(company)
                .setItemName(itemName)
                .setQuantity(quantity)
                .setPrice(price)
                .setSubtotal(subtotal)
                .setServiceFee(serviceFee)
                .setTotal(total)
                .build();

}
public static Invoice createInvoice(String id,CartDetails cartDetails){
        return new Invoice.Builder()
                .setId(id)
                .setCartDetails(cartDetails)
                .build();
}

}
