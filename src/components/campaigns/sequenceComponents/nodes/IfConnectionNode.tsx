"use client"
import { Handle, Position } from "reactflow"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { X, Zap } from "lucide-react"

interface NodeData {
  actionType?: string
  label: string
  config?: any
}

interface IfConnectionNodeProps {
  data: NodeData
  id: string
  onRemove: () => void
}

export function IfConnectionNode({ data, id, onRemove }: IfConnectionNodeProps) {
      console.log("[Hello] from IfConnectionNode")

  return (
    <Card className="w-32 h-32 bg-white border-2 border-yellow-300 shadow-md rounded-md flex flex-col items-center justify-center relative group">
      <Button
        variant="ghost"
        size="sm"
        className="absolute top-[-12px] right-[-12px] h-6 w-6 p-0 bg-white border rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={(e) => {
          e.stopPropagation()
          onRemove()
        }}
      >
        <X className="h-3 w-3" />
      </Button>
      <Zap className="h-12 w-12 text-yellow-600" />
      <p className="text-xs text-center px-2 mt-2">{data.label}</p>
      <div className="absolute bottom-0 w-full h-1 bg-yellow-300 group-hover:bg-blue-500 transition-colors"></div>
      <div className="absolute bottom-2 flex justify-between w-full px-4 text-xs text-gray-500">
        <span>Y</span>
        <span>N</span>
      </div>
      <Handle type="target" position={Position.Left} id="target" className="top-[-4px]" />
      <Handle type="source" position={Position.Right} id="yes" style={{ left: "25%" }} className="bottom-[-4px]" />
      <Handle type="source" position={Position.Right} id="no" style={{ left: "75%" }} className="bottom-[-4px]" />
    </Card>
  )
}
