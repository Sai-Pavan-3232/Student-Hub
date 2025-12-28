import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { UserAvatar } from "@/components/UserAvatar";
import { useTheme } from "@/components/ThemeProvider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { Bell, Shield, Eye, Moon, Sun, Monitor } from "lucide-react";

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    forumReplies: true,
    eventReminders: true,
  });
  const [privacy, setPrivacy] = useState({
    showOnline: false,
    allowMessages: true,
    showInDiscover: true,
  });

  return (
    <div className="p-4 md:p-6 pb-20 md:pb-6 max-w-3xl" data-testid="page-settings">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account and preferences</p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Profile</CardTitle>
            <CardDescription>Manage your anonymous identity</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <UserAvatar size="lg" isAnonymous />
              <div>
                <p className="font-medium">Anonymous Student</p>
                <p className="text-sm text-muted-foreground">Your identity is protected</p>
              </div>
            </div>
            <Separator />
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="display-name">Display Name</Label>
                <Input
                  id="display-name"
                  placeholder="Anonymous Student"
                  defaultValue="Anonymous Student"
                  data-testid="input-display-name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="year">Academic Year</Label>
                <Select defaultValue="freshman">
                  <SelectTrigger data-testid="select-year">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="freshman">Freshman</SelectItem>
                    <SelectItem value="sophomore">Sophomore</SelectItem>
                    <SelectItem value="junior">Junior</SelectItem>
                    <SelectItem value="senior">Senior</SelectItem>
                    <SelectItem value="graduate">Graduate</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="interests">Interests</Label>
                <Input
                  id="interests"
                  placeholder="e.g., Computer Science, Music, Sports"
                  data-testid="input-interests"
                />
              </div>
            </div>
            <Button data-testid="button-save-profile">Save Changes</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Appearance
            </CardTitle>
            <CardDescription>Customize how the app looks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Theme</Label>
                <p className="text-sm text-muted-foreground">Select your preferred theme</p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={theme === "light" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setTheme("light")}
                  data-testid="button-theme-light"
                >
                  <Sun className="h-4 w-4" />
                </Button>
                <Button
                  variant={theme === "dark" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setTheme("dark")}
                  data-testid="button-theme-dark"
                >
                  <Moon className="h-4 w-4" />
                </Button>
                <Button
                  variant={theme === "system" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setTheme("system")}
                  data-testid="button-theme-system"
                >
                  <Monitor className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
            <CardDescription>Choose what you want to be notified about</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive notifications via email</p>
              </div>
              <Switch
                checked={notifications.email}
                onCheckedChange={(checked) =>
                  setNotifications({ ...notifications, email: checked })
                }
                data-testid="switch-email-notifications"
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Push Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive push notifications in browser</p>
              </div>
              <Switch
                checked={notifications.push}
                onCheckedChange={(checked) =>
                  setNotifications({ ...notifications, push: checked })
                }
                data-testid="switch-push-notifications"
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Forum Replies</Label>
                <p className="text-sm text-muted-foreground">Get notified when someone replies</p>
              </div>
              <Switch
                checked={notifications.forumReplies}
                onCheckedChange={(checked) =>
                  setNotifications({ ...notifications, forumReplies: checked })
                }
                data-testid="switch-forum-replies"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Event Reminders</Label>
                <p className="text-sm text-muted-foreground">Get reminders for upcoming events</p>
              </div>
              <Switch
                checked={notifications.eventReminders}
                onCheckedChange={(checked) =>
                  setNotifications({ ...notifications, eventReminders: checked })
                }
                data-testid="switch-event-reminders"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Privacy
            </CardTitle>
            <CardDescription>Control your privacy settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Show Online Status</Label>
                <p className="text-sm text-muted-foreground">Let others see when you're online</p>
              </div>
              <Switch
                checked={privacy.showOnline}
                onCheckedChange={(checked) =>
                  setPrivacy({ ...privacy, showOnline: checked })
                }
                data-testid="switch-show-online"
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Allow Messages</Label>
                <p className="text-sm text-muted-foreground">Allow other students to message you</p>
              </div>
              <Switch
                checked={privacy.allowMessages}
                onCheckedChange={(checked) =>
                  setPrivacy({ ...privacy, allowMessages: checked })
                }
                data-testid="switch-allow-messages"
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Appear in Discover</Label>
                <p className="text-sm text-muted-foreground">Show your profile in student discovery</p>
              </div>
              <Switch
                checked={privacy.showInDiscover}
                onCheckedChange={(checked) =>
                  setPrivacy({ ...privacy, showInDiscover: checked })
                }
                data-testid="switch-show-discover"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
