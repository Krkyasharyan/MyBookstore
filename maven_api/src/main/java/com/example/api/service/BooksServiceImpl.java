package com.example.api.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import com.example.api.model.Book;
import com.example.api.model.MBook;
import com.example.api.repository.BooksRepository;

import java.io.Console;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import javax.swing.text.html.HTML.Tag;

import org.apache.logging.log4j.Logger;
import org.apache.logging.log4j.LogManager;
import lombok.AllArgsConstructor;
import com.example.api.service.TagService;

@Service
@AllArgsConstructor
public class BooksServiceImpl implements BooksService {

    @Autowired
    private BooksRepository booksRepository;

    @Autowired
    private TagService tagService;

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
    public List<MBook> searchBooksByTag(String tagName) {
        Set<String> relatedTags = tagService.findAllRelatedTags(tagName);
        return booksRepository.findByTagsIn(relatedTags);
    }

    @Override
    public List<MBook> searchBooksByTitle(String title) {
        return booksRepository.findByTitleContainingIgnoreCase(title);
    }

    @Override
    public Book createBook(Book book) {
        logger.info("Writing to database for id: " + (book.getId() != null ? book.getId() : "null"));

        // Get the id of the last book in the database
        List<MBook> mBooks = booksRepository.findAll();
        long lastId = 0;
        if (!mBooks.isEmpty()) {
            lastId = mBooks.get(mBooks.size() - 1).getSqlId();
        }
        book.setId(lastId + 1);
        MBook mBook = convertBookToMBook(book);
        MBook newMBook = booksRepository.save(mBook);
        Book newBook = convertMBookToBook(newMBook);

        if (isCacheAvailable()) {
            logger.info("Cache put for createBook for id: " + newMBook.getId());
            redisTemplate.opsForValue().set("book:" + newMBook.getId(), newMBook);

            // Invalidate the old set of books
            redisTemplate.delete("allBooks"); 
        }
        return newBook;
    }

    @Override
    public Book getBookById(String id) {
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
        Optional<MBook> optionalMBook = booksRepository.findById(id);
        System.out.println("optionalBook: " + optionalMBook);

        if(optionalMBook.isPresent()) {
            book = convertMBookToBook(optionalMBook.get());
        }
        System.out.println("book: " + book);

        endTime = System.nanoTime();
        logger.info("Cache miss for getBookById for id: " + id + ". Time taken: " + ((endTime - startTime) / 1000000)+ " ms");
        if (isCacheAvailable()) {
            redisTemplate.opsForValue().set("book:" + id, convertBookToMBook(book));
            logger.info("Cache put for getBookById for id: " + id);
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
        List<MBook> MBooks = booksRepository.findAll();
        books = convertMBooksToBooks(MBooks);

        endTime = System.nanoTime();

        if (isCacheAvailable()) {
            redisTemplate.opsForValue().set("allBooks", MBooks);
            logger.info("Cache miss for GetAllBooks, time taken: " + ((endTime - startTime) / 1000000) + " ms");
            logger.info("Cache put for GetAllBooks");
        }

        return books;
    }
    

    @Override
    public Book updateBook(Book book) {
        logger.info("Cache evict for updateBook for id: " + book.getMongoId());
        MBook existingMBook = booksRepository.findById(book.getMongoId()).orElse(null);

        if (existingMBook != null) {
            // Update fields
            existingMBook.setAuthor(null != book.getAuthor() ? book.getAuthor() : existingMBook.getAuthor());
            existingMBook.setDescription(null != book.getDescription() ? book.getDescription() : existingMBook.getDescription());
            existingMBook.setId(null != book.getMongoId() ? book.getMongoId() : existingMBook.getId());
            existingMBook.setSqlId(0 != book.getId() ? book.getId() : existingMBook.getSqlId());
            existingMBook.setImage_url(null != book.getImage_url() ? book.getImage_url() : existingMBook.getImage_url());
            existingMBook.setPrice(0 != book.getPrice() ? book.getPrice() : existingMBook.getPrice());
            existingMBook.setTitle(null != book.getTitle() ? book.getTitle() : existingMBook.getTitle());
            existingMBook.setType(null != book.getType() ? book.getType() : existingMBook.getType());
            existingMBook.setQuantity(null != book.getQuantity() ? book.getQuantity() : existingMBook.getQuantity());

            // Update in database
            MBook updatedMBook = booksRepository.save(existingMBook);
            Book updatedBook = convertMBookToBook(updatedMBook);

            if (isCacheAvailable()) {
                redisTemplate.opsForValue().set("book:" + updatedMBook.getId(), updatedMBook);
                redisTemplate.delete("allBooks");
            }
            
            return updatedBook;
        }

        return null;
    }

    @Override
    public void deleteBook(String id) {
        booksRepository.deleteById(id);

        if (isCacheAvailable()) {
            // Evict from cache
            redisTemplate.delete("book:" + id);
            // Invalidate the old set of books
            redisTemplate.delete("allBooks"); 
        }
        
        logger.info("Cache evict for deleteBook for id: " + id);
    }
    

    // Helper function to convert MBook to Book
    private Book convertMBookToBook(MBook mBook) {
        if(mBook == null) {
            return null;
        }
        Book book = new Book();
        book.setAuthor(mBook.getAuthor());
        book.setDescription(mBook.getDescription());
        book.setId(mBook.getSqlId());
        book.setMongoId(mBook.getId());
        book.setImage_url(mBook.getImage_url());
        book.setPrice(mBook.getPrice());
        book.setTitle(mBook.getTitle());
        book.setType(mBook.getType());
        book.setQuantity(mBook.getQuantity());
        return book;
    }

    // Convert Book to MBook
    private MBook convertBookToMBook(Book book) {
        if(book == null) {
            return null;
        }
        MBook mBook = new MBook();
        mBook.setAuthor(book.getAuthor());
        mBook.setDescription(book.getDescription());
        mBook.setSqlId(book.getId());
        mBook.setId(book.getMongoId());
        mBook.setImage_url(book.getImage_url());
        mBook.setPrice(book.getPrice());
        mBook.setTitle(book.getTitle());
        mBook.setType(book.getType());
        mBook.setQuantity(book.getQuantity());
        return mBook;
    }

    // Convert a list of MBooks to a list of Books
    private List<Book> convertMBooksToBooks(List<MBook> mBooks) {
        List<Book> books = new java.util.ArrayList<>();
        for (MBook mBook : mBooks) {
            books.add(convertMBookToBook(mBook));
        }
        return books;
    }
}
