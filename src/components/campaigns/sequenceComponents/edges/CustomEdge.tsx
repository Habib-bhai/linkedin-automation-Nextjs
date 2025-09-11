"use client"

import React, { useCallback } from "react"
import {
  type EdgeProps,
  type Position,
  useReactFlow,
  getBezierPath,
  EdgeLabelRenderer,
  BaseEdge,
} from "reactflow"
import { X } from "lucide-react"

export function CustomEdge(props: EdgeProps) {
  const {
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    style = {},
    markerEnd,
  } = props

  // reactflow instance (provides deleteElements and setEdges)
  const rfInstance = useReactFlow()

  // getBezierPath returns [pathString, labelX, labelY]
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  })

  const onRemove = useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation()
      event.preventDefault()

      // prefer deleteElements when available (modern API), fallback to setEdges
      if (typeof rfInstance.deleteElements === "function") {
        // deleteElements accepts { edges?: [{ id }] }
        void rfInstance.deleteElements({ edges: [{ id }] })
      } else if (typeof rfInstance.setEdges === "function") {
        rfInstance.setEdges((eds) => eds.filter((e) => e.id !== id))
      } else {
        // last resort - nothing available (very old versions)
        console.warn("Unable to remove edge: reactflow instance has no deleteElements or setEdges")
      }
    },
    [rfInstance, id],
  )

  return (
    <>
      <BaseEdge id={id} path={edgePath} markerEnd={markerEnd} style={style} />

      {/* EdgeLabelRenderer is a portal — make the inner div clickable by setting pointerEvents:'all' and adding nodrag/nopan */}
      <EdgeLabelRenderer>
        <div
          // position using left/top (labelX/labelY) and center via translate(-50%,-50%)
          style={{
            position: "absolute",
            left: `${labelX}px`,
            top: `${labelY}px`,
            transform: "translate(-50%, -50%)",
            pointerEvents: "all", // IMPORTANT — allows interaction inside EdgeLabelRenderer
            zIndex: 1000,
          }}
          className="nodrag nopan"
        >
          <button
            onClick={onRemove}
            onMouseDown={(e) => e.stopPropagation()} // prevent canvas drag
            aria-label="Delete edge"
            title="Delete edge"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 20,
              height: 20,
              borderRadius: "50%",
              background: "#fff",
              border: "1px solid #ddd",
              cursor: "pointer",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            }}
            className="nodrag nopan"
          >
            <X className="h-3 w-3 text-red-500" />
          </button>
        </div>
      </EdgeLabelRenderer>
    </>
  )
}
