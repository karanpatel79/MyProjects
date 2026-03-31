package com.oms.oms_backend.service;

import com.oms.oms_backend.entity.User;
import com.oms.oms_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User register(User user) {
        if (user == null) {
            throw new RuntimeException("Invalid request");
        }
        if (isBlank(user.getName()) || isBlank(user.getEmail()) || isBlank(user.getPassword())) {
            throw new RuntimeException("Name, email and password are required");
        }
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists!");
        }
        user.setRole("CUSTOMER");
        user.setBlocked(false);
        return userRepository.save(user);
    }

    public User login(String email, String password) {
        if (isBlank(email) || isBlank(password)) {
            throw new RuntimeException("Email and password are required");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.isBlocked()) {
            throw new RuntimeException("You are blocked by admin");
        }

        if (!password.equals(user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        return user;
    }

    public User getByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public List<User> getAllCustomers() {
        return userRepository.findByRole("CUSTOMER");
    }

    public User toggleBlock(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setBlocked(!user.isBlocked());
        return userRepository.save(user);
    }

    public void updatePassword(String email, String newPassword) {
        if (isBlank(email) || isBlank(newPassword)) {
            throw new RuntimeException("Email and new password are required");
        }
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setPassword(newPassword);
        userRepository.save(user);
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }
}
