import React from "react";
import { AlertCircle, CheckCircle, Clock, HelpCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import StatusBadge from "./StatusBadge";
import { ConnectionHealthStatus } from "@/domain/engagement/interfaces";

interface ConnectionStatusIndicatorProps {
  status: "disconnected" | "connecting" | "connected" | "error";
  healthStatus?: ConnectionHealthStatus | null;
  errorMessage?: string | null;
}

/**
 * ConnectionStatusIndicator component displays connection status with appropriate icon and tooltip
 * @param status - Current connection status
 * @param healthStatus - Optional health status details
 * @param errorMessage - Optional error message to display
 */
const ConnectionStatusIndicator: React.FC<ConnectionStatusIndicatorProps> = ({
  status,
  healthStatus,
  errorMessage,
}) => {
  // Determine icon based on status
  const getStatusIcon = () => {
    switch (status) {
      case "connected":
        if (healthStatus?.status === "degraded") {
          return <AlertCircle className="h-4 w-4 text-yellow-500" />;
        }
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "connecting":
        return <Clock className="h-4 w-4 text-blue-500 animate-pulse" />;
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <HelpCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  // Determine tooltip content based on status and health
  const getTooltipContent = () => {
    if (status === "error" && errorMessage) {
      return (
        <div className="max-w-xs">
          <p className="font-semibold text-red-500">Connection Error</p>
          <p className="text-sm">{errorMessage}</p>
        </div>
      );
    }

    if (status === "connected" && healthStatus) {
      return (
        <div className="max-w-xs">
          <p className="font-semibold">
            {healthStatus.status === "healthy"
              ? "Healthy Connection"
              : "Degraded Connection"}
          </p>
          {healthStatus.message && (
            <p className="text-sm">{healthStatus.message}</p>
          )}
          {healthStatus.latency && (
            <p className="text-xs text-gray-500">
              Latency: {healthStatus.latency}ms
            </p>
          )}
          <p className="text-xs text-gray-500">
            Last checked: {healthStatus.lastChecked.toLocaleTimeString()}
          </p>
        </div>
      );
    }

    return <p>{status}</p>;
  };

  return (
    <div className="flex items-center gap-2">
      <StatusBadge status={status} />
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="cursor-help">{getStatusIcon()}</div>
          </TooltipTrigger>
          <TooltipContent side="right">{getTooltipContent()}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default ConnectionStatusIndicator;
