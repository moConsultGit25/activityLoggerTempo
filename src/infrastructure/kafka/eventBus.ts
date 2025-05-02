// Enhanced event bus to simulate Kafka functionality with schema validation and versioning
// In a real application, this would be replaced with actual Kafka client

import { v4 as uuidv4 } from "uuid";
import { DomainEvent } from "@/domain/engagement/types";
import { EventPublisher } from "@/domain/engagement/interfaces";

// Schema validation using simple type checking
function validateEventSchema(topic: string, data: any): boolean {
  // Basic validation based on topic
  switch (topic) {
    case EventTopics.SOURCE_CONNECTED:
      return (
        typeof data.sourceId === "string" &&
        typeof data.sourceType === "string" &&
        typeof data.timestamp === "string"
      );
    case EventTopics.SOURCE_DISCONNECTED:
      return (
        typeof data.sourceId === "string" &&
        typeof data.sourceType === "string" &&
        typeof data.timestamp === "string"
      );
    case EventTopics.SOURCE_UPDATED:
      return (
        typeof data.sourceId === "string" &&
        typeof data.sourceType === "string" &&
        typeof data.settings === "object" &&
        typeof data.timestamp === "string"
      );
    case EventTopics.INTERACTION_CREATED:
      return (
        typeof data.interactionId === "string" &&
        typeof data.sourceId === "string" &&
        typeof data.interactionType === "string" &&
        typeof data.timestamp === "string"
      );
    case EventTopics.INTERACTION_UPDATED:
      return (
        typeof data.interactionId === "string" &&
        typeof data.timestamp === "string"
      );
    default:
      return true; // Allow unknown topics for extensibility
  }
}

type EventHandler = (event: DomainEvent) => void;

interface EventSubscription {
  topic: string;
  handler: EventHandler;
}

interface EventMetadata {
  version: string;
  correlationId?: string;
  causationId?: string;
}

interface EventEnvelope {
  eventId: string;
  topic: string;
  data: any;
  timestamp: Date;
  metadata: EventMetadata;
}

class EventBus implements EventPublisher {
  private subscriptions: EventSubscription[] = [];
  private events: EventEnvelope[] = [];
  private readonly currentVersion = "1.0";

  // Simulate producing an event to Kafka with schema validation
  public produceEvent(
    topic: string,
    data: any,
    metadata?: Partial<EventMetadata>,
  ): string {
    // Validate schema
    if (!validateEventSchema(topic, data)) {
      console.error(
        `[Kafka Producer] Invalid event schema for topic: ${topic}`,
        data,
      );
      throw new Error(`Invalid event schema for topic: ${topic}`);
    }

    const eventId = uuidv4();
    const eventMetadata: EventMetadata = {
      version: metadata?.version || this.currentVersion,
      correlationId: metadata?.correlationId || eventId,
      causationId: metadata?.causationId,
    };

    const event: EventEnvelope = {
      eventId,
      topic,
      data,
      timestamp: new Date(),
      metadata: eventMetadata,
    };

    console.log(`[Kafka Producer] Topic: ${topic}`, {
      data,
      metadata: eventMetadata,
    });
    this.events.push(event);

    // Create domain event
    const domainEvent: DomainEvent = {
      eventId,
      eventType: topic.split(".").pop() || topic,
      timestamp: event.timestamp,
      version: eventMetadata.version,
      payload: data,
    };

    // Notify subscribers
    this.subscriptions
      .filter((sub) => sub.topic === topic)
      .forEach((sub) => {
        setTimeout(() => {
          try {
            sub.handler(domainEvent);
          } catch (error) {
            console.error(`Error in event handler for topic ${topic}:`, error);
          }
        }, 0);
      });

    return eventId;
  }

  // Simulate consuming events from Kafka
  public consumeEvent(topic: string, handler: EventHandler): () => void {
    console.log(`[Kafka Consumer] Subscribed to topic: ${topic}`);
    const subscription = { topic, handler };
    this.subscriptions.push(subscription);

    // Return unsubscribe function
    return () => {
      this.subscriptions = this.subscriptions.filter(
        (sub) => sub !== subscription,
      );
    };
  }

  // Get all events for a topic (for debugging)
  public getEvents(topic?: string): any[] {
    if (topic) {
      return this.events
        .filter((event) => event.topic === topic)
        .map((event) => event.data);
    }
    return this.events.map((event) => event.data);
  }

  // EventPublisher implementation
  public publishSourceConnected(sourceId: string, sourceType: string): void {
    this.produceEvent(EventTopics.SOURCE_CONNECTED, {
      sourceId,
      sourceType,
      timestamp: new Date().toISOString(),
    });
  }

  public publishSourceDisconnected(sourceId: string, sourceType: string): void {
    this.produceEvent(EventTopics.SOURCE_DISCONNECTED, {
      sourceId,
      sourceType,
      timestamp: new Date().toISOString(),
    });
  }

  public publishSourceUpdated(
    sourceId: string,
    sourceType: string,
    settings: Record<string, any>,
  ): void {
    this.produceEvent(EventTopics.SOURCE_UPDATED, {
      sourceId,
      sourceType,
      settings,
      timestamp: new Date().toISOString(),
    });
  }

  public publishInteractionCreated(
    interactionId: string,
    sourceId: string,
    interactionType: string,
  ): void {
    this.produceEvent(EventTopics.INTERACTION_CREATED, {
      interactionId,
      sourceId,
      interactionType,
      timestamp: new Date().toISOString(),
    });
  }

  public publishInteractionUpdated(interactionId: string, updates: any): void {
    this.produceEvent(EventTopics.INTERACTION_UPDATED, {
      interactionId,
      updates,
      timestamp: new Date().toISOString(),
    });
  }
}

// Singleton instance
export const eventBus = new EventBus();

// Event topics
export const EventTopics = {
  SOURCE_CONNECTED: "engagement.source.connected",
  SOURCE_DISCONNECTED: "engagement.source.disconnected",
  SOURCE_UPDATED: "engagement.source.updated",
  INTERACTION_CREATED: "engagement.interaction.created",
  INTERACTION_UPDATED: "engagement.interaction.updated",
};

// Legacy helper functions for backward compatibility
export const produceSourceConnectedEvent = (
  sourceId: string,
  sourceType: string,
) => {
  eventBus.publishSourceConnected(sourceId, sourceType);
};

export const produceSourceDisconnectedEvent = (
  sourceId: string,
  sourceType: string,
) => {
  eventBus.publishSourceDisconnected(sourceId, sourceType);
};

export const produceSourceUpdatedEvent = (
  sourceId: string,
  sourceType: string,
  settings: any,
) => {
  eventBus.publishSourceUpdated(sourceId, sourceType, settings);
};

export const produceInteractionCreatedEvent = (
  interactionId: string,
  sourceId: string,
  interactionType: string,
) => {
  eventBus.publishInteractionCreated(interactionId, sourceId, interactionType);
};
