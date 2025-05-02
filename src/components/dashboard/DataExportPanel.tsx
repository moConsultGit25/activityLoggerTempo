import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowUpDown, Check, Clock, RefreshCw, Settings } from "lucide-react";

import { ProcessingStatus } from "@/domain/engagement/interfaces";

interface DataExportPanelProps {
  lastSyncTime?: string;
  syncStatus?: ProcessingStatus;
  selectedCrm?: string;
  onCrmChange?: (crm: string) => void;
  onSyncClick?: () => void;
  progress?: number;
}

const DataExportPanel = ({
  lastSyncTime = "Never",
  syncStatus = "idle",
  selectedCrm = "salesforce",
  onCrmChange,
  onSyncClick,
  progress = 0,
}: DataExportPanelProps) => {
  const [crm, setCrm] = useState(selectedCrm);
  const [status, setStatus] = useState(syncStatus);

  // Update local state when props change
  useEffect(() => {
    setStatus(syncStatus);
  }, [syncStatus]);

  useEffect(() => {
    setCrm(selectedCrm);
  }, [selectedCrm]);

  const handleCrmChange = (value: string) => {
    setCrm(value);
    if (onCrmChange) {
      onCrmChange(value);
    }
  };

  const handleSync = () => {
    if (onSyncClick) {
      onSyncClick();
    } else {
      // Fallback to the original simulation if no onSyncClick is provided
      setStatus("processing");

      // Simulate processing and then syncing to CRM
      // First phase (0-50%): Processing data internally
      // Second phase (50-100%): Syncing processed data to CRM
      let currentProgress = 0;
      const interval = setInterval(() => {
        currentProgress += 5;

        if (currentProgress >= 50 && currentProgress < 51) {
          // At 50%, we've completed internal processing and start CRM sync
          console.log("Internal processing complete, starting CRM sync");
          setStatus("syncing");
        }

        if (currentProgress >= 100) {
          clearInterval(interval);
          setStatus("completed");
          currentProgress = 100;
        }
      }, 300);
    }
  };

  const getStatusBadge = () => {
    switch (status) {
      case "syncing":
        return <Badge className="bg-blue-500">Syncing</Badge>;
      case "completed":
        return <Badge className="bg-green-500">Completed</Badge>;
      case "failed":
        return <Badge className="bg-red-500">Failed</Badge>;
      default:
        return <Badge variant="outline">Idle</Badge>;
    }
  };

  return (
    <Card className="w-full bg-white shadow-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Data Export Controls</CardTitle>
            <CardDescription>
              Sync your processed interaction data with CRM systems
            </CardDescription>
          </div>
          {getStatusBadge()}
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={crm} onValueChange={handleCrmChange}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="salesforce">Salesforce</TabsTrigger>
            <TabsTrigger value="hubspot">HubSpot</TabsTrigger>
          </TabsList>

          <TabsContent value="salesforce" className="space-y-4 mt-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Salesforce Configuration</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-muted-foreground">
                    Instance URL
                  </label>
                  <div className="flex items-center border rounded-md px-3 py-2 text-sm">
                    https://company.salesforce.com
                  </div>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">
                    API Version
                  </label>
                  <Select defaultValue="v58.0">
                    <SelectTrigger>
                      <SelectValue placeholder="Select API version" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="v58.0">v58.0 (Latest)</SelectItem>
                      <SelectItem value="v57.0">v57.0</SelectItem>
                      <SelectItem value="v56.0">v56.0</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium">Data Mapping</h3>
              <div className="flex items-center justify-between border rounded-md px-3 py-2">
                <span className="text-sm">
                  Map interactions to Activity History
                </span>
                <Button variant="ghost" size="sm">
                  <Settings className="h-4 w-4 mr-1" /> Configure
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="hubspot" className="space-y-4 mt-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">HubSpot Configuration</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-muted-foreground">
                    Portal ID
                  </label>
                  <div className="flex items-center border rounded-md px-3 py-2 text-sm">
                    12345678
                  </div>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">
                    Integration Type
                  </label>
                  <Select defaultValue="api">
                    <SelectTrigger>
                      <SelectValue placeholder="Select integration type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="api">API Integration</SelectItem>
                      <SelectItem value="app">App Integration</SelectItem>
                      <SelectItem value="webhook">Webhook</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium">Data Mapping</h3>
              <div className="flex items-center justify-between border rounded-md px-3 py-2">
                <span className="text-sm">Map interactions to Engagements</span>
                <Button variant="ghost" size="sm">
                  <Settings className="h-4 w-4 mr-1" /> Configure
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {status === "syncing" && (
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                {progress < 50 ? "Processing data..." : "Syncing to CRM..."}
              </span>
              <span className="text-sm">{progress}%</span>
            </div>
            <Progress value={progress} />
            <div className="text-xs text-muted-foreground">
              {progress < 50
                ? "Analyzing and preparing data for export"
                : "Pushing processed data to CRM system"}
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-between border-t pt-4">
        <div className="flex items-center text-sm text-muted-foreground">
          <Clock className="h-4 w-4 mr-1" />
          Last sync: {lastSyncTime}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled={status === "syncing"}>
            <ArrowUpDown className="h-4 w-4 mr-1" /> View History
          </Button>
          <Button
            onClick={handleSync}
            disabled={status === "syncing"}
            className="flex items-center"
          >
            {status === "syncing" ? (
              <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
            ) : status === "completed" ? (
              <Check className="h-4 w-4 mr-1" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-1" />
            )}
            {status === "syncing"
              ? "Processing & Syncing..."
              : "Process & Sync"}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default DataExportPanel;
