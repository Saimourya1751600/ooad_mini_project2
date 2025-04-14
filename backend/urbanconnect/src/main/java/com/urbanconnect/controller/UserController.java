package com.urbanconnect.controller;

import com.urbanconnect.entity.User;
import com.urbanconnect.entity.Usertype;
import com.urbanconnect.repository.UserRepository;
import com.urbanconnect.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;

    // GET /api/users - Fetch users with pagination, filtering, and search
    @GetMapping
    public ResponseEntity<Page<User>> getUsers(
            @RequestParam(required = false) String type,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "") String search,
            @RequestParam(defaultValue = "") String serviceType) {

        Pageable pageable = PageRequest.of(page, size);
        Page<User> users;

        try {
            if (type != null && !type.isEmpty()) {
                // Convert string to enum properly
                Usertype userType;
                try {
                    userType = Usertype.valueOf(type.toUpperCase());
                } catch (IllegalArgumentException e) {
                    System.err.println("Invalid user type: " + type);
                    return ResponseEntity.badRequest().build();
                }

                if (!search.isEmpty()) {
                    users = userRepository.findByUserTypeAndSearch(userType, search, pageable);
                } else if (type.equalsIgnoreCase("SERVICEPROVIDER") && !serviceType.isEmpty()) {
                    users = userRepository.findByUserTypeAndServiceType(userType, serviceType, pageable);
                } else {
                    users = userRepository.findByUserType(userType, pageable);
                }
            } else {
                users = userRepository.findAll(pageable);
            }

            return ResponseEntity.ok(users);
        } catch (Exception e) {
            System.err.println("Error fetching users: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    // GET /api/users/{id} - Fetch user by ID
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Integer id) {
        Optional<User> user = userRepository.findByUserId(id);
        return user.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // GET /api/users/email/{email} - Fetch user by email
    @GetMapping("/email/{email}")
    public ResponseEntity<User> getUserByEmail(@PathVariable String email) {
        Optional<User> user = userRepository.findByEmail(email);
        return user.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // PUT /api/users/{id} - Update user profile
    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Integer id, @RequestBody User updatedUser) {
        try {
            User user = userService.updateUser(id, updatedUser);
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            System.err.println("Error updating user: " + e.getMessage());
            return ResponseEntity.status(404).body(null);
        }
    }
}