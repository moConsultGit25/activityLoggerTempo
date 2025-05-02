import { useState, useEffect, useCallback } from "react";
import {
  ChannelMetrics,
  TeamMember,
  EngagementTrend,
} from "../domain/engagement/types";
import { AnalyticsRepository } from "../domain/engagement/interfaces";
import { AnalyticsApiAdapter } from "../infrastructure/api/AnalyticsApiAdapter";

export const useAnalytics = (
  repository?: AnalyticsRepository,
  useMockData: boolean = true,
) => {
  // Use provided repository or create a default one with mock data
  const analyticsRepository =
    repository ||
    new AnalyticsApiAdapter("/api/engagement/analytics", useMockData);

  const [channelMetrics, setChannelMetrics] = useState<ChannelMetrics | null>(
    null,
  );
  const [teamPerformance, setTeamPerformance] = useState<TeamMember[]>([]);
  const [engagementTrends, setEngagementTrends] = useState<EngagementTrend[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all analytics data
  const fetchAnalyticsData = useCallback(
    async (dateRange?: { startDate: Date; endDate: Date }) => {
      try {
        setLoading(true);

        // Fetch channel metrics
        const metricsData =
          await analyticsRepository.getChannelMetrics(dateRange);
        setChannelMetrics(metricsData);

        // Fetch team performance
        const teamData =
          await analyticsRepository.getTeamPerformance(dateRange);
        setTeamPerformance(teamData);

        // Fetch engagement trends
        const trendsData =
          await analyticsRepository.getEngagementTrends(dateRange);
        setEngagementTrends(trendsData);

        setError(null);
      } catch (err) {
        setError("Failed to fetch analytics data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    [analyticsRepository],
  );

  // Load analytics data on component mount
  useEffect(() => {
    fetchAnalyticsData();
  }, [fetchAnalyticsData]);

  return {
    channelMetrics,
    teamPerformance,
    engagementTrends,
    loading,
    error,
    refreshAnalytics: fetchAnalyticsData,
  };
};
