import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Plus, Check, AlertCircle, RefreshCw } from "lucide-react";
import StatusBadge from "@/components/common/StatusBadge";
import { useEngagementSourcesContext } from "@/contexts/EngagementSourcesContext";

/**
 * SocialTabContent component renders the social media integration tab content
 */
const SocialTabContent = () => {
  const {
    sourceStatus,
    socialSettings,
    handleSocialSettingChange,
    handleConnect,
  } = useEngagementSourcesContext();

  const status = sourceStatus.social;
  const settings = socialSettings;
  return (
    <div className="space-y-4 mt-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Social Media Integration</h3>
        <StatusBadge status={status} />
      </div>

      <div className="grid gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="social-platform">Platform</Label>
            <Input
              id="social-platform"
              placeholder="e.g., Twitter, LinkedIn, Facebook"
              value={settings.platform}
              onChange={(e) =>
                handleSocialSettingChange("platform", e.target.value)
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="social-account">Account Name/Handle</Label>
            <Input
              id="social-account"
              placeholder="e.g., @yourcompany"
              value={settings.account}
              onChange={(e) =>
                handleSocialSettingChange("account", e.target.value)
              }
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="social-api-key">API Key</Label>
            <Input
              id="social-api-key"
              type="password"
              placeholder="Enter API key"
              value={settings.apiKey}
              onChange={(e) =>
                handleSocialSettingChange("apiKey", e.target.value)
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="social-api-secret">API Secret</Label>
            <Input
              id="social-api-secret"
              type="password"
              placeholder="Enter API secret"
              value={settings.apiSecret}
              onChange={(e) =>
                handleSocialSettingChange("apiSecret", e.target.value)
              }
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Switch
              id="auto-log-social"
              checked={settings.autoLogSocial}
              onCheckedChange={(checked) =>
                handleSocialSettingChange("autoLogSocial", checked)
              }
            />
            <Label htmlFor="auto-log-social">
              Automatically log all social media interactions
            </Label>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Switch
              id="auto-respond-social"
              checked={settings.autoRespondSocial}
              onCheckedChange={(checked) =>
                handleSocialSettingChange("autoRespondSocial", checked)
              }
            />
            <Label htmlFor="auto-respond-social">
              Enable automated response suggestions
            </Label>
          </div>
        </div>

        <Button
          onClick={() => handleConnect("social")}
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
              Connect Social Accounts
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default SocialTabContent;
