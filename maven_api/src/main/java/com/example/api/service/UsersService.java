package com.example.api.service;

import com.example.api.model.User;


import java.util.List;

public interface UsersService {

    User createUser(User user);

    User findByUsername(String username);

    User findByEmail(String email);

    User findUserById(long id);

    List<User> findAllUsers();

    User updateUser(User user);

    void deleteUser(long id);

    Long authenticate(User user);

}
