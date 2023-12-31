package com.example.api.controller;

import com.example.api.model.Cart;
import com.example.api.service.CartService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@AllArgsConstructor
@RequestMapping("api/cart")
@CrossOrigin(origins = "http://localhost:3000", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE})

public class CartController {

    private CartService cartService;

    @PostMapping
    public ResponseEntity<Cart> createCart(@RequestParam int userId, @RequestParam String bookId, @RequestParam int quantity) {
        Cart cart = cartService.createCart(userId, bookId, quantity);
        return new ResponseEntity<>(cart, HttpStatus.CREATED);
    }

    @GetMapping("/user/{userId}")
    public Cart getCartByUserId(@PathVariable Long userId) {
        return cartService.getCartByUserId(userId);
    }


    @GetMapping
    public ResponseEntity<Cart> getAllCarts() {
        Cart cart = cartService.GetAllCarts();
        return new ResponseEntity<>(cart, HttpStatus.OK);
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> deleteCart(@PathVariable long id) {
        cartService.deleteCart(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @DeleteMapping("/{bookId}/{userId}")
    public ResponseEntity<Void> deleteCartItem(@PathVariable String bookId, @PathVariable long userId) {
        cartService.deleteCartItem(bookId, userId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
    
}
