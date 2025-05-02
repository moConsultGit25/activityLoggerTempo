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

// Processing status types for the two-phase process
export type ProcessingStatus =
  | "idle"
  | "processing"
  | "syncing"
  | "completed"
  | "failed";

// Repository interfaces (ports)
// Connection health status type
export type ConnectionHealthStatus = {
  status: "healthy" | "degraded" | "error";
  latency?: number;
  lastChecked: Date;
  message?: string;
  details?: Record<string, any>;
};

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

  // New methods for API connection health checks
  checkConnectionHealth(id: string): Promise<ConnectionHealthStatus>;
  checkAllConnectionsHealth(): Promise<Record<string, ConnectionHealthStatus>>;

  // New method for testing a connection before saving
  testConnection(
    sourceType: SourceType,
    settings: Record<string, any>,
  ): Promise<{
    success: boolean;
    message: string;
    details?: Record<string, any>;
  }>;
}

export interface InteractionRepository {
  getInteractions(filters?: InteractionFilters): Promise<Interaction[]>;
  getInteractionById(id: string): Promise<Interaction | null>;
  createInteraction(
    interaction: Omit<Interaction, "id" | "createdAt" | "updatedAt">,
  ): Promise<Interaction>;
  updateInteraction(interaction: Interaction): Promise<Interaction>;
  deleteInteraction(id: string): Promise<boolean>;

  // Methods for the two-phase processing and sync process
  registerProcessingCallback?(
    callback: (status: ProcessingStatus, progress: number) => void,
  ): void;
  getProcessingStatus?(): { status: ProcessingStatus; progress: number };
  processAndSyncToCrm?(
    crmType: string,
    options?: Record<string, any>,
  ): Promise<boolean>;
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
