import React from "react";
import EngagementSourcesPanel from "./EngagementSourcesPanel";
import { useEngagementSources } from "@/hooks/useEngagementSources";

const EngagementSourcesPanelWrapper = () => {
  const engagementSourcesProps = useEngagementSources();

  return <EngagementSourcesPanel {...engagementSourcesProps} />;
};

export default EngagementSourcesPanelWrapper;
