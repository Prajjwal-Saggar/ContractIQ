package com.contractiq.backend.repository;

import com.contractiq.backend.model.Clause;
import com.contractiq.backend.model.Contract;
import com.contractiq.backend.model.RiskLevel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClauseRepository extends JpaRepository<Clause, Long> {

    // all clauses for a contract ordered by chunk position
    List<Clause> findByContractOrderByChunkIndex(Contract contract);

    // all flagged clauses for a contract
    List<Clause> findByContractAndFlaggedTrue(Contract contract);

    // clauses by risk level for a contract
    List<Clause> findByContractAndRiskLevel(
            Contract contract, RiskLevel riskLevel);

    // count clauses for a contract
    long countByContract(Contract contract);

    // count flagged clauses for a contract
    long countByContractAndFlaggedTrue(Contract contract);

    // ─── THE CORE RAG QUERY ────────────────────────────────────────
    // finds the top K most semantically similar clauses to a query vector
    // <=> is the pgvector cosine distance operator
    // lower distance = more similar
    @Query(value = """
            SELECT * FROM clauses
            WHERE contract_id = :contractId
            ORDER BY embedding <=> CAST(:queryVector AS vector)
            LIMIT :topK
            """, nativeQuery = true)
    List<Clause> findSimilarClauses(
            @Param("contractId") Long contractId,
            @Param("queryVector") String queryVector,
            @Param("topK") int topK);

    // delete all clauses for a contract
    // used when reprocessing a contract
    void deleteByContract(Contract contract);
}