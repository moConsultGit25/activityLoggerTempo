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
 * PhoneTabContent component renders the phone integration tab content
 */
const PhoneTabContent = () => {
  const {
    sourceStatus,
    phoneSettings,
    handlePhoneSettingChange,
    handleConnect,
    sourceErrors,
    sourceHealth,
  } = useEngagementSourcesContext();

  const status = sourceStatus.phone;
  const settings = phoneSettings;
  const errorMessage =
    sourceStatus.phone === "error" ? sourceErrors?.phone : null;
  const healthStatus = sourceHealth?.phone;

  return (
    <div className="space-y-4 mt-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Phone System Integration</h3>
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
            {sourceErrors.phone &&
              sourceErrors.phone.includes("Missing required fields") && (
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
            <Label htmlFor="phone-provider" className="flex items-center">
              Provider <span className="text-red-500 ml-1">*</span>
              {status === "error" &&
                sourceErrors.phone &&
                sourceErrors.phone.includes("provider") && (
                  <span className="ml-1 text-red-500">
                    <AlertCircle className="h-3 w-3 inline" />
                  </span>
                )}
            </Label>
            <Input
              id="phone-provider"
              placeholder="e.g., Twilio, Vonage"
              value={settings.provider}
              onChange={(e) =>
                handlePhoneSettingChange("provider", e.target.value)
              }
              className={
                status === "error" &&
                sourceErrors.phone &&
                sourceErrors.phone.includes("provider")
                  ? "border-red-500"
                  : ""
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone-api-key" className="flex items-center">
              API Key <span className="text-red-500 ml-1">*</span>
              {status === "error" &&
                sourceErrors.phone &&
                sourceErrors.phone.includes("apiKey") && (
                  <span className="ml-1 text-red-500">
                    <AlertCircle className="h-3 w-3 inline" />
                  </span>
                )}
            </Label>
            <Input
              id="phone-api-key"
              type="password"
              placeholder="Enter API key"
              value={settings.apiKey}
              onChange={(e) =>
                handlePhoneSettingChange("apiKey", e.target.value)
              }
              className={
                status === "error" &&
                sourceErrors.phone &&
                sourceErrors.phone.includes("apiKey")
                  ? "border-red-500"
                  : ""
              }
            />
            {status === "error" &&
              sourceErrors.phone &&
              sourceErrors.phone.includes("API key appears to be invalid") && (
                <p className="text-xs text-red-500 mt-1">
                  API key is too short or invalid
                </p>
              )}
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
