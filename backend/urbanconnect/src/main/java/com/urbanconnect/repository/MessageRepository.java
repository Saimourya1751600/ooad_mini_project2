package com.urbanconnect.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.urbanconnect.entity.Message;

@Repository
public interface MessageRepository extends JpaRepository<Message, Integer> {

    /**
     * Find all messages for a specific booking, ordered by sent time
     */
    List<Message> findByBookingIdOrderBySentAtAsc(Integer bookingId);

    /**
     * Find all messages where user is either sender or receiver, ordered by sent time
     */
    @Query("SELECT m FROM Message m WHERE (m.senderId = :userId OR m.receiverId = :userId) ORDER BY m.sentAt DESC")
    List<Message> findByUserIdOrderBySentAtDesc(@Param("userId") Integer userId);

    /**
     * Find conversation between two users for a specific booking
     */
    @Query("SELECT m FROM Message m WHERE m.bookingId = :bookingId AND ((m.senderId = :user1Id AND m.receiverId = :user2Id) OR (m.senderId = :user2Id AND m.receiverId = :user1Id)) ORDER BY m.sentAt ASC")
    List<Message> findConversationForBooking(
            @Param("bookingId") Integer bookingId,
            @Param("user1Id") Integer user1Id,
            @Param("user2Id") Integer user2Id
    );
}