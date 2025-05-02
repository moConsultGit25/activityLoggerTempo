import { useState, useEffect, useCallback } from "react";
import { Interaction } from "../domain/engagement/types";
import { EngagementRepository } from "../domain/engagement/repository";
import { produceInteractionCreatedEvent } from "../infrastructure/kafka/eventBus";

export const useInteractions = () => {
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [selectedInteraction, setSelectedInteraction] =
    useState<Interaction | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all interactions
  const fetchInteractions = useCallback(async () => {
    try {
      setLoading(true);
      const data = await EngagementRepository.getInteractions();
      setInteractions(data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch interactions");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Get a single interaction by ID
  const getInteractionById = useCallback(async (id: string) => {
    try {
      const interaction = await EngagementRepository.getInteractionById(id);
      if (interaction) {
        setSelectedInteraction(interaction);
      }
      return interaction;
    } catch (err) {
      console.error("Failed to get interaction:", err);
      return null;
    }
  }, []);

  // Filter interactions by various criteria
  const filterInteractions = useCallback(
    (filters: {
      searchQuery?: string;
      date?: Date;
      customer?: string;
      type?: string;
      sentiment?: string;
    }) => {
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

        return true;
      });
    },
    [interactions],
  );

  // Load interactions on component mount
  useEffect(() => {
    fetchInteractions();
  }, [fetchInteractions]);

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
