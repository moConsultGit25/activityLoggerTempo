import { FC } from "react";
import { InteractionRepository } from "../../domain/engagement/interfaces";
import { useInteractions } from "../../hooks/useInteractions";
import { TranscriptViewer } from "./TranscriptViewer";

interface TranscriptViewerWrapperProps {
  repository?: InteractionRepository;
}

export const TranscriptViewerWrapper: FC<TranscriptViewerWrapperProps> = ({
  repository,
}) => {
  const {
    interactions,
    selectedInteraction,
    loading,
    error,
    getInteractionById,
    setSelectedInteraction,
    filterInteractions,
  } = useInteractions(repository);

  return (
    <TranscriptViewer
      interactions={interactions}
      selectedInteraction={selectedInteraction}
      loading={loading}
      error={error}
      onSelectInteraction={getInteractionById}
      setSelectedInteraction={setSelectedInteraction}
      filterInteractions={filterInteractions}
    />
  );
};
