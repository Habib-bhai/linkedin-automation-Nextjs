"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface Lead {
  id: string
  firstName: string
  lastName: string
  email: string
  company: string
  position: string
  linkedinUrl?: string
}

interface LeadList {
  id: string
  name: string
  createdAt: string
  status: string
  statusType: string
  leadCount: number
  campaignId?: string
  leads: Lead[]
}

interface LeadsContextType {
  leadLists: LeadList[]
  setLeadLists: (lists: LeadList[]) => void
  addLeadList: (list: LeadList) => void
  getLeadList: (id: string) => LeadList | undefined
}

const LeadsContext = createContext<LeadsContextType | undefined>(undefined)

export function LeadsProvider({ children }: { children: ReactNode }) {
  const [leadLists, setLeadLists] = useState<LeadList[]>([
    {
      id: "1",
      name: "demo_list",
      createdAt: "Aug 27, 2025, 11:37:54 AM",
      status: "In 1 campaign",
      statusType: "active",
      leadCount: 0,
      campaignId: "demo-campaign",
      leads: [],
    },
  ])

  const addLeadList = (list: LeadList) => {
    setLeadLists((prev) => [...prev, list])
  }

  const getLeadList = (id: string) => {
    return leadLists.find((list) => list.id === id)
  }

  return (
    <LeadsContext.Provider value={{ leadLists, setLeadLists, addLeadList, getLeadList }}>
      {children}
    </LeadsContext.Provider>
  )
}

export function useLeads() {
  const context = useContext(LeadsContext)
  if (context === undefined) {
    throw new Error("useLeads must be used within a LeadsProvider")
  }
  return context
}

export type { Lead, LeadList }
