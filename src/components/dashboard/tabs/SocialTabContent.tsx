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
 * SocialTabContent component renders the social media integration tab content
 */
const SocialTabContent = () => {
  const {
    sourceStatus,
    socialSettings,
    handleSocialSettingChange,
    handleConnect,
    sourceErrors,
    sourceHealth,
  } = useEngagementSourcesContext();

  const status = sourceStatus.social;
  const settings = socialSettings;
  const errorMessage = sourceErrors?.social;
  const healthStatus = sourceHealth?.social;

  return (
    <div className="space-y-4 mt-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Social Media Integration</h3>
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
            {sourceErrors?.social &&
              sourceErrors.social.includes("Missing required fields") && (
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
            <Label htmlFor="social-platform" className="flex items-center">
              Platform <span className="text-red-500 ml-1">*</span>
              {status === "error" &&
                sourceErrors?.social &&
                sourceErrors.social.includes("platform") && (
                  <span className="ml-1 text-red-500">
                    <AlertCircle className="h-3 w-3 inline" />
                  </span>
                )}
            </Label>
            <Input
              id="social-platform"
              placeholder="e.g., Twitter, LinkedIn, Facebook"
              value={settings.platform}
              onChange={(e) =>
                handleSocialSettingChange("platform", e.target.value)
              }
              className={
                status === "error" &&
                sourceErrors?.social &&
                sourceErrors.social.includes("platform")
                  ? "border-red-500"
                  : ""
              }
            />
            {status === "error" &&
              sourceErrors?.social &&
              sourceErrors.social.includes("Unsupported social platform") && (
                <p className="text-xs text-red-500 mt-1">
                  Supported platforms: Twitter, LinkedIn, Facebook, Instagram
                </p>
              )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="social-account" className="flex items-center">
              Account Name/Handle <span className="text-red-500 ml-1">*</span>
              {status === "error" &&
                sourceErrors?.social &&
                sourceErrors.social.includes("account") && (
                  <span className="ml-1 text-red-500">
                    <AlertCircle className="h-3 w-3 inline" />
                  </span>
                )}
            </Label>
            <Input
              id="social-account"
              placeholder="e.g., @yourcompany"
              value={settings.account}
              onChange={(e) =>
                handleSocialSettingChange("account", e.target.value)
              }
              className={
                status === "error" &&
                sourceErrors?.social &&
                sourceErrors.social.includes("account")
                  ? "border-red-500"
                  : ""
              }
            />
            {status === "error" &&
              sourceErrors?.social &&
              sourceErrors.social.includes("Invalid account format") && (
                <p className="text-xs text-red-500 mt-1">
                  Please enter a valid account handle (e.g., @yourcompany)
                </p>
              )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="social-api-key" className="flex items-center">
              API Key <span className="text-red-500 ml-1">*</span>
              {status === "error" &&
                sourceErrors?.social &&
                sourceErrors.social.includes("apiKey") && (
                  <span className="ml-1 text-red-500">
                    <AlertCircle className="h-3 w-3 inline" />
                  </span>
                )}
            </Label>
            <Input
              id="social-api-key"
              type="password"
              placeholder="Enter API key"
              value={settings.apiKey}
              onChange={(e) =>
                handleSocialSettingChange("apiKey", e.target.value)
              }
              className={
                status === "error" &&
                sourceErrors?.social &&
                sourceErrors.social.includes("apiKey")
                  ? "border-red-500"
                  : ""
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="social-api-secret" className="flex items-center">
              API Secret <span className="text-red-500 ml-1">*</span>
              {status === "error" &&
                sourceErrors?.social &&
                sourceErrors.social.includes("apiSecret") && (
                  <span className="ml-1 text-red-500">
                    <AlertCircle className="h-3 w-3 inline" />
                  </span>
                )}
            </Label>
            <Input
              id="social-api-secret"
              type="password"
              placeholder="Enter API secret"
              value={settings.apiSecret}
              onChange={(e) =>
                handleSocialSettingChange("apiSecret", e.target.value)
              }
              className={
                status === "error" &&
                sourceErrors?.social &&
                sourceErrors.social.includes("apiSecret")
                  ? "border-red-500"
                  : ""
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
