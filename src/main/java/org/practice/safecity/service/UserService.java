package org.practice.safecity.service;

import org.practice.safecity.model.User;
import org.practice.safecity.model.enums.UserRole;
import org.practice.safecity.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public Page<User> getAllUsers(Pageable pageable) {
        return userRepository.findAll(pageable);
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }
    public User getUserById(String id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }

    public User getUserByAadhaar(String aadhaarNumber) {
        return userRepository.findByAadhaarNumber(aadhaarNumber).orElse(null);
    }

    public User updateUser(String id, User userDetails) {
        User user = getUserById(id);

        user.setName(userDetails.getName());

        if (userDetails.getPassword() != null && !userDetails.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(userDetails.getPassword()));
        }

        if (userDetails.getBadgeNumber() != null) {
            user.setBadgeNumber(userDetails.getBadgeNumber());
        }

        return userRepository.save(user);
    }

    public User updateUserRole(String id, UserRole role) {
        User user = getUserById(id);
        user.setRole(role);
        return userRepository.save(user);
    }

    public void deleteUser(String id) {
        User user = getUserById(id);
        userRepository.delete(user);
    }
}