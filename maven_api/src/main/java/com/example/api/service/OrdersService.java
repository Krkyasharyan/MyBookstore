package com.example.api.service;

import com.example.api.model.Order;

import java.util.List;

public interface OrdersService {
    Order createOrder(Long userId);

    Order getOrderById(long id);

    Order GetOrder();

    List<Order> getAllOrders();

    List<Order> getOrdersByUserId(Long userId);

    void deleteOrder(long id);

    //List<BookSalesDTO> getBookStats();

    //Order addOrderItem(Long userId);
}
