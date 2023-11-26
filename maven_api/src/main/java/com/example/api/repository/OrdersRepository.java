package com.example.api.repository;

import com.example.api.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrdersRepository extends JpaRepository<Order, Long> {
    List<Order> findAllByUser_Id(Long userId);
}
