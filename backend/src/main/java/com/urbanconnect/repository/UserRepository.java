package com.urbanconnect.repository;

import com.urbanconnect.entity.User;
import com.urbanconnect.entity.Usertype;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {

    Optional<User> findByUserId(Integer userId);

    Optional<User> findByEmail(String email);

    // Use Enum parameter instead of String
    @Query("SELECT u FROM User u WHERE u.user_type = :userType")
    Page<User> findByUserType(@Param("userType") Usertype userType, Pageable pageable);

    // Search with Enum parameter
    @Query("SELECT u FROM User u WHERE u.user_type = :userType AND (u.name LIKE %:search% OR u.email LIKE %:search%)")
    Page<User> findByUserTypeAndSearch(@Param("userType") Usertype userType, @Param("search") String search, Pageable pageable);

    // For service providers with specific service type
    @Query("SELECT sp FROM ServiceProvider sp JOIN sp.bookings b JOIN b.service s " +
            "WHERE sp.user_type = :userType AND s.name LIKE %:serviceType%")
    Page<User> findByUserTypeAndServiceType(@Param("userType") Usertype userType, @Param("serviceType") String serviceType, Pageable pageable);
}