import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Plus, Check, AlertCircle, RefreshCw, Info } from "lucide-react";
import StatusBadge from "@/components/common/StatusBadge";
import { useEngagementSourcesContext } from "@/contexts/EngagementSourcesContext";
import ConnectionStatusIndicator from "@/components/common/ConnectionStatusIndicator";
import { Alert, AlertDescription } from "@/components/ui/alert";

/**
 * RecordingTabContent component renders the recording applications tab content
 */
const RecordingTabContent = () => {
  const {
    sourceStatus,
    recordingSettings,
    handleRecordingSettingChange,
    handleConnect,
    sourceErrors,
    sourceHealth,
  } = useEngagementSourcesContext();

  const status = sourceStatus.recording;
  const settings = recordingSettings;
  const errorMessage = sourceErrors?.recording;
  const healthStatus = sourceHealth?.recording;

  return (
    <div className="space-y-4 mt-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Recording Applications</h3>
        <ConnectionStatusIndicator
          status={status}
          healthStatus={healthStatus}
          errorMessage={errorMessage}
        />
      </div>

      {status === "error" && errorMessage && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="ml-2">
            {errorMessage}
            {sourceErrors?.recording &&
              sourceErrors.recording.includes("Missing required fields") && (
                <p className="text-sm mt-1 font-normal">
                  Please fill in all required fields marked with *
                </p>
              )}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="recording-app" className="flex items-center">
              Recording Application <span className="text-red-500 ml-1">*</span>
              {status === "error" &&
                sourceErrors?.recording &&
                sourceErrors.recording.includes("application") && (
                  <span className="ml-1 text-red-500">
                    <AlertCircle className="h-3 w-3 inline" />
                  </span>
                )}
            </Label>
            <Input
              id="recording-app"
              placeholder="e.g., Zoom, Google Meet, Gong"
              value={settings.application}
              onChange={(e) =>
                handleRecordingSettingChange("application", e.target.value)
              }
              className={
                status === "error" &&
                sourceErrors?.recording &&
                sourceErrors.recording.includes("application")
                  ? "border-red-500"
                  : ""
              }
            />
            {status === "error" &&
              sourceErrors?.recording &&
              sourceErrors.recording.includes(
                "Unsupported recording application",
              ) && (
                <p className="text-xs text-red-500 mt-1">
                  Supported applications: Zoom, Google Meet, Microsoft Teams,
                  Gong
                </p>
              )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="recording-account" className="flex items-center">
              Account ID <span className="text-red-500 ml-1">*</span>
              {status === "error" &&
                sourceErrors?.recording &&
                sourceErrors.recording.includes("accountId") && (
                  <span className="ml-1 text-red-500">
                    <AlertCircle className="h-3 w-3 inline" />
                  </span>
                )}
            </Label>
            <Input
              id="recording-account"
              placeholder="Enter account ID"
              value={settings.accountId}
              onChange={(e) =>
                handleRecordingSettingChange("accountId", e.target.value)
              }
              className={
                status === "error" &&
                sourceErrors?.recording &&
                sourceErrors.recording.includes("accountId")
                  ? "border-red-500"
                  : ""
              }
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="recording-api-key" className="flex items-center">
              API Key <span className="text-red-500 ml-1">*</span>
              {status === "error" &&
                sourceErrors?.recording &&
                sourceErrors.recording.includes("apiKey") && (
                  <span className="ml-1 text-red-500">
                    <AlertCircle className="h-3 w-3 inline" />
                  </span>
                )}
            </Label>
            <Input
              id="recording-api-key"
              type="password"
              placeholder="Enter API key"
              value={settings.apiKey}
              onChange={(e) =>
                handleRecordingSettingChange("apiKey", e.target.value)
              }
              className={
                status === "error" &&
                sourceErrors?.recording &&
                sourceErrors.recording.includes("apiKey")
                  ? "border-red-500"
                  : ""
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="recording-webhook" className="flex items-center">
              Webhook URL <span className="text-red-500 ml-1">*</span>
              {status === "error" &&
                sourceErrors?.recording &&
                sourceErrors.recording.includes("webhook") && (
                  <span className="ml-1 text-red-500">
                    <AlertCircle className="h-3 w-3 inline" />
                  </span>
                )}
            </Label>
            <Input
              id="recording-webhook"
              placeholder="https://your-webhook-endpoint.com"
              value={settings.webhook}
              onChange={(e) =>
                handleRecordingSettingChange("webhook", e.target.value)
              }
              className={
                status === "error" &&
                sourceErrors?.recording &&
                sourceErrors.recording.includes("webhook")
                  ? "border-red-500"
                  : ""
              }
            />
            {status === "error" &&
              sourceErrors?.recording &&
              sourceErrors.recording.includes("Invalid webhook URL") && (
                <p className="text-xs text-red-500 mt-1">
                  Please enter a valid HTTPS URL
                </p>
              )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="recording-format" className="flex items-center">
            Preferred Format <span className="text-red-500 ml-1">*</span>
            {status === "error" &&
              sourceErrors?.recording &&
              sourceErrors.recording.includes("format") && (
                <span className="ml-1 text-red-500">
                  <AlertCircle className="h-3 w-3 inline" />
                </span>
              )}
          </Label>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              className={`justify-start ${settings.format === "audio" ? "border-primary" : ""} ${status === "error" && sourceErrors?.recording && sourceErrors.recording.includes("format") ? "border-red-500" : ""}`}
              onClick={() => handleRecordingSettingChange("format", "audio")}
            >
              <input
                type="radio"
                id="format-audio"
                name="format"
                className="mr-2"
                checked={settings.format === "audio"}
                onChange={() => {}}
              />
              Audio Only
            </Button>
            <Button
              variant="outline"
              className={`justify-start ${settings.format === "video" ? "border-primary" : ""} ${status === "error" && sourceErrors?.recording && sourceErrors.recording.includes("format") ? "border-red-500" : ""}`}
              onClick={() => handleRecordingSettingChange("format", "video")}
            >
              <input
                type="radio"
                id="format-video"
                name="format"
                className="mr-2"
                checked={settings.format === "video"}
                onChange={() => {}}
              />
              Audio + Video
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Switch
              id="auto-transcribe"
              checked={settings.autoTranscribe}
              onCheckedChange={(checked) =>
                handleRecordingSettingChange("autoTranscribe", checked)
              }
            />
            <Label htmlFor="auto-transcribe">
              Automatically transcribe recordings
            </Label>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Switch
              id="auto-analyze"
              checked={settings.autoAnalyze}
              onCheckedChange={(checked) =>
                handleRecordingSettingChange("autoAnalyze", checked)
              }
            />
            <Label htmlFor="auto-analyze">
              Automatically analyze conversations for insights
            </Label>
          </div>
        </div>

        <Button
          onClick={() => handleConnect("recording")}
          disabled={status === "connecting"}
          className="w-full"
        >
          {status === "connecting" ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Connecting...
            </>
          ) : status === "connected" ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              Connected
            </>
          ) : status === "error" ? (
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
    </div>
  );
};

export default RecordingTabContent;
