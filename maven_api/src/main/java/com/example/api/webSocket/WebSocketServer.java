package com.example.api.webSocket;

import org.springframework.stereotype.Component;

import jakarta.websocket.*;
import jakarta.websocket.server.PathParam;
import jakarta.websocket.server.ServerEndpoint;
import java.io.IOException;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

@ServerEndpoint(value = "/transfer/{userId}")
@Component
public class WebSocketServer {

    public WebSocketServer() {
        // Whenever there is a new connection, the constructor will be executed once
        System.out.println("New connection...");
    }

    private static final AtomicInteger COUNT = new AtomicInteger();

    private static final ConcurrentHashMap<String, Session> SESSIONS = new ConcurrentHashMap<>();

    public void sendMessage(Session toSession, String message) {
        if (toSession != null) {
            try {
                toSession.getBasicRemote().sendText(message);
            } catch (IOException e) {
                e.printStackTrace();
            }
        } else {
            System.out.println("The other party is offline");
        }
    }

    public void sendMessageToUser(String user, String message) {
        System.out.println(user);
        Session toSession = SESSIONS.get(user);
        sendMessage(toSession, message);
        System.out.println(message);
    }


    @OnMessage
    public void onMessage(String message) {
        System.out.println("Server received a message: " + message);
    }

    @OnOpen
    public void onOpen(Session session, @PathParam("userId") String userId) {
        if (SESSIONS.get(userId) != null) {
            System.out.println("Already online");
            return;
        }
        SESSIONS.put(userId.trim(), session);
        COUNT.incrementAndGet();
        System.out.println(userId + " is online now, current online count: " + COUNT);

    }

    @OnClose
    public void onClose(@PathParam("userId") String userId) {
        SESSIONS.remove(userId);
        COUNT.decrementAndGet();
        System.out.println(userId + " went offline, current online count: " + COUNT);
    }

    @OnError
    public void onError(Session session, Throwable throwable) {
        System.out.println("An error occurred");
        throwable.printStackTrace();
    }
}   
