package za.ac.cput.branded.domain;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity(name = "admin")
@DiscriminatorValue("admin")
public class Admin extends User{
    private String idNumber;

    public Admin (Builder builder){
        super(builder);
        this.idNumber = idNumber;
    }
    protected Admin(){

    }

    public String getIdNumber() {
        return idNumber;
    }

    public void setIdNumber(String idNumber) {
        this.idNumber = idNumber;
    }
    public static class Builder extends User.Builder{
        private String idNumber;

        @Override
        public Builder setId(String id){
            super.setId(id);
            return this;
        }
        @Override
        public Builder setEmail(String email){
            super.setEmail(email);
            return this;
        }
        @Override
        public Builder setPassword(String password){
            super.setPassword(password);
            return this;
        }

        public Builder setIdNumber(String  idNumber){
            this.idNumber = idNumber;
            return this;
        }
        public Admin build(){
            return new Admin(this);
        }
    }
}
