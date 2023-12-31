package com.example.api.service;

import com.example.api.model.Cart;


public interface CartService {
    Cart createCart(int userId, String bookId, int quantity);

    Cart getCartByUserId(Long userId);

    Cart GetAllCarts();

    void deleteCart(long userId);

    void deleteCartItem(String bookId, long userId);

    Cart addCartItem(Long userId, String bookId, int quantity);
}
