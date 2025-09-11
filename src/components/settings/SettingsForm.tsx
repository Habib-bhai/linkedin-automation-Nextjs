"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { User, Bell, Shield, CreditCard, Users, Zap, Globe } from "lucide-react"

export function SettingsForm() {
  return (
    <div className="max-w-4xl space-y-6">
      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Profile Information</span>
              </CardTitle>
              <CardDescription>Update your personal information and preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" defaultValue="John" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" defaultValue="Doe" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue="john@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input id="company" defaultValue="Acme Corp" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select defaultValue="pst">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pst">Pacific Standard Time</SelectItem>
                    <SelectItem value="est">Eastern Standard Time</SelectItem>
                    <SelectItem value="cst">Central Standard Time</SelectItem>
                    <SelectItem value="mst">Mountain Standard Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button>Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>Notification Preferences</span>
              </CardTitle>
              <CardDescription>Choose what notifications you want to receive</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Campaign Updates</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified when campaigns start, pause, or complete
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>New Replies</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications for new lead replies</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Account Warnings</Label>
                    <p className="text-sm text-muted-foreground">Get alerts about LinkedIn account health issues</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Daily Summaries</Label>
                    <p className="text-sm text-muted-foreground">Receive daily performance summaries via email</p>
                  </div>
                  <Switch />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Weekly Reports</Label>
                    <p className="text-sm text-muted-foreground">Get comprehensive weekly analytics reports</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
              <Button>Save Preferences</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Security Settings</span>
              </CardTitle>
              <CardDescription>Manage your account security and authentication</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-base font-medium">Change Password</Label>
                  <p className="text-sm text-muted-foreground mb-4">Update your password to keep your account secure</p>
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input id="currentPassword" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input id="newPassword" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input id="confirmPassword" type="password" />
                    </div>
                    <Button>Update Password</Button>
                  </div>
                </div>
                <Separator />
                <div>
                  <Label className="text-base font-medium">Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground mb-4">Add an extra layer of security to your account</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm">
                        Status: <Badge variant="outline">Disabled</Badge>
                      </p>
                    </div>
                    <Button variant="outline">Enable 2FA</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="h-5 w-5" />
                <span>Billing & Subscription</span>
              </CardTitle>
              <CardDescription>Manage your subscription and billing information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-base font-medium">Current Plan</Label>
                  <div className="flex items-center justify-between mt-2">
                    <div>
                      <Badge variant="default" className="text-sm">
                        Pro Plan
                      </Badge>
                      <p className="text-sm text-muted-foreground mt-1">$49/month • Up to 5 LinkedIn accounts</p>
                    </div>
                    <Button variant="outline">Change Plan</Button>
                  </div>
                </div>
                <Separator />
                <div>
                  <Label className="text-base font-medium">Usage This Month</Label>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <div className="text-2xl font-bold">3</div>
                      <div className="text-sm text-muted-foreground">LinkedIn Accounts</div>
                    </div>
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <div className="text-2xl font-bold">1,247</div>
                      <div className="text-sm text-muted-foreground">Messages Sent</div>
                    </div>
                  </div>
                </div>
                <Separator />
                <div>
                  <Label className="text-base font-medium">Payment Method</Label>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-5 bg-blue-600 rounded text-white text-xs flex items-center justify-center">
                        VISA
                      </div>
                      <span className="text-sm">•••• •••• •••• 4242</span>
                    </div>
                    <Button variant="outline" size="sm">
                      Update
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Team Management</span>
              </CardTitle>
              <CardDescription>Invite team members and manage permissions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-base font-medium">Invite Team Member</Label>
                  <div className="flex space-x-2 mt-2">
                    <Input placeholder="Enter email address" className="flex-1" />
                    <Select defaultValue="member">
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="member">Member</SelectItem>
                        <SelectItem value="viewer">Viewer</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button>Invite</Button>
                  </div>
                </div>
                <Separator />
                <div>
                  <Label className="text-base font-medium">Team Members</Label>
                  <div className="space-y-3 mt-2">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">John Doe</p>
                        <p className="text-sm text-muted-foreground">john@example.com</p>
                      </div>
                      <Badge variant="outline">Owner</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Sarah Johnson</p>
                        <p className="text-sm text-muted-foreground">sarah@example.com</p>
                      </div>
                      <Badge variant="secondary">Admin</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="h-5 w-5" />
                <span>Integrations</span>
              </CardTitle>
              <CardDescription>Connect external services and tools</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                      <Globe className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium">HeyReach.io</p>
                      <p className="text-sm text-muted-foreground">LinkedIn automation platform</p>
                    </div>
                  </div>
                  <Badge variant="default">Connected</Badge>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                      <Zap className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium">OpenAI</p>
                      <p className="text-sm text-muted-foreground">AI-powered message personalization</p>
                    </div>
                  </div>
                  <Badge variant="default">Connected</Badge>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                      <Globe className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium">Zapier</p>
                      <p className="text-sm text-muted-foreground">Workflow automation</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Connect
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
