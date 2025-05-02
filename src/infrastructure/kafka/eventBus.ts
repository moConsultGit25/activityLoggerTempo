/**
 * Event Bus Implementation
 *
 * This module simulates a Kafka-like event bus with schema validation and versioning.
 * In a production environment, this would be replaced with an actual Kafka client.
 *
 * The implementation follows the publish-subscribe pattern and provides an EventPublisher
 * interface for domain events, maintaining a clean separation between the domain and
 * infrastructure layers according to DDD principles.
 */

import { v4 as uuidv4 } from "uuid";
import { DomainEvent } from "@/domain/engagement/types";
import { EventPublisher } from "@/domain/engagement/interfaces";

/**
 * Schema validation for event data
 *
 * Performs runtime type checking on event payloads to ensure they conform to
 * the expected schema for each event type. This simulates the schema validation
 * that would be performed by a real event streaming platform.
 *
 * @param topic - The event topic/type
 * @param data - The event payload to validate
 * @returns boolean indicating if the data is valid for the given topic
 */
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

/**
 * Event system type definitions
 */

/** Function that handles domain events */
type EventHandler = (event: DomainEvent) => void;

/** Represents a subscription to a specific event topic */
interface EventSubscription {
  topic: string;
  handler: EventHandler;
}

/** Metadata for event versioning and tracing */
interface EventMetadata {
  version: string; // Schema version for backward compatibility
  correlationId?: string; // ID linking related events in a flow
  causationId?: string; // ID of the event that caused this event
}

/** Complete event with data and metadata */
interface EventEnvelope {
  eventId: string; // Unique identifier for this event
  topic: string; // Event type/channel
  data: any; // Event payload
  timestamp: Date; // When the event occurred
  metadata: EventMetadata; // Additional event information
}

/**
 * EventBus class implementing the EventPublisher interface
 *
 * This class provides a publish-subscribe mechanism for domain events,
 * with support for schema validation, versioning, and event history.
 */
class EventBus implements EventPublisher {
  /** Active event subscriptions */
  private subscriptions: EventSubscription[] = [];

  /** Event history for debugging and replay */
  private events: EventEnvelope[] = [];

  /** Current schema version for new events */
  private readonly currentVersion = "1.0";

  /**
   * Produces an event to the event bus with schema validation
   *
   * This method simulates publishing an event to Kafka. It validates the event schema,
   * creates appropriate metadata, stores the event, and notifies subscribers.
   *
   * @param topic - The event topic/channel
   * @param data - The event payload
   * @param metadata - Optional metadata to include with the event
   * @returns The generated event ID
   * @throws Error if the event schema is invalid
   */
  public produceEvent(
    topic: string,
    data: any,
    metadata?: Partial<EventMetadata>,
  ): string {
    // Validate schema before publishing
    if (!validateEventSchema(topic, data)) {
      console.error(
        `[Kafka Producer] Invalid event schema for topic: ${topic}`,
        data,
      );
      throw new Error(`Invalid event schema for topic: ${topic}`);
    }

    // Generate a unique ID for this event
    const eventId = uuidv4();

    // Create metadata with versioning and correlation IDs
    const eventMetadata: EventMetadata = {
      version: metadata?.version || this.currentVersion,
      correlationId: metadata?.correlationId || eventId,
      causationId: metadata?.causationId,
    };

    // Create the complete event envelope
    const event: EventEnvelope = {
      eventId,
      topic,
      data,
      timestamp: new Date(),
      metadata: eventMetadata,
    };

    // Log the event (simulating Kafka producer)
    console.log(`[Kafka Producer] Topic: ${topic}`, {
      data,
      metadata: eventMetadata,
    });

    // Store the event in history
    this.events.push(event);

    // Create a domain event from the raw event
    const domainEvent: DomainEvent = {
      eventId,
      eventType: topic.split(".").pop() || topic,
      timestamp: event.timestamp,
      version: eventMetadata.version,
      payload: data,
    };

    // Notify all subscribers asynchronously
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

  /**
   * Subscribes to events on a specific topic
   *
   * This method simulates subscribing to a Kafka topic. It registers a handler
   * function to be called whenever an event on the specified topic is produced.
   *
   * @param topic - The event topic to subscribe to
   * @param handler - Function to call when an event is received
   * @returns Unsubscribe function to remove the subscription
   */
  public consumeEvent(topic: string, handler: EventHandler): () => void {
    console.log(`[Kafka Consumer] Subscribed to topic: ${topic}`);
    const subscription = { topic, handler };
    this.subscriptions.push(subscription);

    // Return unsubscribe function for cleanup
    return () => {
      this.subscriptions = this.subscriptions.filter(
        (sub) => sub !== subscription,
      );
    };
  }

  /**
   * Retrieves events from the event history
   *
   * This method is primarily for debugging and testing purposes.
   * It allows access to previously produced events.
   *
   * @param topic - Optional topic to filter events by
   * @returns Array of event data objects
   */
  public getEvents(topic?: string): any[] {
    if (topic) {
      return this.events
        .filter((event) => event.topic === topic)
        .map((event) => event.data);
    }
    return this.events.map((event) => event.data);
  }

  /**
   * EventPublisher interface implementation
   *
   * These methods provide a domain-specific API for publishing events,
   * abstracting away the details of the event bus implementation.
   */

  /**
   * Publishes a SourceConnected event
   * @param sourceId - ID of the connected source
   * @param sourceType - Type of the connected source
   */
  public publishSourceConnected(sourceId: string, sourceType: string): void {
    this.produceEvent(EventTopics.SOURCE_CONNECTED, {
      sourceId,
      sourceType,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Publishes a SourceDisconnected event
   * @param sourceId - ID of the disconnected source
   * @param sourceType - Type of the disconnected source
   */
  public publishSourceDisconnected(sourceId: string, sourceType: string): void {
    this.produceEvent(EventTopics.SOURCE_DISCONNECTED, {
      sourceId,
      sourceType,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Publishes a SourceUpdated event
   * @param sourceId - ID of the updated source
   * @param sourceType - Type of the updated source
   * @param settings - New settings for the source
   */
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

  /**
   * Publishes an InteractionCreated event
   * @param interactionId - ID of the created interaction
   * @param sourceId - ID of the source that generated the interaction
   * @param interactionType - Type of the interaction (call, email, etc.)
   */
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

  /**
   * Publishes an InteractionUpdated event
   * @param interactionId - ID of the updated interaction
   * @param updates - Changes made to the interaction
   */
  public publishInteractionUpdated(interactionId: string, updates: any): void {
    this.produceEvent(EventTopics.INTERACTION_UPDATED, {
      interactionId,
      updates,
      timestamp: new Date().toISOString(),
    });
  }
}

/**
 * Singleton instance of the EventBus
 * This provides a global access point to the event bus throughout the application
 */
export const eventBus = new EventBus();

/**
 * Event topic constants
 * These define the standard event channels used throughout the application
 * Following the domain-driven naming convention: domain.entity.action
 */
export const EventTopics = {
  SOURCE_CONNECTED: "engagement.source.connected",
  SOURCE_DISCONNECTED: "engagement.source.disconnected",
  SOURCE_UPDATED: "engagement.source.updated",
  INTERACTION_CREATED: "engagement.interaction.created",
  INTERACTION_UPDATED: "engagement.interaction.updated",
};

/**
 * Legacy helper functions for backward compatibility
 *
 * These functions provide a simpler API for publishing events
 * and maintain compatibility with older code.
 *
 * @deprecated Use eventBus.publish* methods directly instead
 */

/**
 * Publishes a source connected event
 * @deprecated Use eventBus.publishSourceConnected instead
 */
export const produceSourceConnectedEvent = (
  sourceId: string,
  sourceType: string,
) => {
  eventBus.publishSourceConnected(sourceId, sourceType);
};

/**
 * Publishes a source disconnected event
 * @deprecated Use eventBus.publishSourceDisconnected instead
 */
export const produceSourceDisconnectedEvent = (
  sourceId: string,
  sourceType: string,
) => {
  eventBus.publishSourceDisconnected(sourceId, sourceType);
};

/**
 * Publishes a source updated event
 * @deprecated Use eventBus.publishSourceUpdated instead
 */
export const produceSourceUpdatedEvent = (
  sourceId: string,
  sourceType: string,
  settings: any,
) => {
  eventBus.publishSourceUpdated(sourceId, sourceType, settings);
};

/**
 * Publishes an interaction created event
 * @deprecated Use eventBus.publishInteractionCreated instead
 */
export const produceInteractionCreatedEvent = (
  interactionId: string,
  sourceId: string,
  interactionType: string,
) => {
  eventBus.publishInteractionCreated(interactionId, sourceId, interactionType);
};
