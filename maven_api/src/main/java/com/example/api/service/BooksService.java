package com.example.api.service;

import com.example.api.model.Book;
import com.example.api.model.MBook;

import java.util.List;

public interface BooksService {
    Book createBook(Book order);

    Book getBookById(String id);

    List<Book> GetAllBooks();

    Book updateBook(Book order);

    void deleteBook(String id);

    List<MBook> searchBooksByTag(String tagName);

    List<MBook> searchBooksByTitle(String title);
}
