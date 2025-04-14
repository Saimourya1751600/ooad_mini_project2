package com.urbanconnect.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {

    @GetMapping("/")
    public String home() {
        return "index"; // Refers to src/main/resources/templates/index.html
    }
    @GetMapping("/admin-test")
    public String adminTestPage() {
        return "admin-test"; // Refers to templates/admin-test.html
    }
}
