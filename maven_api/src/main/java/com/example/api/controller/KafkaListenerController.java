package com.example.api.controller;

import org.springframework.stereotype.Controller;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;

import java.util.concurrent.ConcurrentHashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import com.example.api.model.Order;
import com.example.api.webSocket.WebSocketServer;

@Controller
public class KafkaListenerController {

    @Autowired
    private WebSocketServer webSocketServer;
    
    @KafkaListener(topics = "CompletedOrders", groupId = "group-id")
    public void listen(Order order) {

        System.out.println("Kafka Listener Triggered for CompletedOrders");
        // Get the user ID from the order
        //System.out.println(order.toString());
        //String userId = order.getUser().getId().toString();

        // Send the order to the user
        String userId = order.getUserId().toString();
        System.out.println("User ID received: " + order.getUserId().toString());
        webSocketServer.sendMessageToUser(userId, order.toString());
    }
}
