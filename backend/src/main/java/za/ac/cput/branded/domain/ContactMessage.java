package za.ac.cput.branded.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "contact_message")
public class ContactMessage {

    @Id
    private String id;
    private String userId;      // nullable — guests can submit without an account
    private String name;
    private String email;
    private String subject;
    private String message;
    private String status;      // e.g. "NEW", "READ", "RESOLVED"
    private String createdAt;
    private String adminNotes;

    protected ContactMessage() {}

    public ContactMessage(Builder builder) {
        this.id = builder.id;
        this.userId = builder.userId;
        this.name = builder.name;
        this.email = builder.email;
        this.subject = builder.subject;
        this.message = builder.message;
        this.status = builder.status;
        this.createdAt = builder.createdAt;
        this.adminNotes = builder.adminNotes;
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

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
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

    public String getAdminNotes() {
        return adminNotes;
    }

    public void setAdminNotes(String adminNotes) {
        this.adminNotes = adminNotes;
    }

    public static class Builder {
        private String id;
        private String userId;
        private String name;
        private String email;
        private String subject;
        private String message;
        private String status;
        private String createdAt;
        private String adminNotes;

        public Builder setId(String id) {
            this.id = id;
            return this;
        }

        public Builder setUserId(String userId) {
            this.userId = userId;
            return this;
        }

        public Builder setName(String name) {
            this.name = name;
            return this;
        }

        public Builder setEmail(String email) {
            this.email = email;
            return this;
        }

        public Builder setSubject(String subject) {
            this.subject = subject;
            return this;
        }

        public Builder setMessage(String message) {
            this.message = message;
            return this;
        }

        public Builder setStatus(String status) {
            this.status = status;
            return this;
        }

        public Builder setCreatedAt(String createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public Builder setAdminNotes(String adminNotes) {
            this.adminNotes = adminNotes;
            return this;
        }

        public ContactMessage build() {
            return new ContactMessage(this);
        }
    }
}
