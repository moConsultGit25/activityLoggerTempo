import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Plus, Check, AlertCircle, RefreshCw } from "lucide-react";
import StatusBadge from "@/components/common/StatusBadge";
import { useEngagementSourcesContext } from "@/contexts/EngagementSourcesContext";

/**
 * PhoneTabContent component renders the phone integration tab content
 */
const PhoneTabContent = () => {
  const {
    sourceStatus,
    phoneSettings,
    handlePhoneSettingChange,
    handleConnect,
  } = useEngagementSourcesContext();

  const status = sourceStatus.phone;
  const settings = phoneSettings;
  return (
    <div className="space-y-4 mt-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Phone System Integration</h3>
        <StatusBadge status={status} />
      </div>

      <div className="grid gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="phone-provider">Provider</Label>
            <Input
              id="phone-provider"
              placeholder="e.g., Twilio, Vonage"
              value={settings.provider}
              onChange={(e) =>
                handlePhoneSettingChange("provider", e.target.value)
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone-api-key">API Key</Label>
            <Input
              id="phone-api-key"
              type="password"
              placeholder="Enter API key"
              value={settings.apiKey}
              onChange={(e) =>
                handlePhoneSettingChange("apiKey", e.target.value)
              }
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Switch
              id="auto-log-calls"
              checked={settings.autoLogCalls}
              onCheckedChange={(checked) =>
                handlePhoneSettingChange("autoLogCalls", checked)
              }
            />
            <Label htmlFor="auto-log-calls">Automatically log all calls</Label>
          </div>
        </div>

        <Button
          onClick={() => handleConnect("phone")}
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
              Connect Phone System
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default PhoneTabContent;
