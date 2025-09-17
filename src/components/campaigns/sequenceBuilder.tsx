"use client"

import { useState, useCallback, useRef, useMemo, useEffect } from "react"
import Link from "next/link"
import ReactFlow, {
  useNodesState,
  useEdgesState,
  addEdge,
  Controls,
  Background,
  useReactFlow,
  type Node,
  type Edge,
  type Connection,
  ReactFlowProvider,
  getOutgoers,
} from "reactflow"
import "reactflow/dist/style.css"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

import { StartNode } from "./sequenceComponents/nodes/StartNode"
import { SendConnectionNode } from "./sequenceComponents/nodes/SendConnectionNode"
import { IfConnectionNode } from "./sequenceComponents/nodes/IfConnectionNode"
import { SendMessageNode } from "./sequenceComponents/nodes/SendMessageNode"
import { InmailNode } from "./sequenceComponents/nodes/InMailNode"
import { ViewProfileNode } from "./sequenceComponents/nodes/ViewProfileNode"
import { FollowNode } from "./sequenceComponents/nodes/FollowNode"
import { LikePostNode } from "./sequenceComponents/nodes/LikePostNode"
import { IfOpenProfileNode } from "./sequenceComponents/nodes/IfOpenProfileNode"
import { CustomEdge } from "./sequenceComponents/edges/CustomEdge"
import { useWorkflowRunner } from "@/lib/workflowRunnerContext"

interface NodeData {
  actionType?: string
  label: string
  config?: any
}

const initialNodes: Node<NodeData>[] = [
  {
    id: "start",
    type: "start",
    position: { x: 250, y: 50 },
    data: { label: "Campaign Start" },
  },
]

const actionTypes = [
  { type: "start", label: "Campaign Start" },
  { type: "send-connection", label: "Send Connection Request" },
  { type: "if-connection", label: "If Connection" },
  { type: "if-open-profile", label: "If Open Profile" },
  { type: "send-message", label: "Send Message" },
  { type: "inmail", label: "InMail" },
  { type: "view-profile", label: "View Profile" },
  { type: "follow", label: "Follow" },
  { type: "like-post", label: "Like Post" },
]

const edgeTypes = {
  removable: CustomEdge,
}

function SequenceBuilderContent() {
  const [nodes, setNodes, onNodesChange] = useNodesState<NodeData>(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([])
  const [showMenu, setShowMenu] = useState(false)
  const reactFlowWrapper = useRef<HTMLDivElement>(null)

  const { getViewport } = useReactFlow()

  // runner context holds canonical canvas state now
  const {
    workflowNodes,
    workflowEdges,
    setWorkflowNodes,
    setWorkflowEdges,
    runWorkflow,
    clearRunLogs,
    runnerStatus,
    stopWorkflow,
    runs,
  } = useWorkflowRunner()

  // local state for selecting which run to clear
  const [selectedRunId, setSelectedRunId] = useState<string | "">("")

  // Sync nodes/edges to runner context whenever they change (reliable)
  useEffect(() => {
    setWorkflowNodes(nodes)
  }, [nodes, setWorkflowNodes])

  useEffect(() => {
    setWorkflowEdges(edges)
  }, [edges, setWorkflowEdges])

  // Keep the run selector defaulted to latest run when runs array changes
  useEffect(() => {
    if (runs && runs.length > 0) {
      // runs are stored newest-first in the provider — default to the latest (index 0)
      setSelectedRunId((prev) => {
        // keep existing selection if still present
        if (prev && runs.some((r) => r.id === prev)) return prev
        return runs[0].id
      })
    } else {
      setSelectedRunId("")
    }
  }, [runs])

  const onConnect = useCallback(
    (params: Connection) => {
      const newEdges = addEdge({ ...params, type: "removable" }, edges)
      setEdges(newEdges)
      // runner context will be updated via effect above
    },
    [setEdges, edges],
  )

  const addNode = useCallback(
    (actionType: string, position: { x: number; y: number }) => {
      let nodeType: string
      switch (actionType) {
        case "start":
          nodeType = "start"
          break
        case "send-connection":
          nodeType = "sendConnection"
          break
        case "if-connection":
          nodeType = "ifConnection"
          break
        case "if-open-profile":
          nodeType = "ifOpenProfile"
          break
        case "send-message":
          nodeType = "sendMessage"
          break
        case "inmail":
          nodeType = "inmail"
          break
        case "view-profile":
          nodeType = "viewProfile"
          break
        case "follow":
          nodeType = "follow"
          break
        case "like-post":
          nodeType = "likePost"
          break
        default:
          nodeType = "action"
      }
      const newNode: Node<NodeData> = {
        id: `${actionType}-${Date.now()}`,
        type: nodeType,
        position,
        data: {
          actionType,
          label: actionTypes.find((a) => a.type === actionType)?.label || "New Action",
          config: {},
        },
      }
      const updatedNodes = nodes.concat(newNode)
      setNodes(updatedNodes)
      // runner context updated via effect
    },
    [setNodes, nodes],
  )

  const removeNode = useCallback(
    (nodeId: string) => {
      const updatedNodes = nodes.filter((n) => n.id !== nodeId)
      const updatedEdges = edges.filter((e) => e.source !== nodeId && e.target !== nodeId)
      setNodes(updatedNodes)
      setEdges(updatedEdges)
      // runner context updated via effects
    },
    [setNodes, setEdges, nodes, edges],
  )

  const enhancedNodeTypes = useMemo(
    () => ({
      start: (props: any) => <StartNode {...props} onRemove={() => removeNode(props.id)} />,
      sendConnection: (props: any) => <SendConnectionNode {...props} onRemove={() => removeNode(props.id)} />,
      ifConnection: (props: any) => <IfConnectionNode {...props} onRemove={() => removeNode(props.id)} />,
      ifOpenProfile: (props: any) => <IfOpenProfileNode {...props} onRemove={() => removeNode(props.id)} />,
      sendMessage: (props: any) => <SendMessageNode {...props} onRemove={() => removeNode(props.id)} />,
      inmail: (props: any) => <InmailNode {...props} onRemove={() => removeNode(props.id)} />,
      viewProfile: (props: any) => <ViewProfileNode {...props} onRemove={() => removeNode(props.id)} />,
      follow: (props: any) => <FollowNode {...props} onRemove={() => removeNode(props.id)} />,
      likePost: (props: any) => <LikePostNode {...props} onRemove={() => removeNode(props.id)} />,
    }),
    [removeNode],
  )

  const handleAddActionClick = () => {
    setShowMenu(true)
  }

  const handleAddNode = (actionType: string) => {
    // get viewport center and add a node at the center
    const { x: viewportX, y: viewportY, zoom } = getViewport()
    const boundingRect = reactFlowWrapper.current?.getBoundingClientRect()
    const width = boundingRect?.width || 0
    const height = boundingRect?.height || 0
    const centerX = -viewportX / zoom + width / (2 * zoom)
    const centerY = -viewportY / zoom + height / (2 * zoom)
    addNode(actionType, { x: centerX - 64, y: centerY - 64 })
    setShowMenu(false)
  }

  // adjacency (optional)
  const adjacency = useMemo(() => {
    const map = new Map<string, string[]>()
    nodes.forEach((n) => {
      const outs = getOutgoers(n, nodes, edges)
      map.set(n.id, outs.map((o) => o.id))
    })
    return map
  }, [nodes, edges])

  // --- Clear run logs handler using clearRunLogs(runId) from context ---
  const handleClearSelectedRunLogs = () => {
    if (!selectedRunId) {
      alert("No run selected to clear logs for.")
      return
    }

    const confirmed = confirm(`Clear logs for run ${selectedRunId}? This cannot be undone (local only).`)
    if (!confirmed) return

    try {
      clearRunLogs(selectedRunId)
      // after clearing, pick the next latest run if any
      const next = runs.find((r) => r.id !== selectedRunId)
      setSelectedRunId(next?.id ?? "")
      // small feedback
      // In production you'd show a toast; using alert for simplicity here:
      alert("Cleared logs for run: " + selectedRunId)
    } catch (err) {
      console.error("clearRunLogs failed", err)
      alert("Failed to clear logs. See console for details.")
    }
  }

  return (
    <div className="w-full h-[600px] relative" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={enhancedNodeTypes}
        edgeTypes={edgeTypes}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>

      {/* Controls: Run, Add, View Logs, Clear Logs, Stop */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2 items-center">
        <Button
          onClick={() => runWorkflow({ startNodeId: "start" })}
          disabled={runnerStatus === "running"}
        >
          {runnerStatus === "running" ? "Running..." : "Run Workflow"}
        </Button>

        <Button onClick={handleAddActionClick}>Add Action</Button>

        {/* Clear run logs selector + button */}
        {/* <div className="flex items-center gap-2">
          <select
            value={selectedRunId}
            onChange={(e) => setSelectedRunId(e.target.value)}
            className="border rounded px-2 py-1 text-sm"
            disabled={!(runs && runs.length > 0)}
            title={runs && runs.length > 0 ? "Select run to clear its logs" : "No runs available"}
          >
            {(!runs || runs.length === 0) ? (
              <option value="">No runs</option>
            ) : (
              <>
                {runs.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.id} — {new Date(r.startedAt).toLocaleString()} — {r.status}
                  </option>
                ))}
              </>
            )}
          </select>

          <Button
            variant="ghost"
            onClick={handleClearSelectedRunLogs}
            disabled={!selectedRunId}
            title={selectedRunId ? `Clear logs for ${selectedRunId}` : "Select a run first"}
          >
            Clear Run Logs
          </Button>
        </div> */}

        <Button variant="ghost" onClick={() => stopWorkflow()} disabled={runnerStatus !== "running"}>
          Stop
        </Button>

        <Link href="/dashboard/workflowLogs" className="ml-2">
          <Button variant="outline">View Logs</Button>
        </Link>
      </div>

      {/* Add Action modal/menu */}
      {showMenu && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white border rounded-lg shadow-lg p-2 z-50 min-w-[200px]">
          <div className="text-sm font-medium mb-2 px-2">Add Action</div>
          <div className="space-y-1">
            {actionTypes.map((action) => (
              <Button
                key={action.type}
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                onClick={() => handleAddNode(action.type)}
              >
                {action.label}
              </Button>
            ))}
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-0 right-0 h-6 w-6 p-0"
            onClick={() => setShowMenu(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}

export function SequenceBuilder() {
  return (
    <ReactFlowProvider>
      <SequenceBuilderContent />
    </ReactFlowProvider>
  )
}

export default SequenceBuilderContent
