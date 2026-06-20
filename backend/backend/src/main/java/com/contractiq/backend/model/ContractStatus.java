package com.contractiq.backend.model;

public enum ContractStatus {
    UPLOADED,       // just uploaded, not processed yet
    PROCESSING,     // embedding service is working on it
    READY,          // fully embedded, ready for chat
    FAILED          // embedding failed
}