import React, { createContext, useContext } from "react";
import {
  PhoneSettings,
  EmailSettings,
  SocialSettings,
  RecordingSettings,
} from "@/hooks/useEngagementSources";
import { ConnectionHealthStatus } from "@/domain/engagement/interfaces";

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

// Simulation status tracking for all source types
interface SourceSimulation {
  phone: boolean;
  email: boolean;
  social: boolean;
  recording: boolean;
}

// Define the shape of the context
interface EngagementSourcesContextType {
  sourceStatus: SourceStatus;
  sourceErrors: SourceErrors;
  sourceHealth: SourceHealth;
  sourceSimulation: SourceSimulation;
  phoneSettings: PhoneSettings;
  emailSettings: EmailSettings;
  socialSettings: SocialSettings;
  recordingSettings: RecordingSettings;
  handleConnect: (sourceType: string) => void;
  handleDisconnect: (sourceType: string) => void;
  handleCheckHealth: (sourceType: string) => void;
  handlePhoneSettingChange: (
    field: keyof PhoneSettings,
    value: string | boolean,
  ) => void;
  handleEmailSettingChange: (
    field: keyof EmailSettings,
    value: string | boolean,
  ) => void;
  handleSocialSettingChange: (
    field: keyof SocialSettings,
    value: string | boolean,
  ) => void;
  handleRecordingSettingChange: (
    field: keyof RecordingSettings,
    value: string | boolean,
  ) => void;
}

// Create the context with a default undefined value
const EngagementSourcesContext = createContext<
  EngagementSourcesContextType | undefined
>(undefined);

// Provider props interface
interface EngagementSourcesProviderProps {
  children: React.ReactNode;
  sourceStatus: SourceStatus;
  sourceErrors: SourceErrors;
  sourceHealth: SourceHealth;
  sourceSimulation: SourceSimulation;
  phoneSettings: PhoneSettings;
  emailSettings: EmailSettings;
  socialSettings: SocialSettings;
  recordingSettings: RecordingSettings;
  handleConnect: (sourceType: string) => void;
  handleDisconnect: (sourceType: string) => void;
  handleCheckHealth: (sourceType: string) => void;
  handlePhoneSettingChange: (
    field: keyof PhoneSettings,
    value: string | boolean,
  ) => void;
  handleEmailSettingChange: (
    field: keyof EmailSettings,
    value: string | boolean,
  ) => void;
  handleSocialSettingChange: (
    field: keyof SocialSettings,
    value: string | boolean,
  ) => void;
  handleRecordingSettingChange: (
    field: keyof RecordingSettings,
    value: string | boolean,
  ) => void;
}

/**
 * EngagementSourcesProvider component provides the context value to its children
 */
export const EngagementSourcesProvider: React.FC<
  EngagementSourcesProviderProps
> = ({
  children,
  sourceStatus,
  sourceErrors,
  sourceHealth,
  sourceSimulation,
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
}) => {
  const value = {
    sourceStatus,
    sourceErrors,
    sourceHealth,
    sourceSimulation,
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
  };

  return (
    <EngagementSourcesContext.Provider value={value}>
      {children}
    </EngagementSourcesContext.Provider>
  );
};

/**
 * Custom hook to use the EngagementSourcesContext
 * @returns The context value
 * @throws Error if used outside of an EngagementSourcesProvider
 */
export const useEngagementSourcesContext = (): EngagementSourcesContextType => {
  const context = useContext(EngagementSourcesContext);
  if (context === undefined) {
    throw new Error(
      "useEngagementSourcesContext must be used within an EngagementSourcesProvider",
    );
  }
  return context;
};
