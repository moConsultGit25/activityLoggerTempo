import React from "react";
import EngagementSummaryPanel from "./EngagementSummaryPanel";
import { useInteractions } from "@/hooks/useInteractions";
import { MockInteractionRepository } from "@/infrastructure/api/MockInteractionRepository";

const EngagementSummaryPanelWrapper = () => {
  // Always use mock data for development
  const mockRepository = new MockInteractionRepository();
  const interactionsData = useInteractions(mockRepository);

  return <EngagementSummaryPanel />;
};

export default EngagementSummaryPanelWrapper;
