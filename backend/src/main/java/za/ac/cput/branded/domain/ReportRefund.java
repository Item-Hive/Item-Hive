package za.ac.cput.branded.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name= "report_refund")
public class ReportRefund {
    @Id
    private String id;
    private String userId;
    private String orderId;
    private String itemName;
    private String type ;
    private String reason;
    private String description;
    private boolean hasPhoto = false;
    private String status;
    private String createdAt;
    private String updatedAt;
    private String adminNotes;
    private String photoUrl;


    protected ReportRefund(){}

    public ReportRefund(Builder builder) {
        this.userId = builder.userId;
        this.orderId = builder.orderId;
        this.itemName =builder.itemName;
        this.type=builder.type;
        this.reason=builder.reason;
        this.description=builder.description;
        this.hasPhoto=builder.hasPhoto;
        this.status=builder.status;
        this.createdAt=builder.createdAt;
        this.updatedAt=builder.updatedAt;
        this.adminNotes=builder.adminNotes;
        this.photoUrl = builder.photoUrl;

    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUserId() {
        return userId;
    }

    public String getOrderId() {
        return orderId;
    }

    public void setOrderId(String orderId) {
        this.orderId = orderId;
    }

    public String getItemName() {
        return itemName;
    }

    public void setItemName(String itemName) {
        this.itemName = itemName;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public boolean isHasPhoto() {
        return hasPhoto;
    }

    public void setHasPhoto(boolean hasPhoto) {
        this.hasPhoto = hasPhoto;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public String getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(String updatedAt) {
        this.updatedAt = updatedAt;
    }

    public String getAdminNotes() {
        return adminNotes;
    }

    public void setAdminNotes(String adminNotes) {
        this.adminNotes = adminNotes;
    }

    public String getPhotoUrl() {
        return photoUrl;
    }

    public void setPhotoUrl(String photoUrl) {
        this.photoUrl = photoUrl;
    }

    public static class Builder {
        private String userId;
        private String orderId;
        private String itemName;
        private String type ;
        private String reason;
        private String description;
        private boolean hasPhoto ;
        private String status;
        private String createdAt;
        private String updatedAt;
        private String adminNotes;
        private String photoUrl;

        public Builder setUserId(String userId){
            this.userId = userId;
            return this;
        }
        public Builder setOrderId(String orderId){
            this.orderId = orderId;
            return this;
        }
        public Builder setItemName(String itemName){
            this.itemName = itemName;
            return this;
        }



        public Builder setReason(String reason){
            this.reason = reason;
            return this;
        }
        public Builder setDescription(String description){
            this.description =description;
            return this;
        }
        public Builder setHasPhoto(boolean hasPhoto){
            this.hasPhoto = hasPhoto;
            return this;
        }
        public Builder setStatus(String status){
            this.status = status;
            return this;
        }
        public Builder setCreatedAt(String createdAt){
            this.createdAt = createdAt;
            return this;
        }
        public Builder setUpdatedAt(String updatedAt){
            this.updatedAt= updatedAt;
            return this;
        }
        public Builder setAdminNotes(String adminNotes){
            this.adminNotes = adminNotes;
            return this;
        }
        public Builder setPhotoUrl(String photoUrl){
            this.photoUrl = photoUrl;
            return this;
        }
        public Builder setType(String type){
            this.type = type;
            return this;
        }
        public ReportRefund build(){
            return new ReportRefund(this);
        }

    }
}
