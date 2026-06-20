package com.contractiq.backend.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Entity
@Table(name = "clauses")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Clause {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "contract_id", nullable = false)
    private Contract contract;

    // the actual text of this clause/chunk
    @Column(nullable = false, columnDefinition = "TEXT")
    private String clauseText;

    // position in the document — chunk number
    @Column(nullable = false)
    private Integer chunkIndex;

    // the 768-dimensional embedding vector from the embedding service
    // stored as a pgvector column
    @Column(columnDefinition = "vector(768)")
    @JdbcTypeCode(SqlTypes.VECTOR)
    private float[] embedding;

    // risk analysis
    @Enumerated(EnumType.STRING)
    private RiskLevel riskLevel;

    // what kind of clause is this
    private String clauseType;

    // LLM-generated risk explanation if flagged
    @Column(columnDefinition = "TEXT")
    private String riskExplanation;

    // is this clause flagged for legal review
    @Column(nullable = false)
    private boolean flagged = false;
}