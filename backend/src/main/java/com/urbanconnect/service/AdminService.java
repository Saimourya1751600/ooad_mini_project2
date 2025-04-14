package com.urbanconnect.service;

import com.urbanconnect.entity.Admin;
import com.urbanconnect.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

@Service
public class AdminService {

    @Autowired
    private AdminRepository adminRepository;

    // Admin registration (signup)
    public String registerAdmin(Admin admin) {
        try {
            // Check if an admin already exists by email
            if (adminRepository.findByEmail(admin.getEmail()).isPresent()) {
                return "Admin with this email already exists!";
            }

            // Only allow 1 admin registration
            if (adminRepository.count() > 0) {
                return "Admin already exists!";
            }

            // Save new admin
            adminRepository.save(admin);
            return "Admin registered successfully!";
        } catch (DataIntegrityViolationException e) {
            return "Error: Email already exists.";
        } catch (Exception e) {
            return "An unexpected error occurred during registration.";
        }
    }

    // Admin authentication (login)
    public boolean authenticateAdmin(String email, String password) {
        return adminRepository.findByEmail(email)
                .map(admin -> admin.getPassword().equals(password))
                .orElse(false);
    }

    public Admin getAdminByEmail(String email) {
        return adminRepository.findByEmail(email).orElse(null);
    }
}
