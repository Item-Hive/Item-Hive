package za.ac.cput.branded;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync  
public class BrandedApplication {
    public static void main(String[] args) {
        SpringApplication.run(BrandedApplication.class, args);
    }
}