import {
  AnalyticsRepository,
  DateRange,
} from "../../domain/engagement/interfaces";
import {
  ChannelMetrics,
  TeamMember,
  EngagementTrend,
} from "../../domain/engagement/types";

/**
 * API Adapter implementation of the AnalyticsRepository interface.
 * This adapter would connect to a real backend API in a production environment.
 * For development, it returns mock data directly.
 */
export class AnalyticsApiAdapter implements AnalyticsRepository {
  private baseUrl: string;
  private useMockData: boolean;

  constructor(
    baseUrl: string = "/api/engagement/analytics",
    useMockData: boolean = true,
  ) {
    this.baseUrl = baseUrl;
    this.useMockData = useMockData;
  }

  async getChannelMetrics(dateRange?: DateRange): Promise<ChannelMetrics> {
    try {
      // Always use mock data in development
      if (this.useMockData) {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 300));

        return {
          calls: 128,
          emails: 245,
          chats: 187,
          texts: 93,
        };
      }

      // In a real implementation, this would be a fetch call to the API with query params
      // const queryParams = new URLSearchParams();
      // if (dateRange) {
      //   queryParams.append('startDate', dateRange.startDate.toISOString());
      //   queryParams.append('endDate', dateRange.endDate.toISOString());
      // }
      // const url = `${this.baseUrl}/channel-metrics?${queryParams.toString()}`;
      // const response = await fetch(url);
      // if (!response.ok) throw new Error(`Failed to fetch channel metrics: ${response.statusText}`);
      // return await response.json();

      // For now, we'll use the mock data from the repository
      const { EngagementRepository } = await import(
        "../../domain/engagement/repository"
      );
      return EngagementRepository.getChannelMetrics();
    } catch (error) {
      console.error("Error fetching channel metrics:", error);
      throw error;
    }
  }

  async getTeamPerformance(dateRange?: DateRange): Promise<TeamMember[]> {
    try {
      // Always use mock data in development
      if (this.useMockData) {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 300));

        return [
          {
            name: "Sarah Johnson",
            interactions: 87,
            responseTime: 3.2,
            sentiment: 0.92,
          },
          {
            name: "Michael Chen",
            interactions: 64,
            responseTime: 4.5,
            sentiment: 0.85,
          },
          {
            name: "Jessica Williams",
            interactions: 76,
            responseTime: 2.8,
            sentiment: 0.94,
          },
          {
            name: "David Rodriguez",
            interactions: 53,
            responseTime: 5.1,
            sentiment: 0.78,
          },
          {
            name: "Emily Taylor",
            interactions: 92,
            responseTime: 2.5,
            sentiment: 0.89,
          },
        ];
      }

      // In a real implementation, this would be a fetch call to the API with query params
      // const queryParams = new URLSearchParams();
      // if (dateRange) {
      //   queryParams.append('startDate', dateRange.startDate.toISOString());
      //   queryParams.append('endDate', dateRange.endDate.toISOString());
      // }
      // const url = `${this.baseUrl}/team-performance?${queryParams.toString()}`;
      // const response = await fetch(url);
      // if (!response.ok) throw new Error(`Failed to fetch team performance: ${response.statusText}`);
      // return await response.json();

      // For now, we'll use the mock data from the repository
      const { EngagementRepository } = await import(
        "../../domain/engagement/repository"
      );
      return EngagementRepository.getTeamPerformance();
    } catch (error) {
      console.error("Error fetching team performance:", error);
      throw error;
    }
  }

  async getEngagementTrends(dateRange?: DateRange): Promise<EngagementTrend[]> {
    try {
      // Always use mock data in development
      if (this.useMockData) {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 300));

        // Generate last 7 days of data
        const trends: EngagementTrend[] = [];
        const now = new Date();

        for (let i = 6; i >= 0; i--) {
          const date = new Date(now);
          date.setDate(date.getDate() - i);

          trends.push({
            date: date,
            calls: Math.floor(Math.random() * 30) + 10,
            emails: Math.floor(Math.random() * 40) + 20,
            chats: Math.floor(Math.random() * 25) + 15,
            texts: Math.floor(Math.random() * 20) + 5,
            sentiment: Math.random() * 0.3 + 0.7, // Random value between 0.7 and 1.0
          });
        }

        return trends;
      }

      // In a real implementation, this would be a fetch call to the API with query params
      // const queryParams = new URLSearchParams();
      // if (dateRange) {
      //   queryParams.append('startDate', dateRange.startDate.toISOString());
      //   queryParams.append('endDate', dateRange.endDate.toISOString());
      // }
      // const url = `${this.baseUrl}/engagement-trends?${queryParams.toString()}`;
      // const response = await fetch(url);
      // if (!response.ok) throw new Error(`Failed to fetch engagement trends: ${response.statusText}`);
      // return await response.json();

      // For now, we'll use the mock data from the repository
      const { EngagementRepository } = await import(
        "../../domain/engagement/repository"
      );
      return EngagementRepository.getEngagementTrends();
    } catch (error) {
      console.error("Error fetching engagement trends:", error);
      throw error;
    }
  }
}
