import React, { useState, useEffect } from "react";
import DataExportPanel from "./DataExportPanel";
import { InteractionApiAdapter } from "@/infrastructure/api/InteractionApiAdapter";
import { ProcessingStatus } from "@/domain/engagement/interfaces";

const DataExportPanelWrapper = () => {
  const [syncStatus, setSyncStatus] = useState<ProcessingStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [lastSyncTime, setLastSyncTime] = useState("Never");
  const [selectedCrm, setSelectedCrm] = useState("salesforce");

  // Create an instance of the InteractionApiAdapter
  const interactionRepository = new InteractionApiAdapter();

  useEffect(() => {
    // Register a callback to receive updates on processing status and progress
    interactionRepository.registerProcessingCallback?.((status, progress) => {
      setSyncStatus(status);
      setProgress(progress);

      if (status === "completed") {
        setLastSyncTime(new Date().toLocaleTimeString());
      }
    });
  }, []);

  const handleSync = async () => {
    try {
      await interactionRepository.processAndSyncToCrm?.(selectedCrm);
    } catch (error) {
      console.error("Error during processing and sync:", error);
    }
  };

  return (
    <DataExportPanel
      lastSyncTime={lastSyncTime}
      syncStatus={syncStatus}
      selectedCrm={selectedCrm}
      onCrmChange={setSelectedCrm}
      onSyncClick={handleSync}
      progress={progress}
    />
  );
};

export default DataExportPanelWrapper;
