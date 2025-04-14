package com.urbanconnect.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class ServiceController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    /**
     * Retrieves all available services along with their associated categories.
     *
     * @return List of services with category details.
     */
    @GetMapping("/services")
    public ResponseEntity<List<Map<String, Object>>> getAllServices() {
        String sql = """
                SELECT s.service_id, s.name, s.description, s.base_price,
                       sc.category_id, sc.category_name
                FROM services s
                JOIN service_categories sc ON s.category_id = sc.category_id
                ORDER BY sc.category_name, s.name
                """;

        List<Map<String, Object>> services = jdbcTemplate.queryForList(sql);
        return ResponseEntity.ok(services);
    }

    /**
     * Retrieves all approved and available service providers offering a specific service.
     *
     * @param serviceId the ID of the service to find providers for.
     * @return List of approved and available service providers with basic details and price.
     */
    @GetMapping("/providers/service/{serviceId}")
    public ResponseEntity<List<Map<String, Object>>> getProvidersForService(@PathVariable int serviceId) {
        try {
            String sql = """
                    SELECT u.user_id, u.name, sps.price
                    FROM users u
                    JOIN service_provider_services sps ON u.user_id = sps.provider_id
                    JOIN service_provider_details spd ON u.user_id = spd.provider_id
                    JOIN provider_availability pa ON u.user_id = pa.provider_id
                    WHERE sps.service_id = ?
                    AND spd.approval_status = 'APPROVED'
                    AND u.user_type = 'SERVICEPROVIDER'
                    AND pa.is_available = TRUE
                    """;

            List<Map<String, Object>> providers = jdbcTemplate.queryForList(sql, serviceId);
            return ResponseEntity.ok(providers);
        } catch (Exception e) {
            System.err.println("Error fetching providers for service ID " + serviceId + ": " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Retrieves all services offered by a specific service provider.
     *
     * @param providerId the ID of the service provider.
     * @return List of services with details (name, description, price).
     */
    @GetMapping("/providers/{providerId}/services")
    public ResponseEntity<List<Map<String, Object>>> getServicesByProvider(@PathVariable int providerId) {
        try {
            String sql = """
                    SELECT s.service_id, s.name, s.description, s.base_price, sps.price AS provider_price
                    FROM services s
                    JOIN service_provider_services sps ON s.service_id = sps.service_id
                    WHERE sps.provider_id = ?
                    ORDER BY s.name
                    """;

            List<Map<String, Object>> services = jdbcTemplate.queryForList(sql, providerId);
            return ResponseEntity.ok(services);
        } catch (Exception e) {
            System.err.println("Error fetching services for provider ID " + providerId + ": " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Updates the availability status of a service provider.
     *
     * @param providerId the ID of the service provider.
     * @param request a map containing the isAvailable boolean.
     * @return Response indicating success or failure.
     */
    @PutMapping("/providers/{providerId}/availability")
    public ResponseEntity<String> updateProviderAvailability(
            @PathVariable int providerId,
            @RequestBody Map<String, Boolean> request) {
        try {
            Boolean isAvailable = request.get("isAvailable");
            if (isAvailable == null) {
                return ResponseEntity.badRequest().body("isAvailable field is required");
            }

            // Check if provider exists in provider_availability
            String checkSql = "SELECT COUNT(*) FROM provider_availability WHERE provider_id = ?";
            Integer count = jdbcTemplate.queryForObject(checkSql, Integer.class, providerId);

            String sql;
            if (count != null && count > 0) {
                // Update existing record
                sql = "UPDATE provider_availability SET is_available = ?, updated_at = CURRENT_TIMESTAMP WHERE provider_id = ?";
                jdbcTemplate.update(sql, isAvailable, providerId);
            } else {
                // Insert new record (assuming category_id is not required for general availability)
                sql = "INSERT INTO provider_availability (provider_id, is_available, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)";
                jdbcTemplate.update(sql, providerId, isAvailable);
            }

            return ResponseEntity.ok("Availability updated successfully");
        } catch (Exception e) {
            System.err.println("Error updating availability for provider ID " + providerId + ": " + e.getMessage());
            return ResponseEntity.internalServerError().body("Failed to update availability");
        }
    }

    /**
     * Retrieves the availability status of a service provider.
     *
     * @param providerId the ID of the service provider.
     * @return The availability status.
     */
    @GetMapping("/providers/{providerId}/availability")
    public ResponseEntity<Map<String, Object>> getProviderAvailability(@PathVariable int providerId) {
        try {
            String sql = "SELECT is_available FROM provider_availability WHERE provider_id = ?";
            Map<String, Object> result = jdbcTemplate.queryForMap(sql, providerId);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            System.err.println("Error fetching availability for provider ID " + providerId + ": " + e.getMessage());
            // Return default availability as false if not found
            return ResponseEntity.ok(Map.of("is_available", false));
        }
    }
    @GetMapping("/types")
    public ResponseEntity<?> getServiceTypes() {
        try {
            String sql = "SELECT DISTINCT service_type as id, service_type as name FROM services";
            List<Map<String, Object>> serviceTypes = jdbcTemplate.queryForList(sql);
            return ResponseEntity.ok(serviceTypes);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error fetching service types: " + e.getMessage());
        }
    }
}