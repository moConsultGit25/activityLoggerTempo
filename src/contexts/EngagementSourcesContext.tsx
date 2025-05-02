import React, { createContext, useContext } from "react";
import {
  PhoneSettings,
  EmailSettings,
  SocialSettings,
  RecordingSettings,
} from "@/hooks/useEngagementSources";

// Connection status types for engagement sources
type ConnectionStatus = "disconnected" | "connecting" | "connected" | "error";

// Status tracking for all source types
interface SourceStatus {
  phone: ConnectionStatus;
  email: ConnectionStatus;
  social: ConnectionStatus;
  recording: ConnectionStatus;
}

// Define the shape of the context
interface EngagementSourcesContextType {
  sourceStatus: SourceStatus;
  phoneSettings: PhoneSettings;
  emailSettings: EmailSettings;
  socialSettings: SocialSettings;
  recordingSettings: RecordingSettings;
  handleConnect: (sourceType: string) => void;
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
  phoneSettings: PhoneSettings;
  emailSettings: EmailSettings;
  socialSettings: SocialSettings;
  recordingSettings: RecordingSettings;
  handleConnect: (sourceType: string) => void;
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
  phoneSettings,
  emailSettings,
  socialSettings,
  recordingSettings,
  handleConnect,
  handlePhoneSettingChange,
  handleEmailSettingChange,
  handleSocialSettingChange,
  handleRecordingSettingChange,
}) => {
  const value = {
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
