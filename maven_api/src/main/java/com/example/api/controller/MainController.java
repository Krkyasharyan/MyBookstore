package com.example.api.controller;

import lombok.AllArgsConstructor;
import com.example.api.microservices.FunctionServiceClient;
import com.example.api.model.PriceRequest;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;

import org.springframework.web.bind.annotation.*;

@RestController
@AllArgsConstructor
@RequestMapping("api/services")
@CrossOrigin(origins = "http://localhost:3000")
public class MainController {
    @Autowired
    private FunctionServiceClient functionServiceClient;

    @PostMapping("/getPrice")
    public double calculatePrice(@RequestBody List<PriceRequest> requests) {
        return functionServiceClient.calculatePrice(requests);
    }
}
