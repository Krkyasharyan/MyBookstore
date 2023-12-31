package com.example.api.controller;

import com.example.api.model.Book;
import com.example.api.model.MBook;
import com.example.api.service.BooksService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@AllArgsConstructor
@RequestMapping("api/books")
@CrossOrigin(origins = "http://localhost:3000")
public class BooksController {

    private BooksService booksService;

    @GetMapping("/searchByTag")
    public ResponseEntity<List<MBook>> searchBooksByTag(@RequestParam String tag) {
        List<MBook> books = booksService.searchBooksByTag(tag);
        return ResponseEntity.ok(books);
    }    

    @PostMapping
    public ResponseEntity<Book> createBook(@RequestBody Book book) {
        Book newBook = booksService.createBook(book);
        return new ResponseEntity<>(newBook, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Book> getBookById(@PathVariable("id") String id) {
        Book book = booksService.getBookById(id);
        return new ResponseEntity<>(book, HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<List<Book>> getAllBooks() {
        List<Book> books = booksService.GetAllBooks();
        return new ResponseEntity<>(books, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Book> updateBook(@PathVariable("id") String id, @RequestBody Book book) {
        book.setMongoId(id);
        Book updatedBook = booksService.updateBook(book);
        return new ResponseEntity<>(updatedBook, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBook(@PathVariable("id") String id) {
        booksService.deleteBook(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
