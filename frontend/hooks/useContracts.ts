'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { protectedApi } from '@/lib/axios'
import type { Contract, RiskSummary, Clause } from '@/types'

// =========================================================
// useContracts — fetch all contracts
// =========================================================

export function useContracts() {
  return useQuery<Contract[]>({
    queryKey: ['contracts'],
    queryFn: async () => {
      const { data } = await protectedApi.get('/api/contracts')
      return data
    },
  })
}

// =========================================================
// useContract — fetch single contract by id
// =========================================================

export function useContract(id: number | string) {
  return useQuery<Contract>({
    queryKey: ['contract', id],
    queryFn: async () => {
      const { data } = await protectedApi.get(`/api/contracts/${id}`)
      return data
    },
    enabled: !!id,
  })
}

// =========================================================
// useContractClauses — fetch all clauses for a contract
// =========================================================

export function useContractClauses(id: number | string) {
  return useQuery<Clause[]>({
    queryKey: ['clauses', id],
    queryFn: async () => {
      const { data } = await protectedApi.get(`/api/contracts/${id}/clauses`)
      return data
    },
    enabled: !!id,
  })
}

// =========================================================
// useRiskSummary — fetch dashboard risk summary
// =========================================================

export function useRiskSummary() {
  return useQuery<RiskSummary>({
    queryKey: ['risk-summary'],
    queryFn: async () => {
      const { data } = await protectedApi.get('/api/contracts/risk-summary')
      return data
    },
  })
}

// =========================================================
// useAnalyseRisk — trigger risk analysis (long running)
// =========================================================

export function useAnalyseRisk() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: number | string) => {
      const { data } = await protectedApi.post(
        `/api/contracts/${id}/analyse-risk`,
        {},
        { timeout: 120_000 }
      )
      return data
    },
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: ['contract', id] })
      qc.invalidateQueries({ queryKey: ['clauses', id] })
      qc.invalidateQueries({ queryKey: ['risk-summary'] })
    },
  })
}

// =========================================================
// useDeleteContract
// =========================================================

export function useDeleteContract() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: number | string) => {
      const { data } = await protectedApi.delete(`/api/contracts/${id}`)
      return data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['contracts'] })
      qc.invalidateQueries({ queryKey: ['risk-summary'] })
    },
  })
}
