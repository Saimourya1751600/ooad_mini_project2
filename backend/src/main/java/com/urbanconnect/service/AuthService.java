package com.urbanconnect.service;

import com.urbanconnect.dto.LoginRequest;
import com.urbanconnect.dto.RegisterRequest;
import com.urbanconnect.entity.Usertype;
import com.urbanconnect.entity.User;
import com.urbanconnect.repository.UserRepository;
import com.urbanconnect.exception.DuplicateEmailException; // Import the new exception
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Transactional
    public String register(RegisterRequest request) {
        Optional<User> existingUser = userRepository.findByEmail(request.getEmail());
        if (existingUser.isPresent()) {
            throw new DuplicateEmailException("Email already registered. Please login!");
        }

        // Set userType
        Usertype usertype;
        try {
            usertype = Usertype.valueOf(request.getUserType().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid user type. Must be CUSTOMER or SERVICEPROVIDER.");
        }

        // Insert user manually and get generated user_id
        String insertUserSql = "INSERT INTO users (name, email, password, phone, address, user_type, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())";
        jdbcTemplate.update(insertUserSql, request.getName(), request.getEmail(), request.getPassword(),
                request.getPhone(), request.getAddress(), usertype.toString());

        // Get user_id just inserted
        Integer userId = jdbcTemplate.queryForObject("SELECT user_id FROM users WHERE email = ?", Integer.class, request.getEmail());

        // If service provider, insert into other tables
        if (usertype == Usertype.SERVICEPROVIDER) {
            String doc = request.getSpecializationDocument();
            Integer serviceId = request.getServiceId();

            // Validate that the service exists before creating the relationship
            if (serviceId != null) {
                Integer serviceCount = jdbcTemplate.queryForObject(
                        "SELECT COUNT(*) FROM services WHERE service_id = ?",
                        Integer.class,
                        serviceId
                );

                if (serviceCount == 0) {
                    // Service doesn't exist, rollback the user creation
                    jdbcTemplate.update("DELETE FROM users WHERE user_id = ?", userId);
                    throw new RuntimeException("Invalid service selected. Please choose a valid service.");
                }

                // Get the category_id for this service
                Integer categoryId = jdbcTemplate.queryForObject(
                        "SELECT category_id FROM services WHERE service_id = ?",
                        Integer.class,
                        serviceId
                );

                // Insert into service_provider_details
                String insertDetailsSql = "INSERT INTO service_provider_details (provider_id, specialization_document, approval_status) VALUES (?, ?, 'PENDING')";
                jdbcTemplate.update(insertDetailsSql, userId, doc);

                // Insert into service_provider_approval
                String insertApprovalSql = "INSERT INTO service_provider_approval (provider_id, admin_id, status, remarks) VALUES (?, 1, 'REJECTED', 'Awaiting review')";
                jdbcTemplate.update(insertApprovalSql, userId);

                // Insert into provider_availability
                String insertAvailSql = "INSERT INTO provider_availability (provider_id, category_id, is_available) VALUES (?, ?, TRUE)";
                jdbcTemplate.update(insertAvailSql, userId, categoryId);

                // Insert into service_provider_services
                String insertServiceSql = "INSERT INTO service_provider_services (provider_id, service_id, price) SELECT ?, ?, base_price FROM services WHERE service_id = ?";
                jdbcTemplate.update(insertServiceSql, userId, serviceId, serviceId);

            } else {
                // Service ID is required for service providers
                jdbcTemplate.update("DELETE FROM users WHERE user_id = ?", userId);
                throw new RuntimeException("Service selection is required for service providers.");
            }
        }

        return "User registered successfully as a " + usertype + "!";
    }

    public Map<String, Object> login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found. Please register first!"));

        if (!user.getPassword().equals(request.getPassword())) {
            throw new RuntimeException("Invalid credentials. Please try again.");
        }

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Login successful!");
        response.put("name", user.getName());
        response.put("email", user.getEmail());
        response.put("userType", user.getUser_type().toString());
        response.put("userId", user.getUserId());
        response.put("address", user.getAddress());

        // Check if Service Provider and fetch approval status
        if (user.getUser_type() == Usertype.SERVICEPROVIDER) {
            try {
                // Get approval status from service_provider_details
                String statusSql = "SELECT approval_status FROM service_provider_details WHERE provider_id = ?";
                String approvalStatus = jdbcTemplate.queryForObject(statusSql, String.class, user.getUserId());
                response.put("approvalStatus", approvalStatus);

                // Get service information
                String serviceSql = "SELECT s.service_id, s.name as service_name, s.description, " +
                        "sc.category_id, sc.category_name, sps.price " +
                        "FROM service_provider_services sps " +
                        "JOIN services s ON sps.service_id = s.service_id " +
                        "JOIN service_categories sc ON s.category_id = sc.category_id " +
                        "WHERE sps.provider_id = ?";

                List<Map<String, Object>> services = jdbcTemplate.queryForList(serviceSql, user.getUserId());
                if (!services.isEmpty()) {
                    Map<String, Object> serviceInfo = services.get(0);
                    response.put("serviceId", serviceInfo.get("service_id"));
                    response.put("serviceName", serviceInfo.get("service_name"));
                    response.put("categoryId", serviceInfo.get("category_id"));
                    response.put("categoryName", serviceInfo.get("category_name"));
                    response.put("price", serviceInfo.get("price"));
                }
            } catch (Exception e) {
                response.put("approvalStatus", "PENDING"); // fallback if not found
            }
        }

        return response;
    }
}