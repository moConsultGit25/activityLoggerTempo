/**
 * useInteractions Hook
 *
 * This custom hook implements the business logic for managing customer interactions
 * as part of the "Engagement Summary Panel" and "Transcript Viewer" features from the PRD.
 * It provides functionality to fetch, filter, and manage interaction data.
 *
 * Following DDD principles, this hook acts as an application service that coordinates between
 * the UI layer and the domain layer. It uses the repository pattern to abstract data access
 * and follows the dependency inversion principle by accepting a repository interface.
 */

import { useState, useEffect, useCallback } from "react";
import {
  Interaction,
  InteractionType,
  SentimentType,
} from "../domain/engagement/types";
import { InteractionRepository } from "../domain/engagement/interfaces";
import { EngagementRepository } from "../domain/engagement/repository";

/**
 * Custom hook for managing customer interactions
 * @param repository - Repository implementation for interaction data access (dependency injection)
 * @returns Object containing state and handlers for interactions
 */
export const useInteractions = (
  repository: InteractionRepository = EngagementRepository,
) => {
  // State for interactions data
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [selectedInteraction, setSelectedInteraction] =
    useState<Interaction | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetches all interactions from the repository
   * This function follows the repository pattern from DDD
   */
  const fetchInteractions = useCallback(async () => {
    try {
      setLoading(true);
      const data = await repository.getInteractions();
      setInteractions(data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch interactions");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [repository]);

  /**
   * Fetches a single interaction by ID and updates the selected interaction state
   * @param id - ID of the interaction to fetch
   * @returns The fetched interaction or null if not found
   */
  const getInteractionById = useCallback(
    async (id: string) => {
      try {
        const interaction = await repository.getInteractionById(id);
        if (interaction) {
          setSelectedInteraction(interaction);
        }
        return interaction;
      } catch (err) {
        console.error("Failed to get interaction:", err);
        return null;
      }
    },
    [repository],
  );

  /**
   * Filters interactions based on provided criteria
   * @param filters - Object containing filter criteria
   * @returns Filtered array of interactions
   */
  const filterInteractions = useCallback(
    (filters: {
      searchQuery?: string;
      date?: Date;
      customer?: string;
      type?: string;
      sentiment?: string;
    }) => {
      return interactions.filter((interaction) => {
        // Apply search query filter across multiple fields
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

        // Apply date filter (exact date match)
        if (
          filters.date &&
          (interaction.date.getDate() !== filters.date.getDate() ||
            interaction.date.getMonth() !== filters.date.getMonth() ||
            interaction.date.getFullYear() !== filters.date.getFullYear())
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

        // Apply interaction type filter
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

        return true;
      });
    },
    [interactions],
  );

  // Load interactions on component mount
  useEffect(() => {
    fetchInteractions();
  }, [fetchInteractions]);

  // Return all state and handlers needed by the UI components
  return {
    interactions,
    selectedInteraction,
    loading,
    error,
    fetchInteractions,
    getInteractionById,
    setSelectedInteraction,
    filterInteractions,
  };
};
