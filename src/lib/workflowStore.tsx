"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import { type Node, type Edge } from "reactflow"

interface WorkflowData {
  leadId?: string
  leadName?: string
  leadEmail?: string
  connectionStatus?: "pending" | "accepted" | "declined"
  messagesSent?: number
  profileViewed?: boolean
  followed?: boolean
  postsLiked?: number
  [key: string]: any
}

interface WorkflowContextType {
  workflowNodes: Node[]
  workflowEdges: Edge[]
  setWorkflowNodes: (nodes: Node[]) => void
  setWorkflowEdges: (edges: Edge[]) => void
  executeWorkflow: () => void
  isExecuting: boolean
}

const WorkflowContext = createContext<WorkflowContextType | undefined>(undefined)

export function WorkflowProvider({ children }: { children: ReactNode }) {
  const [workflowNodes, setWorkflowNodes] = useState<Node[]>([])
  const [workflowEdges, setWorkflowEdges] = useState<Edge[]>([])
  const [isExecuting, setIsExecuting] = useState(false)

  const computeNode = async (node: Node, inputData: WorkflowData): Promise<WorkflowData> => {
    const actionType = node.data?.actionType || node.type

    console.log(`[v0] Computing node: ${node.data?.label} with data:`, inputData)

    switch (actionType) {
      case "start":
        return {
          ...inputData,
          leadId: "lead_123",
          leadName: "John Doe",
          leadEmail: "john.doe@example.com",
        }

      case "sendConnection":
        // Simulate sending connection request
        await new Promise((resolve) => setTimeout(resolve, 1500))
        return {
          ...inputData,
          connectionStatus: Math.random() > 0.3 ? "pending" : "accepted",
        }

      case "ifConnection":
        // Check connection status and determine path
        const isConnected = inputData.connectionStatus === "accepted"
        console.log(`[v0] Connection check: ${isConnected ? "Connected" : "Not Connected"}`)
        return {
          ...inputData,
          pathTaken: isConnected ? "connected" : "notConnected",
        }

      case "sendMessage":
        // Simulate sending message
        await new Promise((resolve) => setTimeout(resolve, 1000))
        return {
          ...inputData,
          messagesSent: (inputData.messagesSent || 0) + 1,
        }

      case "inmail":
        // Simulate sending InMail
        await new Promise((resolve) => setTimeout(resolve, 1200))
        return {
          ...inputData,
          inmailsSent: (inputData.inmailsSent || 0) + 1,
        }

      case "viewProfile":
        // Simulate viewing profile
        await new Promise((resolve) => setTimeout(resolve, 800))
        return {
          ...inputData,
          profileViewed: true,
        }

      case "follow":
        // Simulate following user
        await new Promise((resolve) => setTimeout(resolve, 600))
        return {
          ...inputData,
          followed: true,
        }

      case "likePost":
        // Simulate liking posts
        await new Promise((resolve) => setTimeout(resolve, 500))
        return {
          ...inputData,
          postsLiked: (inputData.postsLiked || 0) + 1,
        }

      case "ifOpenProfile":
        // Check if profile was opened (simulate random behavior)
        const profileOpened = Math.random() > 0.4
        console.log(`[v0] Profile opened check: ${profileOpened}`)
        return {
          ...inputData,
          profileOpened,
          pathTaken: profileOpened ? "opened" : "notOpened",
        }

      default:
        console.log(`[v0] Unknown node type: ${actionType}`)
        return inputData
    }
  }

  const executeNodeSequence = async (
    nodeId: string,
    nodes: Node[],
    edges: Edge[],
    inputData: WorkflowData = {},
  ): Promise<void> => {
    const currentNode = nodes.find((n) => n.id === nodeId)
    if (!currentNode) return

    console.log(`[v0] Executing node: ${currentNode.data?.label} (${currentNode.data?.actionType})`)

    // Compute the node and get output data
    const outputData = await computeNode(currentNode, inputData)

    console.log(`[v0] Node ${currentNode.id} output:`, outputData)

    // Find connected nodes
    const connectedEdges = edges.filter((edge) => edge.source === nodeId)

    // Handle conditional nodes (if connection, if open profile)
    if (currentNode.data?.actionType === "ifConnection" || currentNode.data?.actionType === "ifOpenProfile") {
      // For conditional nodes, follow the appropriate path based on the condition
      const pathTaken = outputData.pathTaken

      for (const edge of connectedEdges) {
        const targetNode = nodes.find((n) => n.id === edge.target)
        const edgeLabel = edge.label || ""

        // Follow the correct path based on condition result
        if (
          (pathTaken === "connected" && (edgeLabel.includes("Connected") || edgeLabel.includes("Yes"))) ||
          (pathTaken === "notConnected" && (edgeLabel.includes("Not Connected") || edgeLabel.includes("No"))) ||
          (pathTaken === "opened" && edgeLabel.includes("Opened")) ||
          (pathTaken === "notOpened" && edgeLabel.includes("Not Opened"))
        ) {
          console.log(`[v0] Following conditional path: ${edgeLabel}`)
          await executeNodeSequence(edge.target, nodes, edges, outputData)
        }
      }
    } else {
      // For regular nodes, follow all connected edges
      for (const edge of connectedEdges) {
        console.log(`[v0] Following edge from ${nodeId} to ${edge.target}`)
        await executeNodeSequence(edge.target, nodes, edges, outputData)
      }
    }
  }

  const executeWorkflow = async () => {
    console.log("[v0] Starting workflow execution...")
    setIsExecuting(true)

    // Find the start node
    const startNode = workflowNodes.find((node) => node.type === "start" || node.data?.actionType === "start")

    if (!startNode) {
      console.log("[v0] No start node found in workflow")
      setIsExecuting(false)
      return
    }

    console.log("[v0] Found start node:", startNode.id)

    await executeNodeSequence(startNode.id, workflowNodes, workflowEdges, {})

    console.log("[v0] Workflow execution completed")
    setIsExecuting(false)
  }

  return (
    <WorkflowContext.Provider
      value={{
        workflowNodes,
        workflowEdges,
        setWorkflowNodes,
        setWorkflowEdges,
        executeWorkflow,
        isExecuting,
      }}
    >
      {children}
    </WorkflowContext.Provider>
  )
}

export function useWorkflow() {
  const context = useContext(WorkflowContext)
  if (context === undefined) {
    throw new Error("useWorkflow must be used within a WorkflowProvider")
  }
  return context
}
