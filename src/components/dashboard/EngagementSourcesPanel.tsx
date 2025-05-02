/**
 * EngagementSourcesPanel Component
 *
 * This component is part of the Customer Engagement Analyzer dashboard and implements
 * the "Automated Engagement Entry" feature from the PRD. It allows users to connect
 * various engagement sources (phone, email, social, recording) to enable automated
 * interaction capture.
 *
 * Following DDD principles and the Compound Component pattern, this component now uses
 * a context to manage state and reduce prop drilling.
 */

import React from "react";
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
import { Phone, Mail, MessageSquare, Mic } from "lucide-react";
import PhoneTabContent from "./tabs/PhoneTabContent";
import EmailTabContent from "./tabs/EmailTabContent";
import SocialTabContent from "./tabs/SocialTabContent";
import RecordingTabContent from "./tabs/RecordingTabContent";

/**
 * EngagementSourcesPanel component renders a tabbed interface for configuring
 * different engagement sources (phone, email, social media, recording apps)
 *
 * It now uses the EngagementSourcesContext to access state and handlers,
 * eliminating prop drilling and improving component composition.
 */
const EngagementSourcesPanel = () => {
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
          {/* Source type tabs */}
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
          <TabsContent value="phone">
            <PhoneTabContent />
          </TabsContent>

          {/* Email Integration Tab */}
          <TabsContent value="email">
            <EmailTabContent />
          </TabsContent>

          {/* Social Integration Tab */}
          <TabsContent value="social">
            <SocialTabContent />
          </TabsContent>

          {/* Recording Integration Tab */}
          <TabsContent value="recording">
            <RecordingTabContent />
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
