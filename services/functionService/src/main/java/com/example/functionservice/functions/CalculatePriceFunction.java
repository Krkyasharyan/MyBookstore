package com.example.functionservice.functions;

import java.util.function.Function;
import com.example.functionservice.models.BookOrder;
import java.util.List;

public class CalculatePriceFunction implements Function<List<BookOrder>, Double> {

    @Override
    public Double apply(List<BookOrder> books) {

        double total = 0.0;

        for (BookOrder book : books) {
            total += (book.getPrice() * book.getQuantity());
        }

        return total;
    }
}
