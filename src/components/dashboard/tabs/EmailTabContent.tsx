import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Plus, Check, AlertCircle, RefreshCw } from "lucide-react";
import StatusBadge from "@/components/common/StatusBadge";
import { useEngagementSourcesContext } from "@/contexts/EngagementSourcesContext";

/**
 * EmailTabContent component renders the email integration tab content
 */
const EmailTabContent = () => {
  const {
    sourceStatus,
    emailSettings,
    handleEmailSettingChange,
    handleConnect,
  } = useEngagementSourcesContext();

  const status = sourceStatus.email;
  const settings = emailSettings;
  return (
    <div className="space-y-4 mt-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Email Integration</h3>
        <StatusBadge status={status} />
      </div>

      <div className="grid gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="email-provider">Email Provider</Label>
            <Input
              id="email-provider"
              placeholder="e.g., Gmail, Outlook"
              value={settings.provider}
              onChange={(e) =>
                handleEmailSettingChange("provider", e.target.value)
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email-account">Email Account</Label>
            <Input
              id="email-account"
              type="email"
              placeholder="your@email.com"
              value={settings.account}
              onChange={(e) =>
                handleEmailSettingChange("account", e.target.value)
              }
            />
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
