package za.ac.cput.branded.domain;

import jakarta.persistence.Embeddable;

@Embeddable
public class Category {
    private String name;


    public  Category(Builder builder){
        this.name = builder.name;

    }
    protected Category(){}

    public String getName() {
        return name;
    }

    public static class Builder{
        private String name;



        public Builder setName(String name){
            this.name = name;
            return this;
        }

        public Category build(){
            if(name == null || name.isEmpty())return null;

            return new Category(this);
        }
    }
}
