package com.urbanconnect.service;

import com.urbanconnect.entity.User;
import com.urbanconnect.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User getUserById(Integer userId) {
        Optional<User> user = userRepository.findById(userId);
        return user.orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));
    }

    @Transactional
    public User updateUser(Integer userId, User updatedUser) {
        Optional<User> existingUserOpt = userRepository.findById(userId);
        if (!existingUserOpt.isPresent()) {
            throw new RuntimeException("User not found with ID: " + userId);
        }

        User existingUser = existingUserOpt.get();

        // Update allowed fields
        if (updatedUser.getName() != null && !updatedUser.getName().trim().isEmpty()) {
            existingUser.setName(updatedUser.getName());
        }
        if (updatedUser.getPhone() != null) {
            existingUser.setPhone(updatedUser.getPhone());
        }
        if (updatedUser.getAddress() != null) {
            existingUser.setAddress(updatedUser.getAddress());
        }

        return userRepository.save(existingUser);
    }
}