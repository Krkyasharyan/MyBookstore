package com.example.api.controller;

import com.example.api.dto.UserResponseDTO;
import com.example.api.model.User;
import com.example.api.repository.UsersRepository;
import com.example.api.service.UsersService;
import lombok.AllArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import org.modelmapper.ModelMapper;


@RestController
@AllArgsConstructor
@RequestMapping("api/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UsersController {

    private UsersService usersService;
    private UsersRepository usersRepository;
    private ModelMapper modelMapper;

    @PostMapping("/register")
    public ResponseEntity<UserResponseDTO> createUser(@RequestBody User user) {
        User createdUser = usersService.createUser(user);
        return new ResponseEntity<>(modelMapper.map(createdUser, UserResponseDTO.class), HttpStatus.CREATED);
    }

    @PostMapping("/checkUsername")
    public ResponseEntity<Boolean> checkUsername(@RequestBody User user) {
        User existingUser = usersService.findByUsername(user.getUsername());
        if (existingUser != null) {
            return ResponseEntity.ok(true);
        } else {
            return ResponseEntity.ok(false);
        }
    }

    @PostMapping("/checkEmail")
    public ResponseEntity<Boolean> checkEmail(@RequestBody User user) {
        User existingUser = usersService.findByEmail(user.getEmail());
        if (existingUser != null) {
            return ResponseEntity.ok(true);
        } else {
            return ResponseEntity.ok(false);
        }
    }

    // @GetMapping("/usersStats")
    // public ResponseEntity<List<UserExpenditureDTO>> getUsersStats() {
    //     List<UserExpenditureDTO> usersStats = usersService.getUsersStats();
    //     return new ResponseEntity<>(usersStats, HttpStatus.OK);
    // }

    // @PostMapping("/login")
    // public ResponseEntity<UserResponseDTO> authenticate(@RequestBody User user) {
    //     Long userId = usersService.authenticate(user);
    //     User existingUser = usersService.findByUsername(user.getUsername());
    //     if (userId != null) {
    //         UserResponseDTO responseDTO = new UserResponseDTO();
    //         responseDTO.setUserId(userId.intValue());
    //         responseDTO.setUsername(user.getUsername());
    //         responseDTO.setIsAdmin(existingUser.getIsAdmin());
    //         responseDTO.setIsDisabled(existingUser.getIsDisabled());
    //         return ResponseEntity.ok(responseDTO);
    //     } else {
    //         return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    //     }
    // }

    @PutMapping("/makeAdmin/{userId}")
    public ResponseEntity<UserResponseDTO> makeAdmin(@PathVariable Long userId){
        User existingUser = usersRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        existingUser.setIsAdmin(true);
        usersRepository.save(existingUser);
        return new ResponseEntity<>(modelMapper.map(existingUser, UserResponseDTO.class), HttpStatus.CREATED);
    }

    @PutMapping("/removeAdmin/{userId}")
    public ResponseEntity<UserResponseDTO> removeAdmin(@PathVariable Long userId){
        User existingUser = usersRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        existingUser.setIsAdmin(false);
        usersRepository.save(existingUser);
        return new ResponseEntity<>(modelMapper.map(existingUser, UserResponseDTO.class), HttpStatus.CREATED);
    }

    @PutMapping("/disableUser/{userId}")
    public ResponseEntity<UserResponseDTO> disableUser(@PathVariable Long userId){
        User existingUser = usersRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        existingUser.setIsDisabled(true);
        usersRepository.save(existingUser);
        return new ResponseEntity<>(modelMapper.map(existingUser, UserResponseDTO.class), HttpStatus.CREATED);
    }

    @PutMapping("/enableUser/{userId}")
    public ResponseEntity<UserResponseDTO> enableUser(@PathVariable Long userId){
        User existingUser = usersRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        existingUser.setIsDisabled(false);
        usersRepository.save(existingUser);
        return new ResponseEntity<>(modelMapper.map(existingUser, UserResponseDTO.class), HttpStatus.CREATED);
    }

    @GetMapping("/{username}")
    public ResponseEntity<UserResponseDTO> getUserByUsername(@PathVariable String username) {
        User existingUser = usersService.findByUsername(username);
        if (existingUser != null)
            return new ResponseEntity<>(modelMapper.map(existingUser, UserResponseDTO.class), HttpStatus.CREATED);
        else
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @GetMapping("/id/{id}")
    public ResponseEntity<UserResponseDTO> getUserById(@PathVariable long id) {
        User existingUser = usersService.findUserById(id);
        if (existingUser != null)
            return new ResponseEntity<>(modelMapper.map(existingUser, UserResponseDTO.class), HttpStatus.CREATED);
        else //error
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = usersService.findAllUsers();
        return new ResponseEntity<>(users, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User user) {
        user.setId(id);
        User updatedUser = usersService.updateUser(user);
        return new ResponseEntity<>(updatedUser, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable("id") long id) {
        usersService.deleteUser(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
