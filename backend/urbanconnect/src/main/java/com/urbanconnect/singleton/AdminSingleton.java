package com.urbanconnect.singleton;

import com.urbanconnect.entity.Admin;
import com.urbanconnect.repository.AdminRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class AdminSingleton {

    private Admin admin;

    @Autowired
    private AdminRepository adminRepository;

    @PostConstruct
    public void init() {
        // Load the first admin (assuming only one exists)
        admin = adminRepository.findAll().stream().findFirst().orElse(null);
    }

    public Admin getAdmin() {
        return admin;
    }

    public void setAdmin(Admin admin) {
        this.admin = admin;
    }
}
