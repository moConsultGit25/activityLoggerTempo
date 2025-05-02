import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Plus, Check, AlertCircle, RefreshCw } from "lucide-react";
import StatusBadge from "@/components/common/StatusBadge";
import { useEngagementSourcesContext } from "@/contexts/EngagementSourcesContext";

/**
 * RecordingTabContent component renders the recording applications tab content
 */
const RecordingTabContent = () => {
  const {
    sourceStatus,
    recordingSettings,
    handleRecordingSettingChange,
    handleConnect,
  } = useEngagementSourcesContext();

  const status = sourceStatus.recording;
  const settings = recordingSettings;
  return (
    <div className="space-y-4 mt-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Recording Applications</h3>
        <StatusBadge status={status} />
      </div>

      <div className="grid gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="recording-app">Recording Application</Label>
            <Input
              id="recording-app"
              placeholder="e.g., Zoom, Google Meet, Gong"
              value={settings.application}
              onChange={(e) =>
                handleRecordingSettingChange("application", e.target.value)
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="recording-account">Account ID</Label>
            <Input
              id="recording-account"
              placeholder="Enter account ID"
              value={settings.accountId}
              onChange={(e) =>
                handleRecordingSettingChange("accountId", e.target.value)
              }
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
              value={settings.apiKey}
              onChange={(e) =>
                handleRecordingSettingChange("apiKey", e.target.value)
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="recording-webhook">Webhook URL</Label>
            <Input
              id="recording-webhook"
              placeholder="https://your-webhook-endpoint.com"
              value={settings.webhook}
              onChange={(e) =>
                handleRecordingSettingChange("webhook", e.target.value)
              }
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="recording-format">Preferred Format</Label>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              className={`justify-start ${settings.format === "audio" ? "border-primary" : ""}`}
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
              className={`justify-start ${settings.format === "video" ? "border-primary" : ""}`}
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
