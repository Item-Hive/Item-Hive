package za.ac.cput.branded.domain;

import jakarta.persistence.Embeddable;

@Embeddable
public class Company {
    private String name;
    private String emailAddress;
    private int phone;


    protected Company(){}

    public Company(Builder builder){
        this.name = builder.name;
        this.emailAddress = builder.emailAddress;
        this.phone = builder.phone;
    }

    public String getName() {
        return name;
    }

    public String getEmailAddress() {
        return emailAddress;
    }

    public int getPhone() {
        return phone;
    }
    public static class Builder{
        private String name ;
        private String emailAddress;
        private int phone;


        public Builder setName(String name){
            this.name = name;
            return this;
        }
        public Builder setEmailAddress(String emailAddress){
            this.emailAddress = emailAddress;
            return this;
        }
        public Builder setPhone(int phone){
            this.phone = phone;
            return this;
        }
        public Company build(){
            if(name == null || name.isEmpty())return null;
            if(emailAddress == null || emailAddress.isEmpty())return null;
            if(phone < 0)return null;
            return new Company(this);
        }
    }
}
