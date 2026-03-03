package com.immocorp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class ImmocorpApplication {

    public static void main(String[] args) {
        SpringApplication.run(ImmocorpApplication.class, args);
    }

}
