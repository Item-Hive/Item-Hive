package za.ac.cput.branded.domain;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity(name= "student")
@DiscriminatorValue("student")
public class Student extends User{
    private String studentNumber;

   // Student.java
    private Student(Builder builder){
    super(builder);
    this.studentNumber = builder.studentNumber;
}

    }
    protected Student(){}

    public String getStudentNumber() {
        return studentNumber;
    }

    public void setStudentNumber(String studentNumber) {
        this.studentNumber = studentNumber;
    }
    public static class Builder extends User.Builder{
        private String studentNumber;

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

        public Builder setStudentNumber(String studentNumber){
            this.studentNumber= studentNumber;
            return this;
        }
        public Student build(){
            return new Student(this);
        }
    }
}
