package com.example.api.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import com.example.api.model.Book;
import com.example.api.repository.BooksRepository;

import java.util.List;
import java.util.Optional;
import org.apache.logging.log4j.Logger;
import org.apache.logging.log4j.LogManager;
import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class BooksServiceImpl implements BooksService {

    @Autowired
    private BooksRepository booksRepository;

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    @Autowired
    private StringRedisTemplate stringRedisTemplate;

    private static final Logger logger = LogManager.getLogger(BooksServiceImpl.class);

    private boolean isCacheAvailable() {
        try {
            return stringRedisTemplate.getConnectionFactory().getConnection().ping() != null;
        } catch (Exception e) {
            logger.error("Cache is not available");
            return false;
        }
    }
    

    @Override
    public Book createBook(Book book) {
        logger.info("Writing to database for id: " + (book.getId() != null ? book.getId() : "null"));
        Book newBook = booksRepository.save(book);

        if (isCacheAvailable()) {
            logger.info("Cache put for createBook for id: " + newBook.getId());
            redisTemplate.opsForValue().set("book:" + newBook.getId(), newBook);

            // Invalidate the old set of books
            redisTemplate.delete("allBooks"); 
        }
        return newBook;
    }

    @Override
    public Book getBookById(long id) {
        long startTime = 0, endTime = 0;
        Book book = null;
        
        if (isCacheAvailable()) {
            startTime = System.nanoTime();
            book = (Book) redisTemplate.opsForValue().get("book:" + id);
            endTime = System.nanoTime();
        }
        
        if (book != null) {
            logger.info("Cache hit for getBookById for id: " + id + ". Time taken: " + ((endTime - startTime) / 1000000) + " ms");
            return book;
        }

        startTime = System.nanoTime();
        Optional<Book> optionalBook = booksRepository.findById(id);

        if (optionalBook.isPresent()) {
            book = optionalBook.get();
            endTime = System.nanoTime();
            logger.info("Cache miss for getBookById for id: " + id + ". Time taken: " + ((endTime - startTime) / 1000000)+ " ms");
            if (isCacheAvailable()) {
                redisTemplate.opsForValue().set("book:" + id, book);
                logger.info("Cache put for getBookById for id: " + id);
            }
        }
        return book;
    }

    @Override
    public List<Book> GetAllBooks() {
        long startTime = 0, endTime = 0;


        List<Book> books = null;

        if (isCacheAvailable()) {
            startTime = System.nanoTime();
            books = (List<Book>) redisTemplate.opsForValue().get("allBooks");
            endTime = System.nanoTime();
        }


        if (books != null && !books.isEmpty()) {
            logger.info("Cache hit for GetAllBooks, time taken: " + ((endTime - startTime) / 1000000) + " ms");
            return books;
        }

        startTime = System.nanoTime();
        books = booksRepository.findAll();
        endTime = System.nanoTime();

        if (isCacheAvailable()) {
            redisTemplate.opsForValue().set("allBooks", books);
            logger.info("Cache miss for GetAllBooks, time taken: " + ((endTime - startTime) / 1000000) + " ms");
            logger.info("Cache put for GetAllBooks");
        }

        return books;
    }
    

    @Override
    public Book updateBook(Book book) {
        logger.info("Cache evict for updateBook for id: " + book.getId());
        Book existingBook = booksRepository.findById(book.getId()).orElse(null);

        if (existingBook != null) {
            // Update fields
            existingBook.setAuthor(null != book.getAuthor() ? book.getAuthor() : existingBook.getAuthor());
            existingBook.setDescription(null != book.getDescription() ? book.getDescription() : existingBook.getDescription());
            existingBook.setId(0 != book.getId() ? book.getId() : existingBook.getId());
            existingBook.setImage_url(null != book.getImage_url() ? book.getImage_url() : existingBook.getImage_url());
            existingBook.setPrice(0 != book.getPrice() ? book.getPrice() : existingBook.getPrice());
            existingBook.setTitle(null != book.getTitle() ? book.getTitle() : existingBook.getTitle());
            existingBook.setType(null != book.getType() ? book.getType() : existingBook.getType());
            existingBook.setQuantity(null != book.getQuantity() ? book.getQuantity() : existingBook.getQuantity());

            // Update in database
            Book updatedBook = booksRepository.save(existingBook);

            if (isCacheAvailable()) {
                redisTemplate.opsForValue().set("book:" + updatedBook.getId(), updatedBook);
                redisTemplate.delete("allBooks");
            }
            
            return updatedBook;
        }

        return null;
    }

    @Override
    public void deleteBook(long id) {
        booksRepository.deleteById(id);

        if (isCacheAvailable()) {
            // Evict from cache
            redisTemplate.delete("book:" + id);
            // Invalidate the old set of books
            redisTemplate.delete("allBooks"); 
        }
        
        logger.info("Cache evict for deleteBook for id: " + id);
    }
}
