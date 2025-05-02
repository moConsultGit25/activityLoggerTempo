import React from "react";
import EngagementSourcesPanel from "./EngagementSourcesPanel";
import { useEngagementSources } from "@/hooks/useEngagementSources";
import { EngagementSourcesProvider } from "@/contexts/EngagementSourcesContext";

const EngagementSourcesPanelWrapper = () => {
  // Always use mock data from useEngagementSources hook
  const engagementSourcesProps = useEngagementSources(true);

  return (
    <EngagementSourcesProvider {...engagementSourcesProps}>
      <EngagementSourcesPanel />
    </EngagementSourcesProvider>
  );
};

export default EngagementSourcesPanelWrapper;
