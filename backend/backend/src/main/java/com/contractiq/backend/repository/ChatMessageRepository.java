package com.contractiq.backend.repository;

import com.contractiq.backend.model.ChatMessage;
import com.contractiq.backend.model.Contract;
import com.contractiq.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {

    // full chat history for a contract
    List<ChatMessage> findByContractOrderByAskedAtAsc(Contract contract);

    // chat history for a specific user on a specific contract
    List<ChatMessage> findByContractAndUserOrderByAskedAtAsc(
            Contract contract, User user);

    // count total questions asked on a contract
    long countByContract(Contract contract);

    // delete all chat history for a contract
    void deleteByContract(Contract contract);
}