package za.ac.cput.branded.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "User")
public abstract class User {
    @Id
    private String  id;
    private String email;
    private String password;



    protected User(){

    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setEmail(String email) {
        this.email = email;
    }



    public User (Builder builder){
    this.id = builder.id;
    this.email = builder.email;
    this.password = builder.password;

    }
    public static abstract class Builder {
        private String id;
        private String email;
        private String password;


        public Builder setId(String id){
            this.id = id;
            return this;
        }
        public Builder setEmail(String email){
            this.email = email;
            return this;
        }
        public Builder setPassword(String password){
            this.password= password;
            return this;
        }

        public abstract User build();
    }

}
