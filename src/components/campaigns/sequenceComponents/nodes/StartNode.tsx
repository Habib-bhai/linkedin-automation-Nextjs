"use client"
import { Handle, Position } from "reactflow"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { X, Zap } from "lucide-react"

interface NodeData {
  label: string
}

interface StartNodeProps {
  data: NodeData
  id: string
  onRemove: () => void
}

export function StartNode({ data, id, onRemove }: StartNodeProps) {

    console.log("[Hello] from StartNode")

  return (
    <Card className="w-32 h-32 bg-white border-2 border-blue-300 shadow-md rounded-md flex flex-col items-center justify-center relative hover:border-blue-500 hover:shadow-lg transition-all group">
      <Zap className="h-12 w-12 text-blue-600" />
      <p className="text-xs text-center px-2 mt-2">{data.label}</p>
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
      <Handle type="source" position={Position.Right} id="source" className="bottom-[-4px]" />
    </Card>
  )
}
