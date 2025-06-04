import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Globe } from "lucide-react";
import {
  NotificationPreferences,
  NotificationType,
} from "@/types/notification";
import { ThemeToggle } from "@/components/theme-toggle";
import PageHeader from "@/components/PageHeader";

export default function SettingsPage() {
  // Mock data - would be fetched from API in a real implementation
  // const user = {
  //   firstName: "John",
  //   lastName: "Doe",
  //   email: "john.doe@example.com",
  // };

  const notificationPreferences: NotificationPreferences = {
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: false,
    disabledTypes: [],
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Manage your account preferences"
      />

      <Tabs defaultValue="notifications">
        <TabsList>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="language">Language</TabsTrigger>
        </TabsList>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Configure how you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Notification Channels</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="emailNotifications">
                        Email Notifications
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications via email
                      </p>
                    </div>
                    <Switch
                      id="emailNotifications"
                      checked={notificationPreferences.emailNotifications}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="smsNotifications">
                        SMS Notifications
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications via SMS
                      </p>
                    </div>
                    <Switch
                      id="smsNotifications"
                      checked={notificationPreferences.smsNotifications}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="pushNotifications">
                        Push Notifications
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Receive push notifications on your devices
                      </p>
                    </div>
                    <Switch
                      id="pushNotifications"
                      checked={notificationPreferences.pushNotifications}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-medium">Notification Types</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="transactionNotifications">
                        Transaction Updates
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Notifications about your transactions
                      </p>
                    </div>
                    <Switch
                      id="transactionNotifications"
                      checked={
                        !notificationPreferences.disabledTypes.includes(
                          NotificationType.TRANSACTION
                        )
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="disputeNotifications">
                        Dispute Updates
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Notifications about disputes
                      </p>
                    </div>
                    <Switch
                      id="disputeNotifications"
                      checked={
                        !notificationPreferences.disabledTypes.includes(
                          NotificationType.DISPUTE
                        )
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="paymentNotifications">
                        Payment Updates
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Notifications about payments and wallet activities
                      </p>
                    </div>
                    <Switch
                      id="paymentNotifications"
                      checked={
                        !notificationPreferences.disabledTypes.includes(
                          NotificationType.PAYMENT
                        )
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="systemNotifications">
                        System Updates
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        System announcements and updates
                      </p>
                    </div>
                    <Switch
                      id="systemNotifications"
                      checked={
                        !notificationPreferences.disabledTypes.includes(
                          NotificationType.SYSTEM
                        )
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Button>Save Preferences</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Tab */}
        <TabsContent value="appearance" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>
                Customize the look and feel of the application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Theme</h4>
                <div className="flex items-center justify-center">
                  <ThemeToggle />
                </div>
              </div>

              <div className="pt-4">
                <Button>Save Preferences</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Language Tab */}
        <TabsContent value="language" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Language</CardTitle>
              <CardDescription>Choose your preferred language</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Select Language</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 border rounded-md p-3 cursor-pointer bg-accent">
                    <Globe className="h-5 w-5" />
                    <span>English</span>
                  </div>
                  <div className="flex items-center gap-2 border rounded-md p-3 cursor-pointer">
                    <Globe className="h-5 w-5" />
                    <span>French</span>
                  </div>
                  <div className="flex items-center gap-2 border rounded-md p-3 cursor-pointer">
                    <Globe className="h-5 w-5" />
                    <span>Spanish</span>
                  </div>
                  <div className="flex items-center gap-2 border rounded-md p-3 cursor-pointer">
                    <Globe className="h-5 w-5" />
                    <span>Yoruba</span>
                  </div>
                  <div className="flex items-center gap-2 border rounded-md p-3 cursor-pointer">
                    <Globe className="h-5 w-5" />
                    <span>Hausa</span>
                  </div>
                  <div className="flex items-center gap-2 border rounded-md p-3 cursor-pointer">
                    <Globe className="h-5 w-5" />
                    <span>Igbo</span>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Button>Save Preferences</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
