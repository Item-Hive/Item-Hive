package za.ac.cput.branded.model;

public class Money {
    private final double amount;

    public Money(double amount){
        if(amount < 0) throw new IllegalArgumentException("Amount must be positive");
        this.amount = amount;
    }
    public double getAmount(){
        return amount;
    }
    public Money add(Money other){
        return new Money(amount + other.amount);
    }
    public Money multiply(int qty){
        return new Money(amount * qty);
    }
}
