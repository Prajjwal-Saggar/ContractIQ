// =========================================================
// CONTRACTIQ — TYPES
// =========================================================

export interface User {
  name: string
  email: string
  role: 'USER' | 'ADMIN'
}

export interface Contract {
  id: number
  fileName: string
  originalFileName: string
  status: 'UPLOADED' | 'PROCESSING' | 'READY' | 'FAILED'
  clauseCount: number | null
  riskFlagCount: number | null
  summary: string | null
  uploadedAt: string
  processedAt: string | null
  uploadedBy: string
  highRiskCount: number | null
  mediumRiskCount: number | null
  lowRiskCount: number | null
  flaggedClauses: Clause[] | null
}

export interface Clause {
  id: number
  clauseText: string
  chunkIndex: number
  clauseType: string | null
  riskLevel: 'HIGH' | 'MEDIUM' | 'LOW' | null
  riskExplanation: string | null
  flagged: boolean
}

export interface ChatMessage {
  id: number
  question: string
  answer: string
  sourceClauses: Clause[]
  askedAt: string
  contractName: string
}

export interface RiskSummary {
  totalContracts: number
  readyContracts: number
  processingContracts: number
  totalRiskFlags: number
  highRiskFlags: number
  mediumRiskFlags: number
  lowRiskFlags: number
  mostRiskyContracts: Contract[]
}

export interface ApiError {
  error?: string
  [field: string]: string | undefined
}

export interface ContractUploadResponse {
  id: number
  fileName: string
  originalFileName: string
  status: string
  message?: string
}
