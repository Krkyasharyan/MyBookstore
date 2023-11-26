package com.example.api.controller;

import com.example.api.model.Order;
import com.example.api.service.OrdersService;
import lombok.AllArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;


@RestController
@AllArgsConstructor
@RequestMapping("api/orders")
@CrossOrigin(origins = "http://localhost:3000", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE})
public class OrdersController {

    private OrdersService ordersService;

    @Autowired
    private KafkaTemplate<String, Long> userIdKafkaTemplate;

    @PostMapping("/user/{userId}")
    public ResponseEntity<?> createOrder(@PathVariable int userId) {
        Long userIdLong = Long.valueOf(userId);
        System.out.println("Sending order request for user: " + userIdLong);
        userIdKafkaTemplate.send("OrderRequests", userIdLong);
        return new ResponseEntity<>("Order Request Received.", HttpStatus.CREATED);
    }


    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderById(@PathVariable Long id) {
        Order order = ordersService.getOrderById(id);
        return new ResponseEntity<>(order, HttpStatus.OK);
    }

    @GetMapping("/user/{userId}")
    public List<Order> getOrderByUserId(@PathVariable Long userId) {
        return ordersService.getOrdersByUserId(userId);
    }

    @GetMapping
    public ResponseEntity<List<Order>>getAllOrders() {
        List<Order> orders = ordersService.getAllOrders();
        return new ResponseEntity<>(orders, HttpStatus.OK);
    }

    // @GetMapping("/booksStats")
    // public ResponseEntity<List<BookSalesDTO>> getBookStats(@RequestParam("start") LocalDate startDate,
    //                                                  @RequestParam("end") LocalDate endDate) {
    //     List<BookSalesDTO> stats = ordersService.getBookStats();
    //     return new ResponseEntity<>(stats, HttpStatus.OK);
    // }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable long id) {
        ordersService.deleteOrder(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
