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
 * EmailTabContent component renders the email integration tab content
 */
const EmailTabContent = () => {
  const {
    sourceStatus,
    emailSettings,
    handleEmailSettingChange,
    handleConnect,
    sourceErrors,
    sourceHealth,
  } = useEngagementSourcesContext();

  const status = sourceStatus.email;
  const settings = emailSettings;
  const errorMessage =
    sourceStatus.email === "error" ? sourceErrors?.email : null;
  const healthStatus = sourceHealth?.email;

  return (
    <div className="space-y-4 mt-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Email Integration</h3>
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
            {sourceErrors.email &&
              sourceErrors.email.includes("Missing required fields") && (
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
            <Label htmlFor="email-provider" className="flex items-center">
              Email Provider <span className="text-red-500 ml-1">*</span>
              {status === "error" &&
                sourceErrors.email &&
                sourceErrors.email.includes("provider") && (
                  <span className="ml-1 text-red-500">
                    <AlertCircle className="h-3 w-3 inline" />
                  </span>
                )}
            </Label>
            <Input
              id="email-provider"
              placeholder="e.g., Gmail, Outlook"
              value={settings.provider}
              onChange={(e) =>
                handleEmailSettingChange("provider", e.target.value)
              }
              className={
                status === "error" &&
                sourceErrors.email &&
                sourceErrors.email.includes("provider")
                  ? "border-red-500"
                  : ""
              }
            />
            {status === "error" &&
              sourceErrors.email &&
              sourceErrors.email.includes("Unsupported email provider") && (
                <p className="text-xs text-red-500 mt-1">
                  Supported providers: Gmail, Outlook, Yahoo, etc.
                </p>
              )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email-account" className="flex items-center">
              Email Account <span className="text-red-500 ml-1">*</span>
              {status === "error" &&
                sourceErrors.email &&
                sourceErrors.email.includes("account") && (
                  <span className="ml-1 text-red-500">
                    <AlertCircle className="h-3 w-3 inline" />
                  </span>
                )}
            </Label>
            <Input
              id="email-account"
              type="email"
              placeholder="your@email.com"
              value={settings.account}
              onChange={(e) =>
                handleEmailSettingChange("account", e.target.value)
              }
              className={
                status === "error" &&
                sourceErrors.email &&
                sourceErrors.email.includes("account")
                  ? "border-red-500"
                  : ""
              }
            />
            {status === "error" &&
              sourceErrors.email &&
              sourceErrors.email.includes("Invalid email format") && (
                <p className="text-xs text-red-500 mt-1">
                  Please enter a valid email address
                </p>
              )}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Switch
              id="auto-log-emails"
              checked={settings.autoLogEmails}
              onCheckedChange={(checked) =>
                handleEmailSettingChange("autoLogEmails", checked)
              }
            />
            <Label htmlFor="auto-log-emails">
              Automatically log all emails
            </Label>
          </div>
        </div>

        <Button
          onClick={() => handleConnect("email")}
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
              Connect Email
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default EmailTabContent;
