import { useState } from "react";

type ConnectionStatus = "disconnected" | "connecting" | "connected" | "error";

type SourceType = "phone" | "email" | "social" | "recording";

interface SourceStatus {
  phone: ConnectionStatus;
  email: ConnectionStatus;
  social: ConnectionStatus;
  recording: ConnectionStatus;
}

// Settings interfaces for each source type
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

export function useEngagementSources() {
  // State for tracking connection status of different sources
  const [sourceStatus, setSourceStatus] = useState<SourceStatus>({
    phone: "disconnected",
    email: "disconnected",
    social: "disconnected",
    recording: "disconnected",
  });

  // State for phone integration settings
  const [phoneSettings, setPhoneSettings] = useState<PhoneSettings>({
    provider: "",
    apiKey: "",
    autoLogCalls: false,
  });

  // State for email integration settings
  const [emailSettings, setEmailSettings] = useState<EmailSettings>({
    provider: "",
    account: "",
    autoLogEmails: false,
  });

  // State for social integration settings
  const [socialSettings, setSocialSettings] = useState<SocialSettings>({
    platform: "",
    account: "",
    apiKey: "",
    apiSecret: "",
    autoLogSocial: false,
    autoRespondSocial: false,
  });

  // State for recording integration settings
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

  // Function to handle connection attempt
  const handleConnect = (sourceType: SourceType) => {
    setSourceStatus((prev) => ({
      ...prev,
      [sourceType]: "connecting",
    }));

    // Simulate connection process
    setTimeout(() => {
      setSourceStatus((prev) => ({
        ...prev,
        [sourceType]: Math.random() > 0.2 ? "connected" : "error",
      }));
    }, 1500);
  };

  // Function to handle phone settings changes
  const handlePhoneSettingChange = (
    field: keyof PhoneSettings,
    value: string | boolean,
  ) => {
    setPhoneSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Function to handle email settings changes
  const handleEmailSettingChange = (
    field: keyof EmailSettings,
    value: string | boolean,
  ) => {
    setEmailSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Function to handle social settings changes
  const handleSocialSettingChange = (
    field: keyof SocialSettings,
    value: string | boolean,
  ) => {
    setSocialSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Function to handle recording settings changes
  const handleRecordingSettingChange = (
    field: keyof RecordingSettings,
    value: string | boolean,
  ) => {
    setRecordingSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return {
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
}
