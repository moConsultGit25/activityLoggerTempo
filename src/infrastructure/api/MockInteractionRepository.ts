/**
 * Mock Interaction Repository
 *
 * This class provides a mock implementation of the InteractionRepository interface
 * for testing, storyboards, and development purposes. It simulates API delays and
 * implements filtering functionality similar to what would be available in a real backend.
 *
 * Following DDD principles, this repository maintains the same interface as the real
 * repository, allowing for easy substitution in different environments.
 */

import {
  InteractionRepository,
  InteractionFilters,
} from "../../domain/engagement/interfaces";
import { Interaction } from "../../domain/engagement/types";
export class MockInteractionRepository implements InteractionRepository {
  /**
   * Mock interaction data with dynamically calculated dates
   * This provides realistic test data for development and testing purposes
   */
  private mockInteractions: Interaction[] = [
    {
      id: "mock-1",
      sourceId: "1",
      type: "call",
      customer: "Mock Corp",
      date: new Date(),
      duration: "15:30",
      sentiment: "positive",
      summary: "Customer was very satisfied with the new features.",
      actionItems: ["Send follow-up email", "Schedule demo for next week"],
      followUp: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      content:
        "Customer: I'm really impressed with the new dashboard.\n\nAgent: Thank you! We've been working hard on improving it.",
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(),
    },
    {
      id: "mock-2",
      sourceId: "2",
      type: "email",
      customer: "Test Inc",
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      sentiment: "neutral",
      summary: "Customer had questions about pricing.",
      actionItems: ["Send pricing sheet", "Follow up next week"],
      content:
        "Subject: Pricing Questions\n\nHello,\n\nCould you please send me your current pricing information?\n\nThanks,\nTest Inc",
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
  ];

  /**
   * Retrieves interactions with optional filtering
   * @param filters - Optional criteria to filter interactions
   * @returns Promise resolving to filtered interactions array
   */
  async getInteractions(filters?: InteractionFilters): Promise<Interaction[]> {
    // Simulate API delay for realistic testing
    await new Promise((resolve) => setTimeout(resolve, 500));

    let interactions = [...this.mockInteractions];

    // Apply filters if provided
    if (filters) {
      // Text search across multiple fields
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        interactions = interactions.filter(
          (i) =>
            i.customer.toLowerCase().includes(query) ||
            i.summary.toLowerCase().includes(query) ||
            i.content.toLowerCase().includes(query),
        );
      }

      // Filter by interaction type
      if (filters.type && filters.type !== "all") {
        interactions = interactions.filter((i) => i.type === filters.type);
      }

      // Filter by sentiment
      if (filters.sentiment && filters.sentiment !== "all") {
        interactions = interactions.filter(
          (i) => i.sentiment === filters.sentiment,
        );
      }

      // Filter by date range if provided
      if (filters.dateRange) {
        interactions = interactions.filter(
          (i) =>
            i.date >= filters.dateRange!.startDate &&
            i.date <= filters.dateRange!.endDate,
        );
      }

      // Filter by specific date if provided
      if (filters.date) {
        interactions = interactions.filter(
          (i) => i.date.toDateString() === filters.date!.toDateString(),
        );
      }

      // Filter by source ID if provided
      if (filters.sourceId) {
        interactions = interactions.filter(
          (i) => i.sourceId === filters.sourceId,
        );
      }
    }

    return interactions;
  }

  async getInteractionById(id: string): Promise<Interaction | null> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    const interaction = this.mockInteractions.find((i) => i.id === id);
    return interaction ? { ...interaction } : null;
  }

  async createInteraction(
    interaction: Omit<Interaction, "id" | "createdAt" | "updatedAt">,
  ): Promise<Interaction> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 700));

    const newInteraction: Interaction = {
      ...(interaction as any),
      id: `mock-${Math.random().toString(36).substring(2, 9)}`,
    };

    this.mockInteractions.push(newInteraction);
    return { ...newInteraction };
  }

  async updateInteraction(interaction: Interaction): Promise<Interaction> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const index = this.mockInteractions.findIndex(
      (i) => i.id === interaction.id,
    );
    if (index >= 0) {
      this.mockInteractions[index] = { ...interaction };
    }

    return { ...interaction };
  }

  async deleteInteraction(id: string): Promise<boolean> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 400));

    const index = this.mockInteractions.findIndex((i) => i.id === id);
    if (index >= 0) {
      this.mockInteractions.splice(index, 1);
      return true;
    }

    return false;
  }
}
