package com.urbanconnect.service;

import com.urbanconnect.dto.LoginRequest;
import com.urbanconnect.dto.RegisterRequest;
import com.urbanconnect.entity.Usertype;
import com.urbanconnect.entity.User;
import com.urbanconnect.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private AuthService authService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    // ✅ Test Case 1: Successful Registration
    @Test
    void testRegisterSuccess() {
        RegisterRequest request = new RegisterRequest();
        request.setName("John");
        request.setEmail("john@example.com");
        request.setPassword("password123");

        // Mocking that email is not registered
        when(userRepository.findByEmail(request.getEmail())).thenReturn(Optional.empty());

        String result = authService.register(request);
        assertEquals("User registered successfully as a CUSTOMER!", result);

        // Verifying save was called with the correct user details
        verify(userRepository, times(1)).save(any(User.class));
    }

    // ❗️ Test Case 2: Email Already Registered
    @Test
    void testRegisterEmailExists() {
        RegisterRequest request = new RegisterRequest();
        request.setName("John");
        request.setEmail("john@example.com");
        request.setPassword("password123");

        // Mocking that the email is already registered
        when(userRepository.findByEmail(request.getEmail())).thenReturn(Optional.of(new User()));

        String result = authService.register(request);
        assertEquals("Email already registered. Please login!", result);

        // Verifying save was never called
        verify(userRepository, never()).save(any(User.class));
    }

    // ✅ Test Case 3: Successful Login
    @Test
    void testLoginSuccess() {
        LoginRequest request = new LoginRequest();
        request.setEmail("john@example.com");
        request.setPassword("password123");

        User user = new User();
        user.setName("John");
        user.setEmail("john@example.com");
        user.setPassword("password123");
        user.setUser_type(Usertype.CUSTOMER);

        // Mocking user found with correct password
        when(userRepository.findByEmail(request.getEmail())).thenReturn(Optional.of(user));

        String result = authService.login(request).toString();
        assertEquals("Login successful! Welcome, John", result);
    }

    // ❗️ Test Case 4: User Not Found
    @Test
    void testLoginUserNotFound() {
        LoginRequest request = new LoginRequest();
        request.setEmail("john@example.com");
        request.setPassword("password123");

        // Mocking that no user is found
        when(userRepository.findByEmail(request.getEmail())).thenReturn(Optional.empty());

        Exception exception = assertThrows(RuntimeException.class, () -> {
            authService.login(request);
        });

        assertEquals("User not found. Please register first!", exception.getMessage());
    }

    // ❗️ Test Case 5: Incorrect Password
    @Test
    void testLoginInvalidPassword() {
        LoginRequest request = new LoginRequest();
        request.setEmail("john@example.com");
        request.setPassword("wrongpassword");

        User user = new User();
        user.setName("John");
        user.setEmail("john@example.com");
        user.setPassword("password123");

        // Mocking user found but password incorrect
        when(userRepository.findByEmail(request.getEmail())).thenReturn(Optional.of(user));

        String result = authService.login(request).toString();
        assertEquals("Invalid credentials. Please try again.", result);
    }
}
