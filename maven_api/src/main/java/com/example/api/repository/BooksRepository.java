package com.example.api.repository;

import com.example.api.model.Book;
import org.springframework.data.jpa.repository.JpaRepository;


public interface BooksRepository extends JpaRepository<Book, Long> {
    
}
