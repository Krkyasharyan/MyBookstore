package com.example.api.repository;

import com.example.api.model.Cart;
import org.springframework.data.jpa.repository.JpaRepository;


public interface CartRepository extends JpaRepository<Cart, Long>{
    Cart findByUser_Id(Long userId);
    void deleteByUser_Id(Long userId);
}
