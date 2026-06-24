package com.contractiq.backend.repository;

import com.contractiq.backend.model.Contract;
import com.contractiq.backend.model.ContractStatus;
import com.contractiq.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContractRepository extends JpaRepository<Contract, Long> {

    // all contracts uploaded by a specific user
    List<Contract> findByUploadedByOrderByUploadedAtDesc(User user);

    // all contracts with a specific status
    List<Contract> findByStatus(ContractStatus status);

    // contracts uploaded by user with a specific status
    List<Contract> findByUploadedByAndStatus(User user, ContractStatus status);

    // count contracts by user
    long countByUploadedBy(User user);

    // contracts that have risk flags
    @Query("SELECT c FROM Contract c WHERE c.riskFlagCount > 0 " +
            "AND c.uploadedBy = :user ORDER BY c.riskFlagCount DESC")
    List<Contract> findRiskyContractsByUser(@Param("user") User user);
}