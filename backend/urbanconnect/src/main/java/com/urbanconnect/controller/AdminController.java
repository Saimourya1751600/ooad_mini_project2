package com.urbanconnect.controller;

import com.urbanconnect.entity.Admin;
import com.urbanconnect.service.AdminService;
import com.urbanconnect.singleton.AdminSingleton;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @Autowired
    private AdminSingleton adminSingleton;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    // Admin Registration API
    @PostMapping("/register")
    public Map<String, String> registerAdmin(@RequestBody Admin admin) {
        Map<String, String> response = new HashMap<>();

        // Check if already registered using Singleton or DB count
        if (adminSingleton.getAdmin() != null) {
            response.put("message", "Admin already exists!");
            return response;
        }

        String result = adminService.registerAdmin(admin);

        if (result.equals("Admin registered successfully!")) {
            adminSingleton.setAdmin(admin);
        }

        response.put("message", result);
        return response;
    }

    // Admin Login API
    @PostMapping("/login")
    public Map<String, Object> loginAdmin(@RequestBody Admin adminRequest) {
        Map<String, Object> response = new HashMap<>();

        boolean isAuthenticated = adminService.authenticateAdmin(adminRequest.getEmail(), adminRequest.getPassword());

        if (isAuthenticated) {
            Admin admin = adminService.getAdminByEmail(adminRequest.getEmail());
            adminSingleton.setAdmin(admin); // optional: refresh singleton

            response.put("message", "Login successful!");
            response.put("name", admin.getName());
            response.put("email", admin.getEmail());
            response.put("userType", "ADMIN");
        } else {
            response.put("message", "Invalid email or password!");
        }

        return response;
    }

    /**
     * Get dashboard statistics for admin.
     *
     * @return Map containing various statistics.
     */
    @GetMapping("/dashboard/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();

        try {
            // Total customers
            Integer totalCustomers = jdbcTemplate.queryForObject(
                    "SELECT COUNT(*) FROM users WHERE user_type = 'CUSTOMER'",
                    Integer.class
            );

            // Total service providers
            Integer totalProviders = jdbcTemplate.queryForObject(
                    "SELECT COUNT(*) FROM users WHERE user_type = 'SERVICEPROVIDER'",
                    Integer.class
            );

            // Total bookings
            Integer totalBookings = jdbcTemplate.queryForObject(
                    "SELECT COUNT(*) FROM bookings",
                    Integer.class
            );

            // Total completed bookings
            Integer completedBookings = jdbcTemplate.queryForObject(
                    "SELECT COUNT(*) FROM bookings WHERE status = 'COMPLETED'",
                    Integer.class
            );

            // Total cancelled bookings
            Integer cancelledBookings = jdbcTemplate.queryForObject(
                    "SELECT COUNT(*) FROM bookings WHERE status = 'CANCELLED'",
                    Integer.class
            );

            // Total confirmed bookings
            Integer confirmedBookings = jdbcTemplate.queryForObject(
                    "SELECT COUNT(*) FROM bookings WHERE status = 'CONFIRMED'",
                    Integer.class
            );

            // Total services
            Integer totalServices = jdbcTemplate.queryForObject(
                    "SELECT COUNT(*) FROM services",
                    Integer.class
            );

            // Add all stats to the response
            stats.put("totalCustomers", totalCustomers != null ? totalCustomers : 0);
            stats.put("totalProviders", totalProviders != null ? totalProviders : 0);
            stats.put("totalBookings", totalBookings != null ? totalBookings : 0);
            stats.put("completedBookings", completedBookings != null ? completedBookings : 0);
            stats.put("cancelledBookings", cancelledBookings != null ? cancelledBookings : 0);
            stats.put("confirmedBookings", confirmedBookings != null ? confirmedBookings : 0);
            stats.put("totalServices", totalServices != null ? totalServices : 0);

            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            // Log the error
            System.err.println("Error fetching admin dashboard stats: " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Get recent bookings for admin dashboard.
     *
     * @param limit Number of bookings to return.
     * @return List of recent bookings.
     */
    @GetMapping("/dashboard/recent-bookings")
    public ResponseEntity<?> getRecentBookings(@RequestParam(defaultValue = "5") int limit) {
        try {
            String sql = """
                    SELECT b.booking_id, 
                           c.name AS customer_name, 
                           p.name AS provider_name,
                           s.name AS service_name,
                           b.booking_date,
                           b.status
                    FROM bookings b
                    JOIN users c ON b.customer_id = c.user_id
                    JOIN users p ON b.provider_id = p.user_id
                    JOIN services s ON b.service_id = s.service_id
                    ORDER BY b.created_at DESC
                    LIMIT ?
                    """;

            var recentBookings = jdbcTemplate.queryForList(sql, limit);
            return ResponseEntity.ok(recentBookings);
        } catch (Exception e) {
            System.err.println("Error fetching recent bookings: " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }
}