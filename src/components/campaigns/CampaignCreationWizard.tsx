"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowRight, Check, Info } from "lucide-react"
import Link from "next/link"

import { SequenceBuilder } from "./sequenceBuilder"
import { useLeads } from "@/lib/leadsStore"
import { useLinkedInAccounts } from "@/lib/linkedinAccountsStore"
import { useWorkflowRunner } from "@/lib/workflowRunnerContext"

const steps = [
  { id: 1, name: "List of leads", description: "Select your target leads" },
  { id: 2, name: "LinkedIn senders", description: "Choose sender accounts" },
  { id: 3, name: "Sequence", description: "Build your workflow" },
  { id: 4, name: "Review & Launch", description: "Review and launch campaign" },
]

export function CampaignCreationWizard() {
  const [currentStep, setCurrentStep] = useState(1)
  const { leadLists } = useLeads()
  const { getAvailableAccounts } = useLinkedInAccounts()

  // Runner context
  const {
    workflowNodes,
    workflowEdges,
    createCampaign,
    runWorkflow,
    runnerStatus,
    runs,
    campaigns,
    clearRunLogs,
    getRunsForCampaign,
    clearAllLogs,
    isExecuting,
  } = useWorkflowRunner()

  const availableAccounts = getAvailableAccounts()

  const [formData, setFormData] = useState({
    campaignName: "",
    selectedLeadList: "",
    excludeList: "",
    excludeOptions: {
      excludeFromOtherCampaigns: false,
      excludeFromOtherSenders: false,
      excludeFromSameSender: false,
    },
    selectedSenders: [] as string[],
    sequence: null as any,
  })


  // local state for selecting a run to clear logs for (used in Review & Launch)
  const [selectedRunIdForClear, setSelectedRunIdForClear] = useState<string | "">("")

  // default selection: latest run if available
  useEffect(() => {
    if (runs && runs.length > 0) {
      setSelectedRunIdForClear((prev) => {
        if (prev && runs.some((r) => r.id === prev)) return prev
        return runs[0].id
      })
    } else {
      setSelectedRunIdForClear("")
    }
  }, [runs])

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleLaunchCampaign = async () => {
    console.log("[v0] Launching campaign with configuration:", formData)

    // validate sequence is present
    if (!workflowNodes || workflowNodes.length === 0) {
      console.warn("[v0] No sequence configured. Please configure your sequence in the Sequence step.")
      setCurrentStep(3)
      return
    }

    // create campaign record in runner context
    const campaign = createCampaign({
      name: formData.campaignName || `Campaign ${new Date().toLocaleString()}`,
      meta: {
        leadList: formData.selectedLeadList,
        senders: formData.selectedSenders,
        exclude: formData.excludeOptions,
      },
    })

    try {
      // start a run attached to the campaign
      await runWorkflow({ startNodeId: "start", campaignId: campaign.id })
      console.log("[v0] Workflow run started for campaign:", campaign.id)
    } catch (err: any) {
      console.error("[v0] runWorkflow error:", err)
    }
  }

  // Clear logs for selected run
  const handleClearSelectedRunLogs = () => {
    if (!selectedRunIdForClear) {
      alert("No run selected to clear logs for.")
      return
    }

    const confirmed = confirm(
      `Clear logs for run ${selectedRunIdForClear}? This will only clear local cached logs (localStorage).`
    )
    if (!confirmed) return

    try {
      clearRunLogs(selectedRunIdForClear)
      alert("Cleared logs for run: " + selectedRunIdForClear)
      // update selection to next latest run if exists
      const next = runs.find((r) => r.id !== selectedRunIdForClear)
      setSelectedRunIdForClear(next?.id ?? "")
    } catch (err) {
      console.error("clearRunLogs failed", err)
      alert("Failed to clear logs. See console for details.")
    }
  }

  const handleClearAllLogs = () => {
    const confirmed = confirm("Clear ALL logs from local state? This cannot be undone.")
    if (!confirmed) return
    if (typeof clearAllLogs === "function") {
      clearAllLogs()
      alert("Cleared all logs.")
    } else {
      alert("clearAllLogs is not available in the runner context.")
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="campaignName">Campaign name</Label>
                <Input
                  id="campaignName"
                  placeholder="demo"
                  value={formData.campaignName}
                  onChange={(e) => setFormData({ ...formData, campaignName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="excludeList">Select exclude list</Label>
                <Select
                  value={formData.excludeList}
                  onValueChange={(value) => setFormData({ ...formData, excludeList: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select exclude list" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No exclude list</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <Label>Select the list of leads you want to reach out to</Label>
                <Select
                  value={formData.selectedLeadList}
                  onValueChange={(value) => setFormData({ ...formData, selectedLeadList: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select lead list" />
                  </SelectTrigger>
                  <SelectContent>
                    {leadLists.map((list) => (
                      <SelectItem key={list.id} value={list.id}>
                        {list.name} [{list.leadCount} leads]
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button variant="outline" className="w-full bg-transparent">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border border-muted-foreground rounded"></div>
                    <span>Create empty list</span>
                  </div>
                </Button>
              </div>

              <div className="space-y-4">
                <Label>Exclude options</Label>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="excludeFromOtherCampaigns"
                      checked={formData.excludeOptions.excludeFromOtherCampaigns}
                      onCheckedChange={(checked) =>
                        setFormData({
                          ...formData,
                          excludeOptions: {
                            ...formData.excludeOptions,
                            excludeFromOtherCampaigns: checked as boolean,
                          },
                        })
                      }
                    />
                    <div className="space-y-1">
                      <Label htmlFor="excludeFromOtherCampaigns" className="text-sm font-normal">
                        Exclude leads contacted from other HeyReach campaign
                      </Label>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="excludeFromOtherSenders"
                      checked={formData.excludeOptions.excludeFromOtherSenders}
                      onCheckedChange={(checked) =>
                        setFormData({
                          ...formData,
                          excludeOptions: {
                            ...formData.excludeOptions,
                            excludeFromOtherSenders: checked as boolean,
                          },
                        })
                      }
                    />
                    <div className="space-y-1">
                      <Label htmlFor="excludeFromOtherSenders" className="text-sm font-normal">
                        Exclude leads messaged by other senders
                      </Label>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="excludeFromSameSender"
                      checked={formData.excludeOptions.excludeFromSameSender}
                      onCheckedChange={(checked) =>
                        setFormData({
                          ...formData,
                          excludeOptions: {
                            ...formData.excludeOptions,
                            excludeFromSameSender: checked as boolean,
                          },
                        })
                      }
                    />
                    <div className="space-y-1">
                      <Label htmlFor="excludeFromSameSender" className="text-sm font-normal">
                        Exclude leads contacted by same sender from other HeyReach campaign
                      </Label>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center py-8">
              <h3 className="text-lg font-medium mb-2">Select LinkedIn Senders</h3>
              <p className="text-muted-foreground mb-6">
                Choose which LinkedIn accounts will send messages in this campaign
              </p>

              <div className="max-w-md mx-auto space-y-4">
                {availableAccounts.map((account) => (
                  <div key={account.id} className="flex items-center space-x-3 p-4 border rounded-lg">
                    <Checkbox
                      id={account.id}
                      checked={formData.selectedSenders.includes(account.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFormData({
                            ...formData,
                            selectedSenders: [...formData.selectedSenders, account.id],
                          })
                        } else {
                          setFormData({
                            ...formData,
                            selectedSenders: formData.selectedSenders.filter((id) => id !== account.id),
                          })
                        }
                      }}
                    />
                    <div className="flex-1 text-left">
                      <div className="font-medium">{account.name}</div>
                      <div className="text-sm text-muted-foreground">{account.email}</div>
                      <div className={`text-sm ${account.status === "Available" ? "text-green-600" : "text-blue-600"}`}>
                        {account.status}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Limits: {account.sendingLimits.connections}/day connections, {account.sendingLimits.messages}
                        /day messages
                      </div>
                    </div>
                  </div>
                ))}

                {availableAccounts.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      No LinkedIn accounts available. Please connect an account first.
                    </p>
                    <Button variant="outline" className="mt-4 bg-transparent">
                      Connect LinkedIn Account
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <SequenceBuilder />
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Review & Launch</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Campaign Name</Label>
                  <p className="text-sm text-muted-foreground">{formData.campaignName || "Not specified"}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Lead List</Label>
                  <p className="text-sm text-muted-foreground">
                    {leadLists.find((l) => l.id === formData.selectedLeadList)?.name || "Not selected"}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">LinkedIn Senders</Label>
                  <p className="text-sm text-muted-foreground">
                    {formData.selectedSenders.length > 0
                      ? formData.selectedSenders
                          .map((senderId) => availableAccounts.find((acc) => acc.id === senderId)?.name)
                          .filter(Boolean)
                          .join(", ")
                      : "No senders selected"}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Sequence</Label>
                  <p className="text-sm text-muted-foreground">
                    {workflowNodes && workflowNodes.length > 0 ? "Custom sequence configured" : "No sequence configured"}
                  </p>
                </div>
              </div>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-medium mb-2">Ready to Launch</h4>
              <p className="text-sm text-muted-foreground">
                Your campaign is configured and ready to start. You can always pause or modify it later.
              </p>

              <div className="mt-4 flex items-center gap-2">
                <Button onClick={handleLaunchCampaign} disabled={isExecuting} className="bg-blue-600 hover:bg-blue-700">
                  {isExecuting ? "Launching..." : "Launch Campaign"}
                </Button>

                {/* Clear logs controls: select run and clear */}
                <div className="flex items-center gap-2">
                  <select
                    value={selectedRunIdForClear}
                    onChange={(e) => setSelectedRunIdForClear(e.target.value)}
                    className="border rounded px-2 py-1 text-sm"
                    disabled={!(runs && runs.length > 0)}
                  >
                    {(!runs || runs.length === 0) ? (
                      <option value="">No runs</option>
                    ) : (
                      runs.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.id} — {new Date(r.startedAt).toLocaleString()} — {r.status}
                        </option>
                      ))
                    )}
                  </select>

                  <Button variant="ghost" onClick={handleClearSelectedRunLogs} disabled={!selectedRunIdForClear}>
                    Clear Run Logs
                  </Button>

                  <Button variant="ghost" onClick={handleClearAllLogs}>
                    Clear All Logs
                  </Button>
                </div>

                <Button variant="outline" onClick={() => window.location.assign("/dashboard/workflowLogs")}>
                  View Logs
                </Button>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 ">
      {/* Steps Header */}
      <div className="flex items-center justify-center space-x-8 py-6">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className="flex items-center space-x-3">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                  currentStep > step.id
                    ? "bg-blue-600 text-white"
                    : currentStep === step.id
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {currentStep > step.id ? <Check className="h-4 w-4" /> : step.id}
              </div>
              <div className="text-left">
                <div
                  className={`text-sm font-medium ${
                    currentStep >= step.id ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {step.name}
                </div>
              </div>
            </div>
            {index < steps.length - 1 && (
              <div className={`w-12 h-0.5 mx-4 ${currentStep > step.id ? "bg-blue-600" : "bg-gray-200"}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <Card className="bg-[#eef9ff]">
        <CardContent className="p-8">{renderStepContent()}</CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-end space-x-4">
        {currentStep === steps.length ? (
          <Button onClick={handleLaunchCampaign} disabled={isExecuting} className="bg-blue-600 hover:bg-blue-700">
            {isExecuting ? "Launching..." : "Launch Campaign"}
          </Button>
        ) : (
          <div className="flex items-center gap-2">
            {currentStep > 1 && (
              <Button variant="outline" onClick={prevStep}>
                Back
              </Button>
            )}
            <Button onClick={nextStep} className="bg-blue-600 hover:bg-blue-700">
              Continue
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default CampaignCreationWizard
