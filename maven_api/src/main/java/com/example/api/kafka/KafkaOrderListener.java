package com.example.api.kafka;

import com.example.api.model.Order;
import com.example.api.service.OrdersService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;
import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.IOException;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.messaging.handler.annotation.Headers;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.MessageHeaders;
import com.fasterxml.jackson.databind.ObjectMapper;

@Component
public class KafkaOrderListener {
     @Autowired
    private OrdersService ordersService;

    @Autowired
    private KafkaTemplate<String, Order> orderKafkaTemplate;

    @Autowired
    private ObjectMapper objectMapper;

    @KafkaListener(topics = "OrderRequests", groupId = "group_id",  properties = {"value.deserializer:org.apache.kafka.common.serialization.LongDeserializer"})
    public void consumeOrder(Long userId) {
        // Logic to process the order

        if (userId == null) {
            System.out.println("User ID is null");
            return;
        }

        System.out.println("User ID received: " + userId);

        Order completedOrder = ordersService.createOrder(userId);

        System.out.println("Order created: " + completedOrder.toString());

        // Serialize the Order object to a JSON string
        try {
            String jsonStr = objectMapper.writeValueAsString(completedOrder);
            System.out.println("Serialized Order to JSON: " + jsonStr);
        } catch (Exception e) {
            System.out.println("Error serializing Order: " + e.getMessage());
        }
        // Send the completed order to the Kafka topic
        orderKafkaTemplate.send("CompletedOrders", completedOrder);
    }



    @KafkaListener(topics = "CompletedOrders", groupId = "group_id",  properties = {"value.deserializer:org.springframework.kafka.support.serializer.ErrorHandlingDeserializer",
    "spring.kafka.value.deserializer.delegate.class:org.springframework.kafka.support.serializer.JsonDeserializer"})
    public void consumeCompletedOrder(@Payload Order order, @Headers MessageHeaders headers) {
        System.out.println("Kafka Listener Triggered for CompletedOrders");
        System.out.println("Order received: " + order.toString());


    // Logic to process the order
        try {
            BufferedWriter writer = new BufferedWriter(new FileWriter("D:/completed_orders.txt", true));
            writer.write("Completed Order: " + order.toString());
            writer.newLine();  // New line
            writer.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
