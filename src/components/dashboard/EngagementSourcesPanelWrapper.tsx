import React from "react";
import EngagementSourcesPanel from "./EngagementSourcesPanel";
import { useEngagementSources } from "@/hooks/useEngagementSources";
import { EngagementSourcesProvider } from "@/contexts/EngagementSourcesContext";

const EngagementSourcesPanelWrapper = () => {
  const engagementSourcesProps = useEngagementSources();

  return (
    <EngagementSourcesProvider {...engagementSourcesProps}>
      <EngagementSourcesPanel />
    </EngagementSourcesProvider>
  );
};

export default EngagementSourcesPanelWrapper;
