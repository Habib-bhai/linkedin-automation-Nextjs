"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Search, Plus, Users, MoreHorizontal, Upload, FileText } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useLeads, type Lead, type LeadList } from "@/lib/leadsStore"

export default function LeadsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [listTypeFilter, setListTypeFilter] = useState("all")
  const [campaignFilter, setCampaignFilter] = useState("all")
  const { leadLists, addLeadList } = useLeads()
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
  const [newListName, setNewListName] = useState("")
  const [csvFile, setCsvFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const handleCsvUpload = async () => {
    if (!csvFile || !newListName.trim()) return

    setIsUploading(true)

    try {
      // TODO: Replace with actual backend integration
      // Parse CSV file
      const text = await csvFile.text()
      const lines = text.split("\n")
      const headers = lines[0].split(",").map((h) => h.trim().toLowerCase())

      const leads: Lead[] = []
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(",").map((v) => v.trim())
        if (values.length >= headers.length && values[0]) {
          const lead: Lead = {
            id: `lead_${Date.now()}_${i}`,
            firstName: values[headers.indexOf("firstname") || headers.indexOf("first_name")] || "",
            lastName: values[headers.indexOf("lastname") || headers.indexOf("last_name")] || "",
            email: values[headers.indexOf("email")] || "",
            company: values[headers.indexOf("company")] || "",
            position: values[headers.indexOf("position") || headers.indexOf("title")] || "",
            linkedinUrl: values[headers.indexOf("linkedin") || headers.indexOf("linkedin_url")] || "",
          }
          leads.push(lead)
        }
      }

      const newLeadList: LeadList = {
        id: `list_${Date.now()}`,
        name: newListName,
        createdAt: new Date().toLocaleString(),
        status: "Not used",
        statusType: "inactive",
        leadCount: leads.length,
        leads: leads,
      }

      addLeadList(newLeadList)
      setIsUploadDialogOpen(false)
      setNewListName("")
      setCsvFile(null)
    } catch (error) {
      console.error("Error uploading CSV:", error)
      // TODO: Add proper error handling with toast notifications
    } finally {
      setIsUploading(false)
    }
  }

  const filteredLists = leadLists.filter((list) => {
    const matchesSearch = list.name.toLowerCase().includes(searchQuery.toLowerCase())
    // Add more filtering logic here when needed
    return matchesSearch
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-balance">Leads</h1>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search lists"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={listTypeFilter} onValueChange={setListTypeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="List type: All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">List type: All</SelectItem>
              <SelectItem value="imported">Imported</SelectItem>
              <SelectItem value="manual">Manual</SelectItem>
            </SelectContent>
          </Select>

          <Select value={campaignFilter} onValueChange={setCampaignFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Used in campaign" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Used in campaign</SelectItem>
              <SelectItem value="active">Active campaigns</SelectItem>
              <SelectItem value="inactive">Inactive campaigns</SelectItem>
              <SelectItem value="unused">Not used</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Add leads
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Upload Lead List</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="listName">List Name</Label>
                <Input
                  id="listName"
                  placeholder="Enter list name"
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="csvFile">CSV File</Label>
                <div className="mt-2">
                  <Input
                    id="csvFile"
                    type="file"
                    accept=".csv"
                    onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
                  />
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  CSV should include columns: firstName, lastName, email, company, position, linkedin
                </p>
              </div>

              {csvFile && (
                <div className="flex items-center space-x-2 p-3 bg-muted rounded-lg">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{csvFile.name}</span>
                </div>
              )}

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCsvUpload} disabled={!csvFile || !newListName.trim() || isUploading}>
                  {isUploading ? (
                    <>
                      <Upload className="h-4 w-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload
                    </>
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Leads Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left py-4 px-6 font-medium">List Name</th>
                  <th className="text-left py-4 px-6 font-medium">Status</th>
                  <th className="text-left py-4 px-6 font-medium">Leads</th>
                  <th className="text-right py-4 px-6 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLists.map((list) => (
                  <tr key={list.id} className="border-b last:border-b-0 hover:bg-muted/25">
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="font-medium">{list.name}</div>
                          <div className="text-sm text-muted-foreground">{list.createdAt}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
                        {list.status}
                      </Badge>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{list.leadCount}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View leads</DropdownMenuItem>
                          <DropdownMenuItem>Edit list</DropdownMenuItem>
                          <DropdownMenuItem>Export</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredLists.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No lead lists found. Add your first lead list to get started.
            </div>
          )}

          {/* Pagination */}
          <div className="flex items-center justify-between px-6 py-4 border-t">
            <div className="text-sm text-muted-foreground">
              Showing 1-{filteredLists.length} of {filteredLists.length}
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm" disabled>
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
