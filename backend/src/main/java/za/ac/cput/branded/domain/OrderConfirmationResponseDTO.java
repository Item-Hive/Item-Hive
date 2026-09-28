package za.ac.cput.branded.domain;

public class OrderConfirmationResponseDTO {
    private String orderNumber;
    private double total;
    private String status;
    private boolean emailSent;

    public OrderConfirmationResponseDTO(String orderNumber, double total, String status,
                                        boolean emailSent) {
        this.orderNumber = orderNumber;
        this.total = total;
        this.status = status;
        this.emailSent = emailSent;
    }

    public String getOrderNumber() { return orderNumber; }
    public double getTotal() { return total; }
    public String getStatus() { return status; }
    public boolean isEmailSent() { return emailSent; }
}