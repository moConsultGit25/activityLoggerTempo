/**
 * Repository pattern implementation for the Engagement domain
 *
 * This file implements the repository interfaces defined in interfaces.ts
 * using mock data for demonstration purposes. In a production environment,
 * these would connect to actual data sources.
 *
 * Following DDD principles, repositories provide a collection-like interface
 * for accessing domain objects, abstracting the underlying data access mechanisms.
 */

import {
  EngagementSource,
  Interaction,
  ChannelMetrics,
  TeamMember,
  EngagementTrend,
} from "./types";
import {
  EngagementSourceRepository,
  InteractionRepository,
  AnalyticsRepository,
  InteractionFilters,
  DateRange,
} from "./interfaces";

/**
 * Mock data for engagement sources
 *
 * In a production environment, this data would come from a database or API.
 * Each source represents a different channel through which customer interactions occur.
 */
const mockEngagementSources: EngagementSource[] = [
  {
    id: "1",
    type: "phone",
    name: "Twilio",
    isConnected: false,
    settings: {
      apiKey: "",
      autoLogCalls: true,
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    type: "email",
    name: "Gmail",
    isConnected: false,
    settings: {
      authToken: "",
      autoLogEmails: true,
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "3",
    type: "social",
    name: "Twitter",
    isConnected: false,
    settings: {
      apiKey: "",
      apiSecret: "",
      autoLogMessages: true,
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "4",
    type: "recording",
    name: "Zoom",
    isConnected: false,
    settings: {
      apiKey: "",
      apiSecret: "",
      autoTranscribe: true,
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

/**
 * Mock interaction data
 *
 * Represents customer interactions across different channels (call, email, chat).
 * Each interaction includes metadata like sentiment analysis, action items, and content.
 */
const mockInteractions: Interaction[] = [
  {
    id: "1",
    sourceId: "1",
    type: "call",
    customer: "Acme Corp",
    date: new Date(2023, 5, 15),
    duration: "32:45",
    sentiment: "positive",
    summary:
      "Customer expressed interest in expanding their subscription to include premium features.",
    actionItems: [
      "Send pricing information for premium tier",
      "Schedule follow-up demo",
    ],
    followUp: new Date(2023, 5, 22),
    content:
      "Customer: Hi, I wanted to discuss the pricing for your enterprise plan.\n\nAgent: Hello! I'd be happy to go over our enterprise pricing with you.",
    createdAt: new Date(2023, 5, 15),
    updatedAt: new Date(2023, 5, 15),
  },
  {
    id: "2",
    sourceId: "2",
    type: "email",
    customer: "TechStart Inc",
    date: new Date(2023, 5, 14),
    sentiment: "neutral",
    summary:
      "Responded to technical questions about API integration capabilities.",
    actionItems: ["Share API documentation", "Connect with engineering team"],
    content:
      "Subject: API Integration Questions\n\nHello Support Team,\n\nWe have some questions about your API integration capabilities.",
    createdAt: new Date(2023, 5, 14),
    updatedAt: new Date(2023, 5, 14),
  },
  {
    id: "3",
    sourceId: "3",
    type: "chat",
    customer: "Global Services LLC",
    date: new Date(2023, 5, 13),
    duration: "15:20",
    sentiment: "negative",
    summary:
      "Customer reported issues with the reporting dashboard not loading correctly.",
    actionItems: [
      "Create support ticket",
      "Escalate to engineering team",
      "Follow up within 24 hours",
    ],
    followUp: new Date(2023, 5, 14),
    content:
      "Customer: Hello, I'm having trouble with the reporting dashboard. It's not loading correctly.\n\nAgent: I'm sorry to hear that. Let me help you troubleshoot.",
    createdAt: new Date(2023, 5, 13),
    updatedAt: new Date(2023, 5, 13),
  },
];

/**
 * Implementation of all repository interfaces
 *
 * This object implements the EngagementSourceRepository, InteractionRepository,
 * and AnalyticsRepository interfaces defined in interfaces.ts.
 *
 * In a production environment, these methods would connect to actual data sources
 * rather than using mock data.
 */
export const EngagementRepository = {
  // EngagementSourceRepository implementation
  /**
   * Retrieves all engagement sources
   * @returns Promise resolving to an array of engagement sources
   */
  getSources: async (): Promise<EngagementSource[]> => {
    // In a real app, this would be an API call
    return Promise.resolve([...mockEngagementSources]);
  },

  getSourceById: async (id: string): Promise<EngagementSource | null> => {
    // In a real app, this would be an API call
    const source = mockEngagementSources.find((s) => s.id === id);
    return Promise.resolve(source ? { ...source } : null);
  },

  createSource: async (
    source: Omit<EngagementSource, "id" | "createdAt" | "updatedAt">,
  ): Promise<EngagementSource> => {
    // In a real app, this would be an API call
    const newSource: EngagementSource = {
      ...(source as any),
      id: Math.random().toString(36).substring(2, 11),
    };
    mockEngagementSources.push(newSource);
    return Promise.resolve({ ...newSource });
  },

  updateSource: async (source: EngagementSource): Promise<EngagementSource> => {
    // In a real app, this would be an API call
    const index = mockEngagementSources.findIndex((s) => s.id === source.id);
    if (index >= 0) {
      mockEngagementSources[index] = { ...source };
    }
    return Promise.resolve({ ...source });
  },

  deleteSource: async (id: string): Promise<boolean> => {
    // In a real app, this would be an API call
    const index = mockEngagementSources.findIndex((s) => s.id === id);
    if (index >= 0) {
      mockEngagementSources.splice(index, 1);
      return Promise.resolve(true);
    }
    return Promise.resolve(false);
  },

  connectSource: async (
    id: string,
    settings: Record<string, any>,
  ): Promise<EngagementSource> => {
    // In a real app, this would be an API call
    const source = mockEngagementSources.find((s) => s.id === id);
    if (!source) {
      throw new Error(`Source with ID ${id} not found`);
    }
    const updatedSource: EngagementSource = {
      ...source,
      isConnected: true,
      settings: { ...source.settings, ...settings },
    };
    return EngagementRepository.updateSource(updatedSource);
  },

  disconnectSource: async (id: string): Promise<EngagementSource> => {
    // In a real app, this would be an API call
    const source = mockEngagementSources.find((s) => s.id === id);
    if (!source) {
      throw new Error(`Source with ID ${id} not found`);
    }
    const updatedSource: EngagementSource = {
      ...source,
      isConnected: false,
    };
    return EngagementRepository.updateSource(updatedSource);
  },

  // InteractionRepository implementation

  // InteractionRepository implementation
  getInteractions: async (
    filters?: InteractionFilters,
  ): Promise<Interaction[]> => {
    // In a real app, this would be an API call
    let interactions = [...mockInteractions];

    // Apply filters if provided
    if (filters) {
      interactions = interactions.filter((interaction) => {
        // Apply search query filter
        if (
          filters.searchQuery &&
          !(
            interaction.customer
              .toLowerCase()
              .includes(filters.searchQuery.toLowerCase()) ||
            interaction.summary
              .toLowerCase()
              .includes(filters.searchQuery.toLowerCase()) ||
            interaction.content
              .toLowerCase()
              .includes(filters.searchQuery.toLowerCase())
          )
        ) {
          return false;
        }

        // Apply date filter
        if (
          filters.date &&
          (interaction.date.getDate() !== filters.date.getDate() ||
            interaction.date.getMonth() !== filters.date.getMonth() ||
            interaction.date.getFullYear() !== filters.date.getFullYear())
        ) {
          return false;
        }

        // Apply date range filter
        if (
          filters.dateRange &&
          (interaction.date < filters.dateRange.startDate ||
            interaction.date > filters.dateRange.endDate)
        ) {
          return false;
        }

        // Apply customer filter
        if (
          filters.customer &&
          filters.customer !== "all" &&
          interaction.customer !== filters.customer
        ) {
          return false;
        }

        // Apply type filter
        if (
          filters.type &&
          filters.type !== "all" &&
          interaction.type !== filters.type
        ) {
          return false;
        }

        // Apply sentiment filter
        if (
          filters.sentiment &&
          filters.sentiment !== "all" &&
          interaction.sentiment !== filters.sentiment
        ) {
          return false;
        }

        // Apply sourceId filter
        if (filters.sourceId && interaction.sourceId !== filters.sourceId) {
          return false;
        }

        return true;
      });
    }

    return Promise.resolve(interactions);
  },

  getInteractionById: async (id: string): Promise<Interaction | null> => {
    // In a real app, this would be an API call
    const interaction = mockInteractions.find((i) => i.id === id);
    return Promise.resolve(interaction ? { ...interaction } : null);
  },

  createInteraction: async (
    interaction: Omit<Interaction, "id" | "createdAt" | "updatedAt">,
  ): Promise<Interaction> => {
    // In a real app, this would be an API call
    const newInteraction: Interaction = {
      ...(interaction as any),
      id: Math.random().toString(36).substring(2, 11),
    };
    mockInteractions.push(newInteraction);
    return Promise.resolve({ ...newInteraction });
  },

  updateInteraction: async (interaction: Interaction): Promise<Interaction> => {
    // In a real app, this would be an API call
    const index = mockInteractions.findIndex((i) => i.id === interaction.id);
    if (index >= 0) {
      mockInteractions[index] = { ...interaction };
    }
    return Promise.resolve({ ...interaction });
  },

  deleteInteraction: async (id: string): Promise<boolean> => {
    // In a real app, this would be an API call
    const index = mockInteractions.findIndex((i) => i.id === id);
    if (index >= 0) {
      mockInteractions.splice(index, 1);
      return Promise.resolve(true);
    }
    return Promise.resolve(false);
  },

  // AnalyticsRepository implementation

  // AnalyticsRepository implementation
  getChannelMetrics: async (dateRange?: DateRange): Promise<ChannelMetrics> => {
    // In a real app, this would be an API call with date range filtering
    // For now, we'll ignore the dateRange parameter
    return Promise.resolve({
      calls: 124,
      emails: 89,
      chats: 67,
      texts: 45,
    });
  },

  getTeamPerformance: async (dateRange?: DateRange): Promise<TeamMember[]> => {
    // In a real app, this would be an API call with date range filtering
    // For now, we'll ignore the dateRange parameter
    return Promise.resolve([
      { name: "John Doe", interactions: 45, responseTime: 2.3, sentiment: 0.8 },
      {
        name: "Jane Smith",
        interactions: 38,
        responseTime: 1.8,
        sentiment: 0.7,
      },
      {
        name: "Mike Johnson",
        interactions: 52,
        responseTime: 3.1,
        sentiment: 0.6,
      },
      {
        name: "Sarah Williams",
        interactions: 29,
        responseTime: 2.5,
        sentiment: 0.9,
      },
    ]);
  },

  getEngagementTrends: async (
    dateRange?: DateRange,
  ): Promise<EngagementTrend[]> => {
    // In a real app, this would be an API call with date range filtering
    // For now, we'll ignore the dateRange parameter
    return Promise.resolve([
      { date: "Jan 1", interactions: 45 },
      { date: "Jan 8", interactions: 52 },
      { date: "Jan 15", interactions: 49 },
      { date: "Jan 22", interactions: 63 },
      { date: "Jan 29", interactions: 58 },
      { date: "Feb 5", interactions: 71 },
      { date: "Feb 12", interactions: 68 },
    ]);
  },
};
