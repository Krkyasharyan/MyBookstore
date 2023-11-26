package com.example.api.service;

import com.example.api.model.Cart;


public interface CartService {
    Cart createCart(int userId, int bookId, int quantity);

    Cart getCartByUserId(Long userId);

    Cart GetAllCarts();

    void deleteCart(long userId);

    void deleteCartItem(long bookId, long userId);

    Cart addCartItem(Long userId, Long bookId, int quantity);
}
