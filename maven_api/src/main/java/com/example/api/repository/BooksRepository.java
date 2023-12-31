package com.example.api.repository;

import com.example.api.model.MBook;

import java.util.List;
import java.util.Set;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface BooksRepository extends MongoRepository<MBook, String> {
    List<MBook> findByTagsIn(Set<String> tags);
    List<MBook> findByTitleContainingIgnoreCase(String title);
}
