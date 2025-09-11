"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

export interface LinkedInAccount {
  id: string
  name: string
  email: string
  status: "Available" | "Connected" | "Disconnected" | "Limited"
  avatar?: string
  sendingLimits: {
    connections: number
    messages: number
    inmails: number
  }
  dailyUsage: {
    connections: number
    messages: number
    inmails: number
  }
}

interface LinkedInAccountsContextType {
  accounts: LinkedInAccount[]
  addAccount: (account: Omit<LinkedInAccount, "id">) => void
  updateAccount: (id: string, updates: Partial<LinkedInAccount>) => void
  removeAccount: (id: string) => void
  getAvailableAccounts: () => LinkedInAccount[]
}

const LinkedInAccountsContext = createContext<LinkedInAccountsContextType | undefined>(undefined)

// Dummy data for LinkedIn accounts
const initialAccounts: LinkedInAccount[] = [
  {
    id: "habib-ullah",
    name: "Habib Ullah",
    email: "habib@example.com",
    status: "Available",
    avatar: "/abstract-profile.png",
    sendingLimits: {
      connections: 25,
      messages: 40,
      inmails: 40,
    },
    dailyUsage: {
      connections: 0,
      messages: 0,
      inmails: 0,
    },
  },
  {
    id: "john-doe",
    name: "John Doe",
    email: "john@example.com",
    status: "Connected",
    avatar: "/abstract-profile.png",
    sendingLimits: {
      connections: 30,
      messages: 50,
      inmails: 35,
    },
    dailyUsage: {
      connections: 5,
      messages: 12,
      inmails: 2,
    },
  },
]

export function LinkedInAccountsProvider({ children }: { children: ReactNode }) {
  const [accounts, setAccounts] = useState<LinkedInAccount[]>(initialAccounts)

  const addAccount = (account: Omit<LinkedInAccount, "id">) => {
    const newAccount: LinkedInAccount = {
      ...account,
      id: `account-${Date.now()}`,
    }
    setAccounts((prev) => [...prev, newAccount])
  }

  const updateAccount = (id: string, updates: Partial<LinkedInAccount>) => {
    setAccounts((prev) => prev.map((account) => (account.id === id ? { ...account, ...updates } : account)))
  }

  const removeAccount = (id: string) => {
    setAccounts((prev) => prev.filter((account) => account.id !== id))
  }

  const getAvailableAccounts = () => {
    return accounts.filter((account) => account.status === "Available" || account.status === "Connected")
  }

  return (
    <LinkedInAccountsContext.Provider
      value={{
        accounts,
        addAccount,
        updateAccount,
        removeAccount,
        getAvailableAccounts,
      }}
    >
      {children}
    </LinkedInAccountsContext.Provider>
  )
}

export function useLinkedInAccounts() {
  const context = useContext(LinkedInAccountsContext)
  if (context === undefined) {
    throw new Error("useLinkedInAccounts must be used within a LinkedInAccountsProvider")
  }
  return context
}
