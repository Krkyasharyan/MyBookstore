package com.example.api.controller;

import com.example.api.dto.UserResponseDTO;
import com.example.api.model.Book;
import com.example.api.model.User;
import com.example.api.service.BooksService;
import com.example.api.service.SessionTimerService;
import com.example.api.service.UsersService;

import lombok.AllArgsConstructor;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

@RestController
@AllArgsConstructor
@RequestMapping("api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    private UsersService usersService;
    private SessionTimerService sessionTimerService;

    @GetMapping("/getUserInfo")
    public ResponseEntity<UserResponseDTO> getUserInfo(HttpSession session){
        UserResponseDTO responseDTO = new UserResponseDTO();
        System.out.println(session.getId());
        System.out.println(session.getAttribute("userId"));
        responseDTO.setUserId((Integer)session.getAttribute("userId"));
        responseDTO.setUsername((String)session.getAttribute("username"));
        responseDTO.setIsAdmin((Boolean)session.getAttribute("isAdmin"));
        responseDTO.setIsDisabled((Boolean)session.getAttribute("isDisabled"));
        return ResponseEntity.ok(responseDTO);
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody User user, HttpSession session) {
        Long userId = usersService.authenticate(user);
        User existingUser = usersService.findByUsername(user.getUsername());

        if (userId != null) {
            session.setAttribute("userId", userId.intValue());
            session.setAttribute("username", user.getUsername());
            session.setAttribute("isAdmin", existingUser.getIsAdmin());
            session.setAttribute("isDisabled", existingUser.getIsDisabled());

            sessionTimerService.startTimer();

            Map<String, Object> response = new HashMap<>();
            response.put("userId", userId);
            response.put("username", user.getUsername());
            response.put("isAdmin", existingUser.getIsAdmin());
            response.put("isDisabled", existingUser.getIsDisabled());

            return new ResponseEntity<>(response, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
    }


    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpSession session) {
        long elapsedTime = sessionTimerService.stopTimer();
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Logged out successfully");
        response.put("elapsedTime", elapsedTime);  // Elapsed time in milliseconds
        session.invalidate();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
    
}
