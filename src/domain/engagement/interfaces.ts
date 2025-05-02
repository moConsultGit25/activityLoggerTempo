// Domain interfaces using ports and adapters pattern
import {
  EngagementSource,
  Interaction,
  ChannelMetrics,
  TeamMember,
  EngagementTrend,
  SourceType,
  InteractionType,
  SentimentType,
} from "./types";

// Repository interfaces (ports)
export interface EngagementSourceRepository {
  getSources(): Promise<EngagementSource[]>;
  getSourceById(id: string): Promise<EngagementSource | null>;
  createSource(
    source: Omit<EngagementSource, "id" | "createdAt" | "updatedAt">,
  ): Promise<EngagementSource>;
  updateSource(source: EngagementSource): Promise<EngagementSource>;
  deleteSource(id: string): Promise<boolean>;
  connectSource(
    id: string,
    settings: Record<string, any>,
  ): Promise<EngagementSource>;
  disconnectSource(id: string): Promise<EngagementSource>;
}

export interface InteractionRepository {
  getInteractions(filters?: InteractionFilters): Promise<Interaction[]>;
  getInteractionById(id: string): Promise<Interaction | null>;
  createInteraction(
    interaction: Omit<Interaction, "id" | "createdAt" | "updatedAt">,
  ): Promise<Interaction>;
  updateInteraction(interaction: Interaction): Promise<Interaction>;
  deleteInteraction(id: string): Promise<boolean>;
}

export interface AnalyticsRepository {
  getChannelMetrics(dateRange?: DateRange): Promise<ChannelMetrics>;
  getTeamPerformance(dateRange?: DateRange): Promise<TeamMember[]>;
  getEngagementTrends(dateRange?: DateRange): Promise<EngagementTrend[]>;
}

// Service interfaces
export interface TranscriptionService {
  transcribeAudio(audioData: Blob): Promise<string>;
  extractHighlights(transcript: string): Promise<Interaction["highlights"]>;
  analyzeSentiment(text: string): Promise<SentimentType>;
  extractActionItems(text: string): Promise<string[]>;
  generateSummary(text: string): Promise<string>;
}

// Event interfaces
export interface EventPublisher {
  publishSourceConnected(sourceId: string, sourceType: SourceType): void;
  publishSourceDisconnected(sourceId: string, sourceType: SourceType): void;
  publishSourceUpdated(
    sourceId: string,
    sourceType: SourceType,
    settings: Record<string, any>,
  ): void;
  publishInteractionCreated(
    interactionId: string,
    sourceId: string,
    interactionType: InteractionType,
  ): void;
  publishInteractionUpdated(
    interactionId: string,
    updates: Partial<Interaction>,
  ): void;
}

// Filter types
export interface DateRange {
  startDate: Date;
  endDate: Date;
}

export interface InteractionFilters {
  searchQuery?: string;
  date?: Date;
  dateRange?: DateRange;
  customer?: string;
  type?: InteractionType;
  sentiment?: SentimentType;
  sourceId?: string;
}
