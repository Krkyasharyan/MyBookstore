package com.example.api.model;

import lombok.NoArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter
public class PriceRequest {
    private double price;
    private int quantity;
}
