// Domain types for the Engagement domain using DDD principles

// Value Objects - Immutable, identified by their attributes
export type SourceType = "phone" | "email" | "social" | "recording";
export type InteractionType = "call" | "email" | "chat" | "text";
export type SentimentType = "positive" | "neutral" | "negative";
export type HighlightType = "key_moment" | "commitment" | "concern";

export interface SourceSettings {
  readonly [key: string]: any;
}

export interface CustomerIdentity {
  readonly id: string;
  readonly name: string;
  readonly email?: string;
  readonly company?: string;
}

export interface Highlight {
  readonly id: string;
  readonly type: HighlightType;
  readonly text: string;
  readonly position: number;
}

// Aggregate Roots - Main entities with global identity

// EngagementSource Aggregate
export interface EngagementSource {
  readonly id: string;
  readonly type: SourceType;
  readonly name: string;
  readonly isConnected: boolean;
  readonly settings: SourceSettings;
  readonly lastSyncTime?: Date;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

// Interaction Aggregate
export interface Interaction {
  readonly id: string;
  readonly sourceId: string;
  readonly type: InteractionType;
  readonly customer: string;
  readonly date: Date;
  readonly duration?: string;
  readonly sentiment: SentimentType;
  readonly summary: string;
  readonly actionItems: readonly string[];
  readonly followUp?: Date;
  readonly content: string;
  readonly highlights?: readonly Highlight[];
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

// Analytics Value Objects
export interface ChannelMetrics {
  readonly calls: number;
  readonly emails: number;
  readonly chats: number;
  readonly texts: number;
}

export interface TeamMember {
  readonly id: string;
  readonly name: string;
  readonly interactions: number;
  readonly responseTime: number;
  readonly sentiment: number;
}

export interface EngagementTrend {
  readonly date: string;
  readonly interactions: number;
}

// Domain Events
export interface DomainEvent {
  readonly eventId: string;
  readonly eventType: string;
  readonly timestamp: Date;
  readonly version: string;
  readonly payload: unknown;
}

export interface SourceConnectedEvent extends DomainEvent {
  readonly eventType: "SourceConnected";
  readonly payload: {
    readonly sourceId: string;
    readonly sourceType: SourceType;
  };
}

export interface InteractionCreatedEvent extends DomainEvent {
  readonly eventType: "InteractionCreated";
  readonly payload: {
    readonly interactionId: string;
    readonly sourceId: string;
    readonly interactionType: InteractionType;
  };
}

// Domain-specific error types
export class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DomainError";
  }
}

export class SourceConnectionError extends DomainError {
  constructor(sourceId: string, message: string) {
    super(`Failed to connect to source ${sourceId}: ${message}`);
    this.name = "SourceConnectionError";
  }
}

export class InteractionProcessingError extends DomainError {
  constructor(interactionId: string, message: string) {
    super(`Failed to process interaction ${interactionId}: ${message}`);
    this.name = "InteractionProcessingError";
  }
}
