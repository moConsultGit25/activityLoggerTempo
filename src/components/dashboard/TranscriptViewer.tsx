/**
 * TranscriptViewer Component
 *
 * This component implements the "Transcript Viewer" feature from the PRD.
 * It displays processed conversations with highlighted key moments, commitments,
 * and customer concerns, allowing users to review and analyze customer interactions.
 *
 * The component follows a presentational pattern, receiving data through props
 * and maintaining its own UI state internally.
 */

import React, { useState, useEffect } from "react";
import {
  Search,
  Calendar,
  Filter,
  Download,
  Star,
  Flag,
  MessageSquare,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Interaction } from "../../domain/engagement/types";

/**
 * Component props and data interfaces
 */

/** Props for the TranscriptViewer component */
interface TranscriptViewerProps {
  interactions?: Interaction[];
  selectedInteraction?: Interaction | null;
  loading?: boolean;
  error?: string | null;
  onSelectInteraction?: (id: string) => Promise<Interaction | null>;
  setSelectedInteraction?: (interaction: Interaction | null) => void;
  filterInteractions?: (filters: any) => Interaction[];
}

/** Represents a highlight in a transcript */
interface Highlight {
  id: string; // Unique identifier
  type: "key_moment" | "commitment" | "concern"; // Type of highlight
  text: string; // The highlighted text
  position: number; // Position in the transcript
}

/**
 * TranscriptViewer component displays and allows interaction with customer conversation transcripts
 *
 * @param interactions - Array of interaction data to display
 * @param selectedInteraction - Currently selected interaction
 * @param loading - Loading state
 * @param error - Error message if any
 * @param onSelectInteraction - Callback to select an interaction
 * @param setSelectedInteraction - Callback to set the selected interaction
 * @param filterInteractions - Function to filter interactions
 */
const TranscriptViewer = ({
  interactions = [],
  selectedInteraction = null,
  loading = false,
  error = null,
  onSelectInteraction = async () => null,
  setSelectedInteraction = () => {},
  filterInteractions = () => [],
}: TranscriptViewerProps) => {
  // UI state management
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date(),
  );
  const [searchQuery, setSearchQuery] = useState("");

  // Use mockTranscripts as fallback if no interactions are provided
  const [displayInteractions, setDisplayInteractions] = useState<Interaction[]>(
    interactions.length > 0 ? interactions : mockTranscripts,
  );

  // Update displayInteractions when interactions prop changes
  useEffect(() => {
    if (interactions.length > 0) {
      setDisplayInteractions(interactions);
    }
  }, [interactions]);

  // Set initial selected interaction if none is provided
  useEffect(() => {
    if (!selectedInteraction && displayInteractions.length > 0) {
      setSelectedInteraction(displayInteractions[0]);
    }
  }, [selectedInteraction, displayInteractions, setSelectedInteraction]);

  /**
   * Updates the selected date filter
   * @param date - The newly selected date or undefined to clear the filter
   */
  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
  };

  /**
   * Sets the currently selected transcript for detailed viewing
   * @param transcript - The transcript to display
   */
  const handleTranscriptSelect = (transcript: Interaction) => {
    setSelectedInteraction(transcript);
  };

  /**
   * Filters transcripts based on search query and selected date
   * Applies case-insensitive search across customer name and content
   */
  const filteredTranscripts = displayInteractions.filter((transcript) => {
    // Check if transcript matches search query
    const matchesSearch =
      !searchQuery || // If no search query, include all
      transcript.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transcript.content.toLowerCase().includes(searchQuery.toLowerCase());

    // Check if transcript matches selected date
    const matchesDate =
      !selectedDate || // If no date selected, include all
      (transcript.date.getDate() === selectedDate.getDate() &&
        transcript.date.getMonth() === selectedDate.getMonth() &&
        transcript.date.getFullYear() === selectedDate.getFullYear());

    return matchesSearch && matchesDate;
  });

  /**
   * Renders transcript content with highlighted sections
   *
   * This function takes the raw transcript text and an array of highlights,
   * then renders the content with appropriate highlighting for key moments,
   * commitments, and concerns.
   *
   * @param content - The full transcript text
   * @param highlights - Array of highlights with positions and types
   * @returns React elements with highlighted sections
   */
  const renderHighlightedContent = (
    content: string,
    highlights: Highlight[] | undefined,
  ) => {
    // If no highlights, just return the plain content
    if (!highlights || !highlights.length) return <p>{content}</p>;

    let lastIndex = 0;
    const elements = [];

    // Sort highlights by position to process them in order
    const sortedHighlights = [...highlights].sort(
      (a, b) => a.position - b.position,
    );

    sortedHighlights.forEach((highlight, index) => {
      // Add text before the highlight
      if (highlight.position > lastIndex) {
        elements.push(
          <span key={`text-${index}`}>
            {content.substring(lastIndex, highlight.position)}
          </span>,
        );
      }

      // Add the highlighted text with appropriate styling
      const highlightClass = getHighlightClass(highlight.type);
      elements.push(
        <span
          key={`highlight-${highlight.id}`}
          className={highlightClass}
          title={getHighlightTitle(highlight.type)}
        >
          {highlight.text}
        </span>,
      );

      // Update the last processed position
      lastIndex = highlight.position + highlight.text.length;
    });

    // Add any remaining text after the last highlight
    if (lastIndex < content.length) {
      elements.push(<span key="text-end">{content.substring(lastIndex)}</span>);
    }

    return <p className="whitespace-pre-wrap">{elements}</p>;
  };

  /**
   * Returns the appropriate CSS class for a highlight type
   * @param type - The type of highlight
   * @returns CSS class string for styling the highlight
   */
  const getHighlightClass = (type: string) => {
    switch (type) {
      case "key_moment":
        return "bg-yellow-100 px-1 rounded";
      case "commitment":
        return "bg-green-100 px-1 rounded";
      case "concern":
        return "bg-red-100 px-1 rounded";
      default:
        return "";
    }
  };

  /**
   * Returns a human-readable title for a highlight type
   * @param type - The type of highlight
   * @returns Display text for the highlight type
   */
  const getHighlightTitle = (type: string) => {
    switch (type) {
      case "key_moment":
        return "Key Moment";
      case "commitment":
        return "Commitment";
      case "concern":
        return "Customer Concern";
      default:
        return "";
    }
  };

  /**
   * Returns an icon component for a communication channel
   * @param channel - The communication channel
   * @returns React component for the channel icon
   *
   * TODO: Use different icons for different channel types instead of MessageSquare for all
   */
  const getChannelIcon = (channel: string) => {
    // Currently using the same icon for all channels
    // This should be updated with appropriate icons for each channel type
    return <MessageSquare className="h-4 w-4" />;
  };

  if (loading) {
    return (
      <Card className="w-full h-full bg-white">
        <CardContent className="flex items-center justify-center h-full">
          <p>Loading transcripts...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full h-full bg-white">
        <CardContent className="flex items-center justify-center h-full">
          <p className="text-red-500">Error: {error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full h-full bg-white">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle>Transcript Viewer</CardTitle>
          <div className="flex space-x-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                  <Calendar className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <CalendarComponent
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <Button variant="outline" size="sm" className="h-8 w-8 p-0">
              <Filter className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" className="h-8 w-8 p-0">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by customer or content..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[400px]">
          <div className="md:col-span-1 border rounded-md overflow-hidden">
            <div className="p-2 bg-muted font-medium">Recent Transcripts</div>
            <ScrollArea className="h-[360px]">
              <div className="p-2 space-y-2">
                {filteredTranscripts.length > 0 ? (
                  filteredTranscripts.map((transcript) => (
                    <div
                      key={transcript.id}
                      className={`p-2 border rounded-md cursor-pointer hover:bg-muted transition-colors ${selectedInteraction?.id === transcript.id ? "bg-muted" : ""}`}
                      onClick={() => handleTranscriptSelect(transcript)}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium">
                          {transcript.customer}
                        </span>
                        <Badge
                          variant="outline"
                          className="flex items-center gap-1"
                        >
                          {getChannelIcon(transcript.type)}
                          {transcript.type}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {format(new Date(transcript.date), "MMM d, yyyy")}
                      </div>
                      <div className="text-sm truncate mt-1">
                        {transcript.content.substring(0, 60)}...
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-muted-foreground">
                    No transcripts found
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
          <div className="md:col-span-2 border rounded-md overflow-hidden">
            {selectedInteraction ? (
              <>
                <div className="p-3 bg-muted flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">
                      {selectedInteraction.customer}
                    </h3>
                    <div className="text-sm text-muted-foreground">
                      {format(
                        new Date(selectedInteraction.date),
                        "MMMM d, yyyy h:mm a",
                      )}{" "}
                      · {selectedInteraction.type}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Star className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Flag className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <Tabs defaultValue="transcript" className="w-full">
                  <div className="px-3 border-b">
                    <TabsList className="bg-transparent">
                      <TabsTrigger value="transcript">Transcript</TabsTrigger>
                      <TabsTrigger value="highlights">Highlights</TabsTrigger>
                      <TabsTrigger value="summary">AI Summary</TabsTrigger>
                    </TabsList>
                  </div>
                  <ScrollArea className="h-[290px]">
                    <TabsContent value="transcript" className="p-4 m-0">
                      {renderHighlightedContent(
                        selectedInteraction.content,
                        selectedInteraction.highlights as Highlight[],
                      )}
                    </TabsContent>
                    <TabsContent value="highlights" className="p-4 m-0">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2 flex items-center">
                            <span className="inline-block w-3 h-3 bg-yellow-100 mr-2 rounded"></span>
                            Key Moments
                          </h4>
                          <ul className="space-y-2">
                            {selectedInteraction.highlights
                              ?.filter((h) => h.type === "key_moment")
                              .map((highlight) => (
                                <li
                                  key={highlight.id}
                                  className="bg-muted/50 p-2 rounded"
                                >
                                  {highlight.text}
                                </li>
                              ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2 flex items-center">
                            <span className="inline-block w-3 h-3 bg-green-100 mr-2 rounded"></span>
                            Commitments
                          </h4>
                          <ul className="space-y-2">
                            {selectedInteraction.highlights
                              ?.filter((h) => h.type === "commitment")
                              .map((highlight) => (
                                <li
                                  key={highlight.id}
                                  className="bg-muted/50 p-2 rounded"
                                >
                                  {highlight.text}
                                </li>
                              ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2 flex items-center">
                            <span className="inline-block w-3 h-3 bg-red-100 mr-2 rounded"></span>
                            Customer Concerns
                          </h4>
                          <ul className="space-y-2">
                            {selectedInteraction.highlights
                              ?.filter((h) => h.type === "concern")
                              .map((highlight) => (
                                <li
                                  key={highlight.id}
                                  className="bg-muted/50 p-2 rounded"
                                >
                                  {highlight.text}
                                </li>
                              ))}
                          </ul>
                        </div>
                      </div>
                    </TabsContent>
                    <TabsContent value="summary" className="p-4 m-0">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">Summary</h4>
                          <p className="text-muted-foreground">
                            {selectedInteraction.summary}
                          </p>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Sentiment</h4>
                          <div className="flex items-center">
                            <div className="w-full bg-muted rounded-full h-2.5">
                              <div
                                className={`h-2.5 rounded-full ${getSentimentColor(selectedInteraction.sentiment)}`}
                                style={{
                                  width: getSentimentPercentage(
                                    selectedInteraction.sentiment,
                                  ),
                                }}
                              ></div>
                            </div>
                            <span className="ml-2 text-sm text-muted-foreground">
                              {getSentimentLabel(selectedInteraction.sentiment)}
                            </span>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Action Items</h4>
                          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                            {selectedInteraction.actionItems?.map(
                              (item, index) => <li key={index}>{item}</li>,
                            )}
                          </ul>
                        </div>
                      </div>
                    </TabsContent>
                  </ScrollArea>
                </Tabs>
              </>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                Select a transcript to view
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Helper functions for sentiment display
const getSentimentColor = (sentiment: string) => {
  switch (sentiment) {
    case "positive":
      return "bg-green-500";
    case "neutral":
      return "bg-blue-500";
    case "negative":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
};

const getSentimentPercentage = (sentiment: string) => {
  switch (sentiment) {
    case "positive":
      return "70%";
    case "neutral":
      return "50%";
    case "negative":
      return "30%";
    default:
      return "50%";
  }
};

const getSentimentLabel = (sentiment: string) => {
  switch (sentiment) {
    case "positive":
      return "Positive (70%)";
    case "neutral":
      return "Neutral (50%)";
    case "negative":
      return "Negative (30%)";
    default:
      return "Unknown";
  }
};

/**
 * Mock transcript data for demonstration purposes
 * In a production environment, this would come from the InteractionRepository
 */
const mockTranscripts: Interaction[] = [
  {
    id: "1",
    sourceId: "source-1",
    type: "call",
    customer: "Acme Corporation",
    date: new Date(2023, 5, 15, 14, 30),
    sentiment: "positive",
    summary:
      "This conversation covered product pricing, feature requests, and implementation timeline. The customer expressed interest in the enterprise plan but had concerns about the cost. We committed to providing a custom quote by next week.",
    actionItems: [
      "Send custom pricing quote by Friday",
      "Schedule follow-up call next week",
      "Share documentation on API integration",
    ],
    content:
      "Customer: Hi, I wanted to discuss the pricing for your enterprise plan.\n\nAgent: Hello! I'd be happy to go over our enterprise pricing with you. The base plan starts at $1,500 per month with up to 50 users.\n\nCustomer: That seems a bit high for our budget. Is there any flexibility on that?\n\nAgent: I understand your concern about the pricing. We can definitely look at customizing a package based on your specific needs. What features are most important to you?\n\nCustomer: We mainly need the advanced analytics and API access. The user count is fine.\n\nAgent: Great, in that case, I can work with our pricing team to create a custom package focusing on those features. I'll have a quote for you by next week.\n\nCustomer: That would be perfect. Also, how long does implementation typically take?\n\nAgent: Implementation usually takes about 2-3 weeks, depending on your technical requirements and how quickly we can get the necessary information from your team.",
    highlights: [
      {
        id: "h1",
        type: "key_moment",
        text: "discuss the pricing for your enterprise plan",
        position: 25,
      },
      {
        id: "h2",
        type: "concern",
        text: "That seems a bit high for our budget",
        position: 180,
      },
      {
        id: "h3",
        type: "commitment",
        text: "I'll have a quote for you by next week",
        position: 500,
      },
      {
        id: "h4",
        type: "key_moment",
        text: "how long does implementation typically take",
        position: 550,
      },
    ],
    createdAt: new Date(2023, 5, 15, 14, 30),
    updatedAt: new Date(2023, 5, 15, 14, 30),
  },
  {
    id: "2",
    sourceId: "source-2",
    type: "email",
    customer: "TechStart Inc.",
    date: new Date(2023, 5, 16, 10, 15),
    sentiment: "neutral",
    summary:
      "Customer requested CSV export functionality. We informed them it's already in development and will be released within two weeks. Offered beta testing access.",
    actionItems: [
      "Set up beta access for CSV export",
      "Follow up after feature release",
      "Document CSV format specifications",
    ],
    content:
      "Subject: Feature Request\n\nHello Support Team,\n\nWe've been using your platform for about a month now and it's been great. However, we're missing a critical feature for our workflow - the ability to export reports in CSV format.\n\nIs this something that's on your roadmap? If so, when can we expect it?\n\nBest regards,\nJamie Smith\nProduct Manager\nTechStart Inc.\n\n---\n\nResponse:\n\nHi Jamie,\n\nThank you for reaching out and for the positive feedback about our platform!\n\nI'm happy to let you know that CSV export functionality is actually already in development and scheduled for release in our next update, which should be available within the next two weeks.\n\nWould you be interested in joining our beta testing program to get early access to this feature? If so, I can set that up for you right away.\n\nPlease let me know if you have any other questions or feature requests.\n\nBest,\nAlex Johnson\nCustomer Success Manager",
    highlights: [
      {
        id: "h5",
        type: "key_moment",
        text: "missing a critical feature for our workflow - the ability to export reports in CSV format",
        position: 120,
      },
      {
        id: "h6",
        type: "commitment",
        text: "CSV export functionality is actually already in development and scheduled for release in our next update",
        position: 380,
      },
      {
        id: "h7",
        type: "key_moment",
        text: "within the next two weeks",
        position: 480,
      },
      {
        id: "h8",
        type: "key_moment",
        text: "joining our beta testing program to get early access",
        position: 520,
      },
    ],
    createdAt: new Date(2023, 5, 16, 10, 15),
    updatedAt: new Date(2023, 5, 16, 10, 15),
  },
  {
    id: "3",
    sourceId: "source-3",
    type: "chat",
    customer: "Global Services Ltd.",
    date: new Date(2023, 5, 17, 9, 0),
    sentiment: "negative",
    summary:
      "Customer had trouble connecting Salesforce to our API. We discovered our documentation was missing Salesforce-specific instructions. Sent internal guide and committed to updating public docs.",
    actionItems: [
      "Update public API documentation with Salesforce connector details",
      "Schedule follow-up call with integration specialist",
      "Check if customer successfully connected",
    ],
    content:
      "Customer: Hello, I'm having trouble connecting our CRM system to your API. Is there a specific endpoint I should be using?\n\nAgent: Hi there! I'd be happy to help with the API integration. Which CRM system are you using?\n\nCustomer: We're using Salesforce.\n\nAgent: Perfect! For Salesforce integration, you'll want to use our dedicated Salesforce connector endpoint at api.example.com/v2/connectors/salesforce. Have you checked our integration documentation?\n\nCustomer: I looked at the docs but couldn't find specific Salesforce instructions.\n\nAgent: I apologize for the confusion. You're right, we haven't updated our public docs with the Salesforce connector yet. I'll send you our internal guide right away, and I'll make sure our team updates the public documentation this week.\n\nCustomer: That would be very helpful, thank you.\n\nAgent: You're welcome! I've just emailed the guide to you. Please let me know if you have any questions after reviewing it. I'll also set up a follow-up call with one of our integration specialists if you'd like some hands-on assistance.",
    highlights: [
      {
        id: "h9",
        type: "concern",
        text: "having trouble connecting our CRM system to your API",
        position: 20,
      },
      {
        id: "h10",
        type: "key_moment",
        text: "using Salesforce",
        position: 150,
      },
      {
        id: "h11",
        type: "concern",
        text: "looked at the docs but couldn't find specific Salesforce instructions",
        position: 320,
      },
      {
        id: "h12",
        type: "commitment",
        text: "I'll send you our internal guide right away, and I'll make sure our team updates the public documentation this week",
        position: 450,
      },
    ],
    createdAt: new Date(2023, 5, 17, 9, 0),
    updatedAt: new Date(2023, 5, 17, 9, 0),
  },
];

export { TranscriptViewer };
export default TranscriptViewer;
