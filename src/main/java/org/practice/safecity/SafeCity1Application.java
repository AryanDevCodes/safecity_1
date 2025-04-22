package org.practice.safecity;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.config.EnableMongoAuditing;

@EnableMongoAuditing
@SpringBootApplication
public class SafeCity1Application {

    public static void main(String[] args) {
        SpringApplication.run(SafeCity1Application.class, args);
    }

}
