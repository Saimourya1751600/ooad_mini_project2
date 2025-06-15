package com.urbanconnect.controller;

import com.urbanconnect.entity.HelpQuery;
import com.urbanconnect.dto.HelpQueryWithUserDTO;
import com.urbanconnect.service.HelpQueryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/help-queries")
public class HelpQueryController {

    @Autowired
    private HelpQueryService helpQueryService;

    @PostMapping
    public String submitQuery(@RequestBody HelpQuery helpQuery) {
        if (helpQuery.getMessage() == null || helpQuery.getMessage().trim().isEmpty()) {
            return "Message is required";
        }
        helpQuery.setUserId(1); // Hardcode user_id for now
        helpQueryService.saveQuery(helpQuery);
        return "Query submitted successfully";
    }

    @GetMapping
    public List<HelpQueryWithUserDTO> getQueries(@RequestParam(required = false) String userName) {
        if (userName != null) {
            return helpQueryService.getQueriesByUserName(userName);
        }
        return helpQueryService.getAllQueriesWithUserDetails();
    }
}