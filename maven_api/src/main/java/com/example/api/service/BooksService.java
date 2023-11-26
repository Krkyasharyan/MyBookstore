package com.example.api.service;

import com.example.api.model.Book;

import java.util.List;

public interface BooksService {
    Book createBook(Book order);

    Book getBookById(long id);

    List<Book> GetAllBooks();

    Book updateBook(Book order);

    void deleteBook(long id);
}
