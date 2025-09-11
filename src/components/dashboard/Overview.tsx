"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { useState } from "react"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const chartData = [
  { date: "29 Aug", value: 0 },
  { date: "30 Aug", value: 1 },
  { date: "31 Aug", value: 2 },
  { date: "01 Sep", value: 1 },
  { date: "02 Sep", value: 3 },
  { date: "03 Sep", value: 2 },
]

const senderStats = [
  {
    name: "Habib Ullah",
    status: "Available",
    campaigns: 0,
    connectionsSent: 0,
    connectionRate: "0 (0.0%)",
    messagesSent: 0,
    messageReplyRate: "0 (0.0%)",
    inmailsSent: 0,
    inmailReplyRate: "0 (0.0%)",
    avatar: "/abstract-profile.png",
  },
]

const campaignStats = [
  // Empty for now - will be populated when campaigns are created
]

export function DashboardOverview() {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(2025, 7, 29), // Aug 29, 2025
    to: new Date(2025, 8, 4), // Sep 4, 2025
  })
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Select senders:</label>
          <Select defaultValue="all">
            <SelectTrigger>
              <SelectValue placeholder="Select senders" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Select senders</SelectItem>
              <SelectItem value="habib">Habib Ullah</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Select Campaign:</label>
          <Select defaultValue="all">
            <SelectTrigger>
              <SelectValue placeholder="Select target campaign" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Select target campaign</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Enter a date range:</label>
          <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "M/d/yyyy")} - {format(dateRange.to, "M/d/yyyy")}
                    </>
                  ) : (
                    format(dateRange.from, "M/d/yyyy")
                  )
                ) : (
                  <span>Pick a date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={(range) => {
                  if (range?.from && range?.to) {
                    setDateRange({ from: range.from, to: range.to })
                    setIsCalendarOpen(false)
                  }
                }}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-3 h-3 bg-blue-500 rounded-sm"></div>
              <span className="text-sm font-medium">Connections Sent</span>
            </div>
            <div className="text-2xl font-bold">0</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-3 h-3 bg-green-500 rounded-sm"></div>
              <span className="text-sm font-medium">Connections Accepted</span>
            </div>
            <div className="text-2xl font-bold">0</div>
            <div className="text-sm text-green-600">0.0%</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-3 h-3 bg-orange-500 rounded-sm"></div>
              <span className="text-sm font-medium">Messages Sent</span>
            </div>
            <div className="text-2xl font-bold">0</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-3 h-3 bg-purple-500 rounded-sm"></div>
              <span className="text-sm font-medium">Message Replies</span>
            </div>
            <div className="text-2xl font-bold">0</div>
            <div className="text-sm text-green-600">0.0%</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-3 h-3 bg-cyan-500 rounded-sm"></div>
              <span className="text-sm font-medium">InMails Sent</span>
            </div>
            <div className="text-2xl font-bold">0</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-3 h-3 bg-gray-800 rounded-sm"></div>
              <span className="text-sm font-medium">InMail Replies</span>
            </div>
            <div className="text-2xl font-bold">0</div>
            <div className="text-sm text-green-600">0.0%</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-6">
          <ChartContainer
            config={{
              value: {
                label: "Performance",
                color: "hsl(var(--chart-1))",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 5]} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="var(--color-value)"
                  strokeWidth={2}
                  dot={{ fill: "var(--color-value)", strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* LinkedIn Sender Stats */}
        <Card>
          <CardHeader>
            <CardTitle>All-Time Stats: LinkedIn Sender</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 font-medium">Name</th>
                    <th className="text-left py-2 font-medium">Status</th>
                    <th className="text-left py-2 font-medium">Campaigns</th>
                    <th className="text-left py-2 font-medium">Connections Sent</th>
                    <th className="text-left py-2 font-medium">Connection Rate</th>
                    <th className="text-left py-2 font-medium">Messages Sent</th>
                    <th className="text-left py-2 font-medium">Message Reply Rate</th>
                    <th className="text-left py-2 font-medium">InMails Sent</th>
                    <th className="text-left py-2 font-medium">InMail Reply Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {senderStats.map((sender, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-3">
                        <div className="flex items-center space-x-2">
                          <img
                            src={sender.avatar || "/placeholder.svg"}
                            alt={sender.name}
                            className="w-8 h-8 rounded-full"
                          />
                          <span>{sender.name}</span>
                        </div>
                      </td>
                      <td className="py-3">
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          ✓ {sender.status}
                        </Badge>
                      </td>
                      <td className="py-3">{sender.campaigns}</td>
                      <td className="py-3">{sender.connectionsSent}</td>
                      <td className="py-3">{sender.connectionRate}</td>
                      <td className="py-3">{sender.messagesSent}</td>
                      <td className="py-3">{sender.messageReplyRate}</td>
                      <td className="py-3">{sender.inmailsSent}</td>
                      <td className="py-3">{sender.inmailReplyRate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
              <span>Showing 1-1 of 1</span>
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

        {/* Campaign Stats */}
        <Card>
          <CardHeader>
            <CardTitle>All-Time Stats: Campaigns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              No campaigns created yet. Create your first campaign to see analytics here.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
