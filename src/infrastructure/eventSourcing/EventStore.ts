/**
 * Event Store Implementation
 *
 * This module implements an event store for persisting and retrieving domain events.
 * It follows the Event Sourcing pattern to maintain a complete history of all state changes.
 */

import { DomainEvent } from "@/domain/engagement/types";
import { v4 as uuidv4 } from "uuid";

/**
 * EventStore interface defines the contract for storing and retrieving events
 */
export interface EventStore {
  saveEvent<T extends DomainEvent>(event: T): Promise<void>;
  getEvents(aggregateId: string): Promise<DomainEvent[]>;
  getAllEvents(): Promise<DomainEvent[]>;
  getEventsByType(eventType: string): Promise<DomainEvent[]>;
}

/**
 * In-memory implementation of the EventStore
 * In a production environment, this would be replaced with a persistent store
 */
export class InMemoryEventStore implements EventStore {
  private events: DomainEvent[] = [];

  /**
   * Saves an event to the event store
   * @param event The domain event to save
   */
  async saveEvent<T extends DomainEvent>(event: T): Promise<void> {
    // Ensure the event has an ID
    if (!event.eventId) {
      event.eventId = uuidv4();
    }

    // Add timestamp if not present
    if (!event.timestamp) {
      event.timestamp = new Date();
    }

    this.events.push(event);
    console.log(`Event stored: ${event.eventType}`, event);
  }

  /**
   * Retrieves all events for a specific aggregate
   * @param aggregateId The ID of the aggregate to get events for
   * @returns Array of domain events for the aggregate
   */
  async getEvents(aggregateId: string): Promise<DomainEvent[]> {
    return this.events.filter(
      (event) =>
        event.payload &&
        (event.payload.sourceId === aggregateId ||
          event.payload.interactionId === aggregateId),
    );
  }

  /**
   * Retrieves all events in the store
   * @returns Array of all domain events
   */
  async getAllEvents(): Promise<DomainEvent[]> {
    return [...this.events];
  }

  /**
   * Retrieves all events of a specific type
   * @param eventType The type of events to retrieve
   * @returns Array of domain events of the specified type
   */
  async getEventsByType(eventType: string): Promise<DomainEvent[]> {
    return this.events.filter((event) => event.eventType === eventType);
  }
}

// Singleton instance of the event store
export const eventStore = new InMemoryEventStore();
