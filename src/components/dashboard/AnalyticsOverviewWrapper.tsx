import React from "react";
import AnalyticsOverview from "./AnalyticsOverview";
import { useAnalytics } from "@/hooks/useAnalytics";
import { AnalyticsApiAdapter } from "@/infrastructure/api/AnalyticsApiAdapter";

const AnalyticsOverviewWrapper = () => {
  // Always use mock data for development
  const mockRepository = new AnalyticsApiAdapter(
    "/api/engagement/analytics",
    true,
  );
  const analyticsData = useAnalytics(mockRepository, true);

  return (
    <AnalyticsOverview
      channelMetrics={analyticsData.channelMetrics || undefined}
      teamPerformance={analyticsData.teamPerformance}
      engagementTrends={analyticsData.engagementTrends}
    />
  );
};

export default AnalyticsOverviewWrapper;
