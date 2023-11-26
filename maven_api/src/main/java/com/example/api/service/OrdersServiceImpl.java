package com.example.api.service;

import com.example.api.model.Order;
import com.example.api.model.OrderItem;
import com.example.api.model.Cart;
import com.example.api.repository.OrdersRepository;
import com.example.api.repository.UsersRepository;
import com.example.api.repository.CartRepository;
import org.springframework.beans.factory.annotation.Autowired;

import lombok.AllArgsConstructor;

import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.ArrayList;
import java.util.List;

import org.hibernate.Hibernate;

import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.annotation.Propagation;

@Service
@AllArgsConstructor
public class OrdersServiceImpl implements OrdersService {
    
    private OrdersRepository ordersRepository;
    private UsersRepository usersRepository;
    private CartRepository cartRepository;


    @Override
    @Transactional(propagation = Propagation.REQUIRED)
    public Order createOrder(Long userId) {
        Cart cart = cartRepository.findByUser_Id(userId).getUser().getCart();
        Hibernate.initialize(cart.getCartItems());  // Initialize the collection
        if(cart.getCartItems().isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }
        
        Order order = new Order();
        order.setUser(cart.getUser());
        order.setOrderItems(new ArrayList<OrderItem>());
        order.setUserId(userId);
    
        // Use an Order array as a container
        Order[] orderContainer = { order };
    
        // Save the order first
        orderContainer[0] = ordersRepository.save(orderContainer[0]);
        
        cart.getCartItems().forEach(cartItem -> {
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(orderContainer[0]);  // Use the order from the container
            orderItem.setBook(cartItem.getBook());
            orderItem.setQuantity(cartItem.getQuantity());
            // use the current time as the order time
            orderContainer[0].getOrderItems().add(orderItem);
            orderContainer[0].setTime(System.currentTimeMillis());
            orderContainer[0].setBuyerUsername(cart.getUser().getUsername());
        });
    
        // The OrderItems will be persisted through the Order, because of CascadeType.ALL
        ordersRepository.save(orderContainer[0]);

        // Variable to toggle exception
        boolean throwError = false;  // Set this to true for testing
        
        // Injected code to simulate an exception and test atomicity
        if (throwError) {
            throw new RuntimeException("Simulated exception to test atomicity");
        }
    
        cart.getCartItems().clear();
        cartRepository.save(cart);
        usersRepository.save(cart.getUser());
        System.out.println("*** *** From ordersServiceImplementation: " + orderContainer[0].getUser().toString());
        return orderContainer[0];         
    }
    

    //@Override
    // public List<BookSalesDTO> getBookStats(){
    //     List<BookSalesDTO> bookSalesDTOs = new ArrayList<>();
    //     List<Order> orders = ordersRepository.findAll();
    //     orders.forEach(order -> {
    //         order.getOrderItems().forEach(orderItem -> {
    //             //check if book is already in the list
    //             boolean found = false;
    //             for(BookSalesDTO bookSalesDTO : bookSalesDTOs){
    //                 if(bookSalesDTO.getBook().getId() == orderItem.getBook().getId()){
    //                     bookSalesDTO.setSales(bookSalesDTO.getSales() + orderItem.getQuantity());
    //                     found = true;
    //                     break;
    //                 }
    //             }
    //             if(!found){
    //                 BookSalesDTO bookSalesDTO = new BookSalesDTO();
    //                 bookSalesDTO.setBook(orderItem.getBook());
    //                 bookSalesDTO.setSales(orderItem.getQuantity());
    //                 bookSalesDTOs.add(bookSalesDTO);
    //             }
    //         });
    //     });
    //     return bookSalesDTOs;
    // }
    

    @Override
    public Order getOrderById(long id) {
        Optional<Order> optionalOrder = ordersRepository.findById(id);
        return optionalOrder.get();
    }

    @Override
    public Order GetOrder() {
        return ordersRepository.findAll().get(0);
    }

    @Override
    public List<Order> getAllOrders() {
        return ordersRepository.findAll();
    }

    @Override
    public List<Order> getOrdersByUserId(Long userId) {
        return ordersRepository.findAllByUser_Id(userId);
    }

    @Override
    public void deleteOrder(long id) {
        ordersRepository.deleteById(id);
    }

    // @Override
    // public Order addOrderItem(Long userId){
    //     Order order = ordersRepository.findByUser_Id(userId).getUser().getOrder();
    //     Cart cart = cartRepository.findByUser_Id(userId).getUser().getCart();
    //     AtomicBoolean found = new AtomicBoolean(false);
    //     cart.getCartItems().forEach( cartItem -> {
    //         order.getOrderItems().forEach(orderItem -> {
    //             if(orderItem.getBook().getId() == cartItem.getBook().getId()){
    //                 orderItem.setQuantity(orderItem.getQuantity() + cartItem.getQuantity());
    //                 found.set(true);
    //             }
    //         });
    //         if(found.get() == false){
    //             OrderItem orderItem = new OrderItem();
    //             orderItem.setBook(booksRepository.findById(cartItem.getBook().getId()).get());
    //             orderItem.setQuantity(cartItem.getQuantity());
    //             orderItem.setOrder(order);
    //             order.getOrderItems().add(orderItem);
    //         }
    //         found.set(false);
    //     });

    //     cart.getCartItems().clear();
    //     cartRepository.save(cart);
    //     usersRepository.save(cart.getUser());
    //     return ordersRepository.save(order);
    // }
    
}
