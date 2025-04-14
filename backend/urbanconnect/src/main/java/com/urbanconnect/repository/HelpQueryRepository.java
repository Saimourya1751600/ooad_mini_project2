package com.urbanconnect.repository;

import com.urbanconnect.dto.HelpQueryWithUserDTO;
import com.urbanconnect.entity.HelpQuery;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HelpQueryRepository extends JpaRepository<HelpQuery, Long> {

    @Query("SELECT new com.urbanconnect.dto.HelpQueryWithUserDTO(h.queryId, u.name, h.message, h.submittedAt) " +
            "FROM HelpQuery h JOIN User u ON h.userId = u.userId")
    List<HelpQueryWithUserDTO> findAllWithUserDetails();

    @Query("SELECT new com.urbanconnect.dto.HelpQueryWithUserDTO(h.queryId, u.name, h.message, h.submittedAt) " +
            "FROM HelpQuery h JOIN User u ON h.userId = u.userId WHERE u.name = :name")
    List<HelpQueryWithUserDTO> findByUserName(String name);
}