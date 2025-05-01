import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Phone,
  Mail,
  MessageSquare,
  Mic,
  Plus,
  Check,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

interface EngagementSourcesPanelProps {
  // Props can be added as needed
}

const EngagementSourcesPanel = ({}: EngagementSourcesPanelProps) => {
  // State for tracking connection status of different sources
  const [sourceStatus, setSourceStatus] = useState({
    phone: "disconnected", // disconnected, connecting, connected, error
    email: "disconnected",
    social: "disconnected",
    recording: "disconnected",
  });

  // Function to handle connection attempt
  const handleConnect = (sourceType: keyof typeof sourceStatus) => {
    setSourceStatus((prev) => ({
      ...prev,
      [sourceType]: "connecting",
    }));

    // Simulate connection process
    setTimeout(() => {
      setSourceStatus((prev) => ({
        ...prev,
        [sourceType]: Math.random() > 0.2 ? "connected" : "error",
      }));
    }, 1500);
  };

  // Function to get status badge based on connection state
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "connected":
        return <Badge className="bg-green-500">Connected</Badge>;
      case "connecting":
        return <Badge className="bg-blue-500">Connecting...</Badge>;
      case "error":
        return <Badge className="bg-red-500">Connection Error</Badge>;
      default:
        return <Badge variant="outline">Disconnected</Badge>;
    }
  };

  return (
    <Card className="w-full bg-white shadow-md">
      <CardHeader>
        <CardTitle>Engagement Sources</CardTitle>
        <CardDescription>
          Connect your engagement sources to enable automated interaction
          capture
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="phone" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="phone" className="flex items-center gap-2">
              <Phone className="h-4 w-4" /> Phone
            </TabsTrigger>
            <TabsTrigger value="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" /> Email
            </TabsTrigger>
            <TabsTrigger value="social" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" /> Social
            </TabsTrigger>
            <TabsTrigger value="recording" className="flex items-center gap-2">
              <Mic className="h-4 w-4" /> Recording
            </TabsTrigger>
          </TabsList>

          {/* Phone Integration Tab */}
          <TabsContent value="phone" className="space-y-4 mt-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Phone System Integration</h3>
              {getStatusBadge(sourceStatus.phone)}
            </div>

            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone-provider">Provider</Label>
                  <Input
                    id="phone-provider"
                    placeholder="e.g., Twilio, Vonage"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone-api-key">API Key</Label>
                  <Input
                    id="phone-api-key"
                    type="password"
                    placeholder="Enter API key"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Switch id="auto-log-calls" />
                  <Label htmlFor="auto-log-calls">
                    Automatically log all calls
                  </Label>
                </div>
              </div>

              <Button
                onClick={() => handleConnect("phone")}
                disabled={sourceStatus.phone === "connecting"}
                className="w-full"
              >
                {sourceStatus.phone === "connecting" ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Connecting...
                  </>
                ) : sourceStatus.phone === "connected" ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Connected
                  </>
                ) : sourceStatus.phone === "error" ? (
                  <>
                    <AlertCircle className="mr-2 h-4 w-4" />
                    Retry Connection
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Connect Phone System
                  </>
                )}
              </Button>
            </div>
          </TabsContent>

          {/* Email Integration Tab */}
          <TabsContent value="email" className="space-y-4 mt-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Email Integration</h3>
              {getStatusBadge(sourceStatus.email)}
            </div>

            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email-provider">Email Provider</Label>
                  <Input
                    id="email-provider"
                    placeholder="e.g., Gmail, Outlook"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email-account">Email Account</Label>
                  <Input
                    id="email-account"
                    type="email"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Switch id="auto-log-emails" />
                  <Label htmlFor="auto-log-emails">
                    Automatically log all emails
                  </Label>
                </div>
              </div>

              <Button
                onClick={() => handleConnect("email")}
                disabled={sourceStatus.email === "connecting"}
                className="w-full"
              >
                {sourceStatus.email === "connecting" ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Connecting...
                  </>
                ) : sourceStatus.email === "connected" ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Connected
                  </>
                ) : sourceStatus.email === "error" ? (
                  <>
                    <AlertCircle className="mr-2 h-4 w-4" />
                    Retry Connection
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Connect Email
                  </>
                )}
              </Button>
            </div>
          </TabsContent>

          {/* Social Integration Tab */}
          <TabsContent value="social" className="space-y-4 mt-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Social Media Integration</h3>
              {getStatusBadge(sourceStatus.social)}
            </div>

            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="social-platform">Platform</Label>
                  <Input
                    id="social-platform"
                    placeholder="e.g., Twitter, LinkedIn, Facebook"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="social-account">Account Name/Handle</Label>
                  <Input id="social-account" placeholder="e.g., @yourcompany" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="social-api-key">API Key</Label>
                  <Input
                    id="social-api-key"
                    type="password"
                    placeholder="Enter API key"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="social-api-secret">API Secret</Label>
                  <Input
                    id="social-api-secret"
                    type="password"
                    placeholder="Enter API secret"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Switch id="auto-log-social" />
                  <Label htmlFor="auto-log-social">
                    Automatically log all social media interactions
                  </Label>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Switch id="auto-respond-social" />
                  <Label htmlFor="auto-respond-social">
                    Enable automated response suggestions
                  </Label>
                </div>
              </div>

              <Button
                onClick={() => handleConnect("social")}
                disabled={sourceStatus.social === "connecting"}
                className="w-full"
              >
                {sourceStatus.social === "connecting" ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Connecting...
                  </>
                ) : sourceStatus.social === "connected" ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Connected
                  </>
                ) : sourceStatus.social === "error" ? (
                  <>
                    <AlertCircle className="mr-2 h-4 w-4" />
                    Retry Connection
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Connect Social Accounts
                  </>
                )}
              </Button>
            </div>
          </TabsContent>

          {/* Recording Integration Tab */}
          <TabsContent value="recording" className="space-y-4 mt-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Recording Applications</h3>
              {getStatusBadge(sourceStatus.recording)}
            </div>

            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="recording-app">Recording Application</Label>
                  <Input
                    id="recording-app"
                    placeholder="e.g., Zoom, Google Meet, Gong"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="recording-account">Account ID</Label>
                  <Input
                    id="recording-account"
                    placeholder="Enter account ID"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="recording-api-key">API Key</Label>
                  <Input
                    id="recording-api-key"
                    type="password"
                    placeholder="Enter API key"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="recording-webhook">Webhook URL</Label>
                  <Input
                    id="recording-webhook"
                    placeholder="https://your-webhook-endpoint.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="recording-format">Preferred Format</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" className="justify-start">
                    <input
                      type="radio"
                      id="format-audio"
                      name="format"
                      className="mr-2"
                    />
                    Audio Only
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <input
                      type="radio"
                      id="format-video"
                      name="format"
                      className="mr-2"
                    />
                    Audio + Video
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Switch id="auto-transcribe" />
                  <Label htmlFor="auto-transcribe">
                    Automatically transcribe recordings
                  </Label>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Switch id="auto-analyze" />
                  <Label htmlFor="auto-analyze">
                    Automatically analyze conversations for insights
                  </Label>
                </div>
              </div>

              <Button
                onClick={() => handleConnect("recording")}
                disabled={sourceStatus.recording === "connecting"}
                className="w-full"
              >
                {sourceStatus.recording === "connecting" ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Connecting...
                  </>
                ) : sourceStatus.recording === "connected" ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Connected
                  </>
                ) : sourceStatus.recording === "error" ? (
                  <>
                    <AlertCircle className="mr-2 h-4 w-4" />
                    Retry Connection
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Connect Recording Apps
                  </>
                )}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <p className="text-sm text-muted-foreground">
          Connected sources will automatically log interactions to your
          dashboard
        </p>
        <Button variant="outline" size="sm">
          View Connection Settings
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EngagementSourcesPanel;
