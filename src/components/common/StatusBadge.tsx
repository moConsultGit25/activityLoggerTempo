import React from "react";
import { Badge } from "@/components/ui/badge";

type ConnectionStatus = "disconnected" | "connecting" | "connected" | "error";

interface StatusBadgeProps {
  status: ConnectionStatus;
}

/**
 * StatusBadge component displays a badge with appropriate styling based on connection status
 * @param status - Current connection status
 */
const StatusBadge = ({ status }: StatusBadgeProps) => {
  switch (status) {
    case "connected":
      return <Badge className="bg-green-500">Connected</Badge>;
    case "connecting":
      return <Badge className="bg-blue-500">Connecting...</Badge>;
    case "error":
      return <Badge className="bg-red-500">Connection Error</Badge>;
    default:
      return <Badge variant="outline">Disconnected</Badge>;
  }
};

export default StatusBadge;
