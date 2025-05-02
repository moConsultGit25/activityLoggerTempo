import React from "react";
import EngagementSourcesPanel from "./EngagementSourcesPanel";
import { useEngagementSources } from "@/hooks/useEngagementSources";
import { EngagementSourcesProvider } from "@/contexts/EngagementSourcesContext";
import { EngagementSourceApiAdapter } from "@/infrastructure/api/EngagementSourceApiAdapter";

const EngagementSourcesPanelWrapper = () => {
  // Create a repository instance to pass to useEngagementSources
  const repository = new EngagementSourceApiAdapter();

  // Always use mock data from useEngagementSources hook
  const engagementSourcesProps = useEngagementSources(repository);

  return (
    <EngagementSourcesProvider {...engagementSourcesProps}>
      <EngagementSourcesPanel />
    </EngagementSourcesProvider>
  );
};

export default EngagementSourcesPanelWrapper;
