"use client"
import { Handle, Position } from "reactflow"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { X, Heart } from "lucide-react"

interface NodeData {
  actionType?: string
  label: string
  config?: any
}

interface LikePostNodeProps {
  data: NodeData
  id: string
  onRemove: () => void
}

export function LikePostNode({ data, id, onRemove }: LikePostNodeProps) {
    console.log("[Hello] from LikePostNode")

    return (
    <Card className="w-32 h-32 bg-white border-2 border-gray-300 shadow-md rounded-md flex flex-col items-center justify-center relative group">
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
      <Heart className="h-12 w-12 text-gray-600" />
      <p className="text-xs text-center px-2 mt-2">{data.label}</p>
      <div className="absolute bottom-0 w-full h-1 bg-gray-300 group-hover:bg-blue-500 transition-colors"></div>
      <Handle type="target" position={Position.Left} id="target" className="top-[-4px]" />
      <Handle type="source" position={Position.Right} id="source" className="bottom-[-4px]" />
    </Card>
  )
}
