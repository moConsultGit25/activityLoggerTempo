import { FC } from "react";
import { InteractionRepository } from "../../domain/engagement/interfaces";
import { useInteractions } from "../../hooks/useInteractions";
import { TranscriptViewer } from "./TranscriptViewer";
import { MockInteractionRepository } from "../../infrastructure/api/MockInteractionRepository";

interface TranscriptViewerWrapperProps {
  repository?: InteractionRepository;
}

export const TranscriptViewerWrapper: FC<TranscriptViewerWrapperProps> = ({
  repository = new MockInteractionRepository(),
}) => {
  // Always use the MockInteractionRepository for development
  const mockRepository = new MockInteractionRepository();

  const {
    interactions,
    selectedInteraction,
    loading,
    error,
    getInteractionById,
    setSelectedInteraction,
    filterInteractions,
  } = useInteractions(mockRepository);

  return (
    <TranscriptViewer
      interactions={interactions}
      selectedInteraction={selectedInteraction}
      loading={false} // Force loading to false to show mock data
      error={null} // Force error to null to show mock data
      onSelectInteraction={getInteractionById}
      setSelectedInteraction={setSelectedInteraction}
      filterInteractions={filterInteractions}
    />
  );
};

// Also export as default for backward compatibility
export default TranscriptViewerWrapper;
