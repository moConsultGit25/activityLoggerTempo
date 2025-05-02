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
import { EngagementSourceRepository } from "../domain/engagement/interfaces";
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

      // Refresh sources to get updated data
      fetchSources();
    } catch (err) {
      console.error(`Error connecting ${sourceType} source:`, err);
      setSourceStatus((prev) => ({
        ...prev,
        [sourceType]: "error",
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
    phoneSettings,
    emailSettings,
    socialSettings,
    recordingSettings,
    handleConnect,
    handlePhoneSettingChange,
    handleEmailSettingChange,
    handleSocialSettingChange,
    handleRecordingSettingChange,
    refreshSources: fetchSources,
  };
}
