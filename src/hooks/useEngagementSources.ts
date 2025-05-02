/**
 * useEngagementSources Hook
 *
 * This custom hook implements the business logic for the "Automated Engagement Entry" feature
 * from the PRD. It manages the state and operations for connecting various engagement sources
 * (phone, email, social, recording) to enable automated interaction capture.
 *
 * Following DDD principles, this hook acts as an application service that coordinates between
 * the UI layer and the domain layer. It uses the repository pattern to abstract data access
 * and follows the dependency inversion principle by accepting a repository interface.
 */

import { useState, useEffect, useCallback } from "react";
import {
  EngagementSourceRepository,
  ConnectionHealthStatus,
} from "../domain/engagement/interfaces";
import { EngagementSource, SourceType } from "../domain/engagement/types";
import { EngagementSourceApiAdapter } from "../infrastructure/api/EngagementSourceApiAdapter";

// Connection status types for engagement sources
type ConnectionStatus = "disconnected" | "connecting" | "connected" | "error";

// Status tracking for all source types
interface SourceStatus {
  phone: ConnectionStatus;
  email: ConnectionStatus;
  social: ConnectionStatus;
  recording: ConnectionStatus;
}

// Error message tracking for all source types
interface SourceErrors {
  phone: string | null;
  email: string | null;
  social: string | null;
  recording: string | null;
}

// Health status tracking for all source types
interface SourceHealth {
  phone: ConnectionHealthStatus | null;
  email: ConnectionHealthStatus | null;
  social: ConnectionHealthStatus | null;
  recording: ConnectionHealthStatus | null;
}

/**
 * Settings interfaces for each source type
 * These represent the configuration options for different engagement sources
 */
export interface PhoneSettings {
  provider: string;
  apiKey: string;
  autoLogCalls: boolean;
}

export interface EmailSettings {
  provider: string;
  account: string;
  autoLogEmails: boolean;
}

export interface SocialSettings {
  platform: string;
  account: string;
  apiKey: string;
  apiSecret: string;
  autoLogSocial: boolean;
  autoRespondSocial: boolean;
}

export interface RecordingSettings {
  application: string;
  accountId: string;
  apiKey: string;
  webhook: string;
  format: "audio" | "video";
  autoTranscribe: boolean;
  autoAnalyze: boolean;
}

/**
 * Custom hook for managing engagement sources
 * @param repository - Optional repository implementation (for dependency injection)
 * @returns Object containing state and handlers for engagement sources
 */
export function useEngagementSources(repository?: EngagementSourceRepository) {
  // Use the provided repository or create a default one (dependency injection)
  const sourceRepository = repository || new EngagementSourceApiAdapter();

  // State for sources from repository
  const [sources, setSources] = useState<EngagementSource[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // State for tracking connection status of different sources
  const [sourceStatus, setSourceStatus] = useState<SourceStatus>({
    phone: "disconnected",
    email: "disconnected",
    social: "disconnected",
    recording: "disconnected",
  });

  // State for tracking error messages
  const [sourceErrors, setSourceErrors] = useState<SourceErrors>({
    phone: null,
    email: null,
    social: null,
    recording: null,
  });

  // State for tracking health status
  const [sourceHealth, setSourceHealth] = useState<SourceHealth>({
    phone: null,
    email: null,
    social: null,
    recording: null,
  });

  // State for source-specific settings
  const [phoneSettings, setPhoneSettings] = useState<PhoneSettings>({
    provider: "",
    apiKey: "",
    autoLogCalls: false,
  });

  const [emailSettings, setEmailSettings] = useState<EmailSettings>({
    provider: "",
    account: "",
    autoLogEmails: false,
  });

  const [socialSettings, setSocialSettings] = useState<SocialSettings>({
    platform: "",
    account: "",
    apiKey: "",
    apiSecret: "",
    autoLogSocial: false,
    autoRespondSocial: false,
  });

  const [recordingSettings, setRecordingSettings] = useState<RecordingSettings>(
    {
      application: "",
      accountId: "",
      apiKey: "",
      webhook: "",
      format: "audio",
      autoTranscribe: false,
      autoAnalyze: false,
    },
  );

  /**
   * Fetches engagement sources from the repository and updates local state
   * This function follows the repository pattern from DDD
   */
  const fetchSources = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedSources = await sourceRepository.getSources();
      setSources(fetchedSources);

      // Update connection status based on fetched sources
      const newStatus = { ...sourceStatus };
      fetchedSources.forEach((source) => {
        if (source.type in newStatus) {
          newStatus[source.type as keyof SourceStatus] = source.isConnected
            ? "connected"
            : "disconnected";
        }
      });
      setSourceStatus(newStatus);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to fetch sources"),
      );
    } finally {
      setLoading(false);
    }
  }, [sourceRepository, sourceStatus]);

  // Load sources on initial render
  useEffect(() => {
    fetchSources();
  }, [fetchSources]);

  /**
   * Handles connection attempt for a specific source type
   * @param sourceType - Type of source to connect (phone, email, social, recording)
   */
  const handleConnect = async (sourceType: SourceType) => {
    setSourceStatus((prev) => ({
      ...prev,
      [sourceType]: "connecting",
    }));

    // Clear any previous errors
    setSourceErrors((prev) => ({
      ...prev,
      [sourceType]: null,
    }));

    try {
      // Find the source with this type
      const sourceToConnect = sources.find((s) => s.type === sourceType);
      if (!sourceToConnect) {
        throw new Error(`No source found with type ${sourceType}`);
      }

      // Get the appropriate settings based on source type
      let settings: Record<string, any> = {};
      switch (sourceType) {
        case "phone":
          settings = phoneSettings;
          break;
        case "email":
          settings = emailSettings;
          break;
        case "social":
          settings = socialSettings;
          break;
        case "recording":
          settings = recordingSettings;
          break;
      }

      // Connect the source using the repository
      await sourceRepository.connectSource(sourceToConnect.id, settings);

      setSourceStatus((prev) => ({
        ...prev,
        [sourceType]: "connected",
      }));

      // Check health after connecting
      await handleCheckHealth(sourceType);

      // Refresh sources to get updated data
      fetchSources();
    } catch (err) {
      console.error(`Error connecting ${sourceType} source:`, err);
      setSourceStatus((prev) => ({
        ...prev,
        [sourceType]: "error",
      }));

      // Set error message
      setSourceErrors((prev) => ({
        ...prev,
        [sourceType]:
          err instanceof Error
            ? err.message
            : `Failed to connect ${sourceType} source`,
      }));
    }
  };

  /**
   * Handles disconnection attempt for a specific source type
   * @param sourceType - Type of source to disconnect (phone, email, social, recording)
   */
  const handleDisconnect = async (sourceType: SourceType) => {
    try {
      // Find the source with this type
      const sourceToDisconnect = sources.find((s) => s.type === sourceType);
      if (!sourceToDisconnect) {
        throw new Error(`No source found with type ${sourceType}`);
      }

      // Disconnect the source using the repository
      await sourceRepository.disconnectSource(sourceToDisconnect.id);

      setSourceStatus((prev) => ({
        ...prev,
        [sourceType]: "disconnected",
      }));

      // Clear health status and errors
      setSourceHealth((prev) => ({
        ...prev,
        [sourceType]: null,
      }));

      setSourceErrors((prev) => ({
        ...prev,
        [sourceType]: null,
      }));

      // Refresh sources to get updated data
      fetchSources();
    } catch (err) {
      console.error(`Error disconnecting ${sourceType} source:`, err);

      // Set error message
      setSourceErrors((prev) => ({
        ...prev,
        [sourceType]:
          err instanceof Error
            ? err.message
            : `Failed to disconnect ${sourceType} source`,
      }));
    }
  };

  /**
   * Checks the health of a specific source connection
   * @param sourceType - Type of source to check (phone, email, social, recording)
   */
  const handleCheckHealth = async (sourceType: SourceType) => {
    try {
      // Find the source with this type
      const sourceToCheck = sources.find((s) => s.type === sourceType);
      if (!sourceToCheck || !sourceToCheck.isConnected) {
        // If source doesn't exist or isn't connected, clear health status
        setSourceHealth((prev) => ({
          ...prev,
          [sourceType]: null,
        }));
        return;
      }

      // Check health using the repository
      const healthStatus = await sourceRepository.checkConnectionHealth(
        sourceToCheck.id,
      );

      // Update health status
      setSourceHealth((prev) => ({
        ...prev,
        [sourceType]: healthStatus,
      }));

      // Update connection status based on health
      if (healthStatus.status === "error") {
        setSourceStatus((prev) => ({
          ...prev,
          [sourceType]: "error",
        }));

        // Set error message
        setSourceErrors((prev) => ({
          ...prev,
          [sourceType]:
            healthStatus.message ||
            `Connection health check failed for ${sourceType}`,
        }));
      }
    } catch (err) {
      console.error(`Error checking health of ${sourceType} source:`, err);

      // Set error message
      setSourceErrors((prev) => ({
        ...prev,
        [sourceType]:
          err instanceof Error
            ? err.message
            : `Failed to check health of ${sourceType} source`,
      }));
    }
  };

  /**
   * Handler functions for updating settings for different source types
   * These functions maintain immutability by creating new state objects
   */
  const handlePhoneSettingChange = (
    field: keyof PhoneSettings,
    value: string | boolean,
  ) => {
    setPhoneSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleEmailSettingChange = (
    field: keyof EmailSettings,
    value: string | boolean,
  ) => {
    setEmailSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSocialSettingChange = (
    field: keyof SocialSettings,
    value: string | boolean,
  ) => {
    setSocialSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleRecordingSettingChange = (
    field: keyof RecordingSettings,
    value: string | boolean,
  ) => {
    setRecordingSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Return all state and handlers needed by the UI components
  return {
    sources,
    loading,
    error,
    sourceStatus,
    sourceErrors,
    sourceHealth,
    phoneSettings,
    emailSettings,
    socialSettings,
    recordingSettings,
    handleConnect,
    handleDisconnect,
    handleCheckHealth,
    handlePhoneSettingChange,
    handleEmailSettingChange,
    handleSocialSettingChange,
    handleRecordingSettingChange,
    refreshSources: fetchSources,
  };
}
