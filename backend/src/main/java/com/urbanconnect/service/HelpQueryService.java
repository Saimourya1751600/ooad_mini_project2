package com.urbanconnect.service;

import com.urbanconnect.entity.HelpQuery;
import com.urbanconnect.dto.HelpQueryWithUserDTO;
import com.urbanconnect.repository.HelpQueryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HelpQueryService {

    @Autowired
    private HelpQueryRepository helpQueryRepository;

    public HelpQuery saveQuery(HelpQuery helpQuery) {
        return helpQueryRepository.save(helpQuery);
    }

    public List<HelpQueryWithUserDTO> getAllQueriesWithUserDetails() {
        return helpQueryRepository.findAllWithUserDetails();
    }

    public List<HelpQueryWithUserDTO> getQueriesByUserName(String name) {
        return helpQueryRepository.findByUserName(name);
    }
}