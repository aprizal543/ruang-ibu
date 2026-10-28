import { createContext, useContext } from 'react'
import type { AdminSessionUser } from './api/authApi'

export const AdminAuthContext = createContext<AdminSessionUser | null>(null)

export function useAdminUser(): AdminSessionUser {
  const value = useContext(AdminAuthContext)
  if (!value) throw new Error('AdminAuthContext is unavailable outside an authenticated admin route.')
  return value
}
