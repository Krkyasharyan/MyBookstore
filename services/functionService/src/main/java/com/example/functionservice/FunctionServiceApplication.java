package com.example.functionservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import com.example.functionservice.functions.CalculatePriceFunction;

@SpringBootApplication
public class FunctionServiceApplication {



    public static void main(String[] args) {
        SpringApplication app = new SpringApplication(FunctionServiceApplication.class);
        app.run(args);
    }


    @Bean
    public CalculatePriceFunction calculatePriceFunction() {
        return new CalculatePriceFunction();
    }
}
