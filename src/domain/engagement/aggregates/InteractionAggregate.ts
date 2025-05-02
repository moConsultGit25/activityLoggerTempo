/**
 * Interaction Aggregate
 *
 * This module implements the Interaction aggregate root following DDD principles.
 * It encapsulates the business logic for customer interactions and ensures
 * consistency of the interaction entity.
 */

import { Interaction, InteractionType, SentimentType } from "../types";
import { eventBus } from "@/infrastructure/kafka/eventBus";
import { eventStore } from "@/infrastructure/eventSourcing/EventStore";
import { v4 as uuidv4 } from "uuid";

/**
 * InteractionAggregate class represents the aggregate root for customer interactions
 */
export class InteractionAggregate {
  private interaction: Interaction;
  private isNew: boolean;

  /**
   * Creates a new interaction aggregate
   * @param interaction The interaction data
   * @param isNew Whether this is a new interaction or an existing one
   */
  constructor(interaction: Interaction, isNew: boolean = false) {
    this.interaction = { ...interaction };
    this.isNew = isNew;
  }

  /**
   * Creates a new interaction aggregate
   * @param sourceId The source that generated the interaction
   * @param type The type of interaction
   * @param customer The customer involved in the interaction
   * @param content The content of the interaction
   * @returns A new interaction aggregate
   */
  static create(
    sourceId: string,
    type: InteractionType,
    customer: string,
    content: string,
  ): InteractionAggregate {
    const now = new Date();
    const interaction: Interaction = {
      id: uuidv4(),
      sourceId,
      type,
      customer,
      date: now,
      content,
      sentiment: "neutral", // Default sentiment
      createdAt: now,
      updatedAt: now,
    };

    return new InteractionAggregate(interaction, true);
  }

  /**
   * Gets the interaction data
   * @returns The current interaction state
   */
  getInteraction(): Interaction {
    return { ...this.interaction };
  }

  /**
   * Updates the sentiment of the interaction
   * @param sentiment The new sentiment value
   */
  updateSentiment(sentiment: SentimentType): void {
    this.interaction.sentiment = sentiment;
    this.interaction.updatedAt = new Date();
  }

  /**
   * Adds a summary to the interaction
   * @param summary The summary text
   */
  addSummary(summary: string): void {
    this.interaction.summary = summary;
    this.interaction.updatedAt = new Date();
  }

  /**
   * Adds action items to the interaction
   * @param actionItems Array of action item texts
   */
  addActionItems(actionItems: string[]): void {
    this.interaction.actionItems = actionItems;
    this.interaction.updatedAt = new Date();
  }

  /**
   * Sets a follow-up date for the interaction
   * @param followUpDate The date for follow-up
   */
  setFollowUp(followUpDate: Date): void {
    this.interaction.followUp = followUpDate;
    this.interaction.updatedAt = new Date();
  }

  /**
   * Adds highlights to the interaction
   * @param highlights Array of highlight objects
   */
  addHighlights(highlights: any[]): void {
    this.interaction.highlights = highlights;
    this.interaction.updatedAt = new Date();
  }

  /**
   * Saves the interaction and publishes appropriate events
   */
  async save(): Promise<void> {
    if (this.isNew) {
      // Publish interaction created event
      eventBus.publishInteractionCreated(
        this.interaction.id,
        this.interaction.sourceId,
        this.interaction.type,
      );

      // Store the event
      await eventStore.saveEvent({
        eventId: uuidv4(),
        eventType: "InteractionCreated",
        timestamp: new Date(),
        version: "1.0",
        payload: this.interaction,
      });

      this.isNew = false;
    } else {
      // Publish interaction updated event
      eventBus.publishInteractionUpdated(this.interaction.id, this.interaction);

      // Store the event
      await eventStore.saveEvent({
        eventId: uuidv4(),
        eventType: "InteractionUpdated",
        timestamp: new Date(),
        version: "1.0",
        payload: this.interaction,
      });
    }
  }

  /**
   * Reconstructs an interaction aggregate from its event history
   * @param interactionId The ID of the interaction to reconstruct
   * @returns The reconstructed interaction aggregate or null if not found
   */
  static async loadFromHistory(
    interactionId: string,
  ): Promise<InteractionAggregate | null> {
    const events = await eventStore.getEvents(interactionId);

    if (events.length === 0) {
      return null;
    }

    // Find the creation event
    const creationEvent = events.find(
      (e) => e.eventType === "InteractionCreated",
    );
    if (!creationEvent) {
      return null;
    }

    // Start with the initial state
    const interaction = creationEvent.payload as Interaction;

    // Apply all subsequent update events
    for (const event of events) {
      if (event.eventType === "InteractionUpdated" && event !== creationEvent) {
        Object.assign(interaction, event.payload);
      }
    }

    return new InteractionAggregate(interaction, false);
  }
}
