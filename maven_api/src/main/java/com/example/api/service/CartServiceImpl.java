package com.example.api.service;

import com.example.api.model.Cart;
import com.example.api.model.CartItem;
import com.example.api.model.User;
import com.example.api.model.Book;
import com.example.api.repository.CartRepository;
import com.example.api.repository.UsersRepository;
import com.example.api.repository.BooksRepository;
import com.example.api.service.BooksService;

import lombok.AllArgsConstructor;

import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.ArrayList;
import java.util.Iterator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


@Service
@AllArgsConstructor

public class CartServiceImpl implements CartService{
    
    private CartRepository cartRepository;
    private UsersRepository usersRepository;
    private BooksRepository booksRepository;
    private BooksService booksService;

    private static final Logger logger = LoggerFactory.getLogger(CartServiceImpl.class);


    @Override
public Cart createCart(int userId, String bookId, int quantity) {
    Long userIdLong = Long.valueOf(userId);
    Optional<User> userOptional = usersRepository.findById(userIdLong);
    Book book = booksService.getBookById(bookId);
    
    if(userOptional.isPresent() && book != null) {
        User user = userOptional.get();

        Cart cart;
        Optional<Cart> cartOptional = Optional.ofNullable(cartRepository.findByUser_Id(userIdLong));
        if(cartOptional.isPresent()) {
            // if a cart already exists for this user
            cart = addCartItem(userIdLong, bookId, quantity);
        } else {
            // if a cart does not exist for this user
            CartItem cartItem = new CartItem();
            cartItem.setBook(book);
            cartItem.setQuantity(quantity);
    
            cart = new Cart();
            cart.setUser(user);
            ArrayList<CartItem> cartItems = new ArrayList<CartItem>();
            cartItems.add(cartItem);
            cart.setCartItems(cartItems);
            
            cartItem.setCart(cart); // set the cart to the cartItem
        }
        
        cartRepository.save(cart); // save the cart before saving the user
        usersRepository.save(user); // now save the user
    
        return cart;
    } else {
        throw new RuntimeException("User or Book not found");
    }
}

    
    

    @Override
    public Cart getCartByUserId(Long userId) {
        return cartRepository.findByUser_Id(userId);
    }

    @Override
    public Cart GetAllCarts() {
        return cartRepository.findById(Long.valueOf(1)).get();
    }

    @Override
    public void deleteCart(long userId) {
        cartRepository.deleteByUser_Id(userId);
    }

    @Override
    public void deleteCartItem(String bookId, long userId) {
        Cart cart = cartRepository.findByUser_Id(userId);
        User user = usersRepository.findById(userId).get();

        logger.info(null != cart ? "Cart is not null" : "Cart is null");
        logger.info(bookId + " " + userId);

        if(cart == null) {
            throw new RuntimeException("Cart is null");
        }
        
        Iterator<CartItem> iterator = cart.getCartItems().iterator();
        boolean found = false;
        while (iterator.hasNext()) {
            CartItem cartItem = iterator.next();
            if(cartItem.getBook().getId() == Long.valueOf(bookId)){
                iterator.remove();
                found = true;
            }
        }
        if(found == false){
            logger.info("Cart item not found");
        }
        else{
            logger.info(cart.getCartItems().toString());
        }
        user.setCart(cart);
        cart.setUser(user);
        cartRepository.save(cart);
        usersRepository.save(user);
    }
    

    @Override
    public Cart addCartItem(Long userId, String bookId, int quantity) {
        Cart cart = cartRepository.findByUser_Id(userId).getUser().getCart();
        Book book = booksService.getBookById(bookId);
        User user = usersRepository.findById(userId).get();
        AtomicBoolean found = new AtomicBoolean(false);
        cart.getCartItems().forEach(cartItem -> {
            if(cartItem.getBook().getId() == Long.valueOf(bookId)){
                cartItem.setQuantity(cartItem.getQuantity() + quantity);
                found.set(true);;
            }
        });
        if(found.get() == false){
            CartItem cartItem = new CartItem();
            cartItem.setBook(book);
            cartItem.setQuantity(quantity);
            cartItem.setCart(cart);
            cart.getCartItems().add(cartItem);
        }

        cart = cartRepository.save(cart);
        usersRepository.save(user);
        return cart;
    }
}
