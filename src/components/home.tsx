import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Bell, Settings, LogOut } from "lucide-react";
import EngagementSummaryPanelWrapper from "./dashboard/EngagementSummaryPanelWrapper";
import TranscriptViewerWrapper from "./dashboard/TranscriptViewerWrapper";
import DataExportPanelWrapper from "./dashboard/DataExportPanelWrapper";
import AnalyticsOverviewWrapper from "./dashboard/AnalyticsOverviewWrapper";
import EngagementSourcesPanel from "./dashboard/EngagementSourcesPanel";
import EngagementSourcesPanelWrapper from "./dashboard/EngagementSourcesPanelWrapper";
import { EngagementSourcesProvider } from "@/contexts/EngagementSourcesContext";
import { useEngagementSources } from "@/hooks/useEngagementSources";
import { EngagementSourceApiAdapter } from "@/infrastructure/api/EngagementSourceApiAdapter";

const Home = () => {
  // Initialize the engagement sources hook with the API adapter
  const sourceRepository = new EngagementSourceApiAdapter();
  const {
    sourceStatus,
    sourceErrors,
    sourceHealth,
    phoneSettings,
    emailSettings,
    socialSettings,
    recordingSettings,
    handleConnect,
    handleDisconnect,
    handleCheckHealth,
    handlePhoneSettingChange,
    handleEmailSettingChange,
    handleSocialSettingChange,
    handleRecordingSettingChange,
  } = useEngagementSources(sourceRepository);

  return (
    <EngagementSourcesProvider
      sourceStatus={sourceStatus}
      sourceErrors={sourceErrors}
      sourceHealth={sourceHealth}
      phoneSettings={phoneSettings}
      emailSettings={emailSettings}
      socialSettings={socialSettings}
      recordingSettings={recordingSettings}
      handleConnect={handleConnect}
      handleDisconnect={handleDisconnect}
      handleCheckHealth={handleCheckHealth}
      handlePhoneSettingChange={handlePhoneSettingChange}
      handleEmailSettingChange={handleEmailSettingChange}
      handleSocialSettingChange={handleSocialSettingChange}
      handleRecordingSettingChange={handleRecordingSettingChange}
    >
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b sticky top-0 z-10 bg-background">
          <div className="container flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold">
                Customer Engagement Analyzer
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
              <div className="flex items-center gap-2">
                <Avatar>
                  <AvatarImage
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=user123"
                    alt="User"
                  />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div className="hidden md:block">
                  <p className="text-sm font-medium">John Doe</p>
                  <p className="text-xs text-muted-foreground">Sales Manager</p>
                </div>
                <Button variant="ghost" size="icon">
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container py-6">
          <Tabs defaultValue="summary" className="space-y-6">
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="summary">Engagement Summary</TabsTrigger>
                <TabsTrigger value="sources">Engagement Sources</TabsTrigger>
                <TabsTrigger value="transcripts">Transcripts</TabsTrigger>
                <TabsTrigger value="export">Data Export</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  Refresh Data
                </Button>
                <Button size="sm">New Interaction</Button>
              </div>
            </div>

            {/* Engagement Summary Panel */}
            <TabsContent value="summary" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Interactions</CardTitle>
                </CardHeader>
                <CardContent>
                  <EngagementSummaryPanelWrapper />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Engagement Sources Panel */}
            <TabsContent value="sources" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Configure Engagement Sources</CardTitle>
                </CardHeader>
                <CardContent>
                  <EngagementSourcesPanel />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Transcript Viewer */}
            <TabsContent value="transcripts" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Conversation Transcripts</CardTitle>
                </CardHeader>
                <CardContent>
                  <TranscriptViewerWrapper />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Data Export Controls */}
            <TabsContent value="export" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>CRM Integration & Data Export</CardTitle>
                </CardHeader>
                <CardContent>
                  <DataExportPanelWrapper />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Analytics Overview */}
            <TabsContent value="analytics" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Engagement Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <AnalyticsOverviewWrapper />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>

        {/* Footer */}
        <footer className="border-t py-4">
          <div className="container flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Customer Engagement Analyzer.
              All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <Button variant="link" size="sm" className="text-xs">
                Privacy Policy
              </Button>
              <Button variant="link" size="sm" className="text-xs">
                Terms of Service
              </Button>
              <Button variant="link" size="sm" className="text-xs">
                Help Center
              </Button>
            </div>
          </div>
        </footer>
      </div>
    </EngagementSourcesProvider>
  );
};

export default Home;
