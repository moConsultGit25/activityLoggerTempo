/**
 * API Adapter for Customer Interactions
 *
 * This adapter implements the InteractionRepository interface and would connect
 * to a real backend API in a production environment. Currently, it falls back to
 * using the mock repository for demonstration purposes.
 *
 * Following the Adapter pattern from DDD, this class translates between the domain
 * model and the external API representation, handling filtering and data transformation.
 */

import {
  InteractionRepository,
  InteractionFilters,
  ProcessingStatus,
} from "../../domain/engagement/interfaces";
import { Interaction } from "../../domain/engagement/types";
export class InteractionApiAdapter implements InteractionRepository {
  private baseUrl: string;
  private processingStatus: ProcessingStatus = "idle";
  private processingProgress: number = 0;
  private processingCallback?: (
    status: ProcessingStatus,
    progress: number,
  ) => void;

  constructor(baseUrl: string = "/api/engagement/interactions") {
    this.baseUrl = baseUrl;
  }

  async getInteractions(filters?: InteractionFilters): Promise<Interaction[]> {
    try {
      // In a real implementation, this would be a fetch call to the API with query params
      // const queryParams = new URLSearchParams();
      // if (filters) {
      //   if (filters.searchQuery) queryParams.append('search', filters.searchQuery);
      //   if (filters.type) queryParams.append('type', filters.type);
      //   // Add other filters as needed
      // }
      // const url = `${this.baseUrl}?${queryParams.toString()}`;
      // const response = await fetch(url);
      // if (!response.ok) throw new Error(`Failed to fetch interactions: ${response.statusText}`);
      // return await response.json();

      // For now, we'll use the mock data from the repository
      const { EngagementRepository } = await import(
        "../../domain/engagement/repository"
      );
      const interactions = await EngagementRepository.getInteractions();

      // Apply filters if provided
      if (filters) {
        return interactions.filter((interaction) => {
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

      return interactions;
    } catch (error) {
      console.error("Error fetching interactions:", error);
      throw error;
    }
  }

  async getInteractionById(id: string): Promise<Interaction | null> {
    try {
      // In a real implementation, this would be a fetch call to the API
      // const response = await fetch(`${this.baseUrl}/${id}`);
      // if (!response.ok) {
      //   if (response.status === 404) return null;
      //   throw new Error(`Failed to fetch interaction: ${response.statusText}`);
      // }
      // return await response.json();

      // For now, we'll use the mock data from the repository
      const { EngagementRepository } = await import(
        "../../domain/engagement/repository"
      );
      const interaction = await EngagementRepository.getInteractionById(id);
      return interaction || null;
    } catch (error) {
      console.error(`Error fetching interaction ${id}:`, error);
      throw error;
    }
  }

  async createInteraction(
    interaction: Omit<Interaction, "id" | "createdAt" | "updatedAt">,
  ): Promise<Interaction> {
    try {
      // In a real implementation, this would be a POST request to the API
      // const response = await fetch(`${this.baseUrl}`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(interaction)
      // });
      // if (!response.ok) throw new Error(`Failed to create interaction: ${response.statusText}`);
      // return await response.json();

      // For now, we'll create a mock implementation
      const newInteraction: Interaction = {
        ...(interaction as any),
        id: Math.random().toString(36).substring(2, 11),
      };

      return newInteraction;
    } catch (error) {
      console.error("Error creating interaction:", error);
      throw error;
    }
  }

  async updateInteraction(interaction: Interaction): Promise<Interaction> {
    try {
      // In a real implementation, this would be a PUT request to the API
      // const response = await fetch(`${this.baseUrl}/${interaction.id}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(interaction)
      // });
      // if (!response.ok) throw new Error(`Failed to update interaction: ${response.statusText}`);
      // return await response.json();

      // For now, we'll return the interaction as is
      return { ...interaction };
    } catch (error) {
      console.error(`Error updating interaction ${interaction.id}:`, error);
      throw error;
    }
  }

  async deleteInteraction(id: string): Promise<boolean> {
    try {
      // In a real implementation, this would be a DELETE request to the API
      // const response = await fetch(`${this.baseUrl}/${id}`, { method: 'DELETE' });
      // if (!response.ok) throw new Error(`Failed to delete interaction: ${response.statusText}`);
      // return true;

      // For now, we'll return a mock success response
      return true;
    } catch (error) {
      console.error(`Error deleting interaction ${id}:`, error);
      throw error;
    }
  }

  // Methods for handling the two-phase processing and sync process

  /**
   * Registers a callback to receive updates on processing status and progress
   * @param callback Function to call with status and progress updates
   */
  registerProcessingCallback(
    callback: (status: ProcessingStatus, progress: number) => void,
  ): void {
    this.processingCallback = callback;
  }

  /**
   * Gets the current processing status
   * @returns Current processing status and progress
   */
  getProcessingStatus(): { status: ProcessingStatus; progress: number } {
    return { status: this.processingStatus, progress: this.processingProgress };
  }

  /**
   * Initiates the two-phase process: internal processing followed by CRM sync
   * @param crmType The CRM system to sync with (e.g., 'salesforce', 'hubspot')
   * @param options Additional options for processing and syncing
   * @returns Promise that resolves when processing and syncing are complete
   */
  async processAndSyncToCrm(
    crmType: string,
    options: Record<string, any> = {},
  ): Promise<boolean> {
    try {
      // Update status to processing
      this.updateStatus("processing", 0);

      // Phase 1: Internal processing (0-50%)
      await this.performInternalProcessing();

      // Phase 2: CRM sync (50-100%)
      await this.syncProcessedDataToCrm(crmType, options);

      // Update status to completed
      this.updateStatus("completed", 100);

      return true;
    } catch (error) {
      console.error("Error during processing and sync:", error);
      this.updateStatus("failed", this.processingProgress);
      throw error;
    }
  }

  /**
   * Performs internal processing of interaction data
   * @private
   */
  private async performInternalProcessing(): Promise<void> {
    // In a real implementation, this would process the data internally
    // For now, we'll simulate processing with a delay

    for (let progress = 0; progress <= 50; progress += 5) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      this.updateStatus("processing", progress);
    }
  }

  /**
   * Syncs processed data to the specified CRM system
   * @param crmType The CRM system to sync with
   * @param options Additional options for syncing
   * @private
   */
  private async syncProcessedDataToCrm(
    crmType: string,
    options: Record<string, any>,
  ): Promise<void> {
    // In a real implementation, this would sync the data to the CRM
    // For now, we'll simulate syncing with a delay

    for (let progress = 50; progress <= 95; progress += 5) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      this.updateStatus("syncing", progress);
    }
  }

  /**
   * Updates the processing status and notifies the callback if registered
   * @param status New processing status
   * @param progress Current progress percentage
   * @private
   */
  private updateStatus(status: ProcessingStatus, progress: number): void {
    this.processingStatus = status;
    this.processingProgress = progress;

    if (this.processingCallback) {
      this.processingCallback(status, progress);
    }
  }
}
