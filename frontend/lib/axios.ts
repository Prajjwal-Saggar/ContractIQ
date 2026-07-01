import axios from 'axios'
import toast from 'react-hot-toast'

// =========================================================
// AXIOS INSTANCE — Single monolith base URL
// =========================================================

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
  headers: { 'Content-Type': 'application/json' },
  timeout: 30_000,
})

// Request interceptor — attach Bearer token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('contractiq_token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor — handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status
    const data   = error?.response?.data

    if (status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('contractiq_token')
        localStorage.removeItem('contractiq_user')
        toast.error('SESSION TERMINATED >')
        window.location.href = '/login'
      }
    } else if (status === 403) {
      toast.error('ACCESS DENIED >')
    } else if (status === 413) {
      toast.error('FILE TOO LARGE. MAX 20MB.')
    } else if (status === 500) {
      toast.error('SYSTEM ERROR. RETRY.')
    } else if (!error.response) {
      toast.error('CONNECTION FAILED. CHECK BACKEND.')
    }

    // Build a normalized error message
    const message =
      data?.error ||
      data?.message ||
      error.message ||
      'Unknown error'

    return Promise.reject({ ...error, normalizedMessage: message, fieldErrors: data })
  }
)

// Named exports for clarity
export const authApi      = api  // no token needed (interceptor skips when no token)
export const protectedApi = api  // token auto-attached via interceptor
export default api
