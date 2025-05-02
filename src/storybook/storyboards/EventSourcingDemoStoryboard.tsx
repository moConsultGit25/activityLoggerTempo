import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { eventStore } from "@/infrastructure/eventSourcing/EventStore";
import { DomainEvent } from "@/domain/engagement/types";

/**
 * EventSourcingDemoStoryboard demonstrates the Event Sourcing pattern
 * by showing the event history and allowing reconstruction of past states
 */
export default function EventSourcingDemoStoryboard() {
  const [events, setEvents] = useState<DomainEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<DomainEvent | null>(null);
  const [reconstructedState, setReconstructedState] = useState<any | null>(
    null,
  );

  // Load all events on component mount
  useEffect(() => {
    const loadEvents = async () => {
      try {
        const allEvents = await eventStore.getAllEvents();
        setEvents(allEvents);
      } catch (error) {
        console.error("Error loading events:", error);
      }
    };

    loadEvents();
  }, []);

  // Reconstruct state up to the selected event
  const reconstructState = (eventId: string) => {
    const selectedIndex = events.findIndex((e) => e.eventId === eventId);
    if (selectedIndex === -1) return;

    const selectedEvent = events[selectedIndex];
    setSelectedEvent(selectedEvent);

    // Find all events for the same aggregate
    const aggregateId =
      selectedEvent.payload.id ||
      selectedEvent.payload.sourceId ||
      selectedEvent.payload.interactionId;

    if (!aggregateId) {
      setReconstructedState(null);
      return;
    }

    // Get all events for this aggregate up to the selected event
    const relevantEvents = events
      .filter((e) => {
        const eventAggregateId =
          e.payload.id || e.payload.sourceId || e.payload.interactionId;
        return eventAggregateId === aggregateId;
      })
      .filter((e) => e.timestamp <= selectedEvent.timestamp);

    // Reconstruct the state by applying events in sequence
    let state: any = {};

    for (const event of relevantEvents) {
      // Apply event to state based on event type
      switch (event.eventType) {
        case "InteractionCreated":
        case "SourceConnected":
          // Initialize state with creation event
          state = { ...event.payload };
          break;

        case "InteractionUpdated":
        case "SourceUpdated":
          // Update state with changes
          state = { ...state, ...event.payload };
          break;

        default:
          // For other events, merge payload into state
          state = { ...state, ...event.payload };
      }
    }

    setReconstructedState(state);
  };

  // Get badge color based on event type
  const getEventBadgeColor = (eventType: string) => {
    if (eventType.includes("Created")) return "bg-green-500";
    if (eventType.includes("Updated")) return "bg-blue-500";
    if (eventType.includes("Connected")) return "bg-purple-500";
    if (eventType.includes("Disconnected")) return "bg-red-500";
    return "bg-gray-500";
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Event Sourcing Demo</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Event History */}
        <Card>
          <CardHeader>
            <CardTitle>Event History</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px]">
              <div className="space-y-2">
                {events.length > 0 ? (
                  events.map((event) => (
                    <div
                      key={event.eventId}
                      className={`p-3 border rounded-md cursor-pointer hover:bg-muted transition-colors ${
                        selectedEvent?.eventId === event.eventId
                          ? "bg-muted"
                          : ""
                      }`}
                      onClick={() => reconstructState(event.eventId)}
                    >
                      <div className="flex justify-between items-center">
                        <Badge className={getEventBadgeColor(event.eventType)}>
                          {event.eventType}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(event.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <div className="mt-2 text-sm">
                        <span className="font-medium">ID: </span>
                        <span className="font-mono text-xs">
                          {event.eventId.substring(0, 8)}...
                        </span>
                      </div>
                      <div className="mt-1 text-sm">
                        <span className="font-medium">Version: </span>
                        <span>{event.version}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-muted-foreground p-4">
                    No events recorded yet
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Reconstructed State */}
        <Card>
          <CardHeader>
            <CardTitle>Reconstructed State</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedEvent ? (
              <div>
                <div className="mb-4">
                  <h3 className="text-lg font-medium">
                    State after event: {selectedEvent.eventType}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {new Date(selectedEvent.timestamp).toLocaleString()}
                  </p>
                </div>

                <ScrollArea className="h-[320px] border rounded-md p-4">
                  <pre className="text-xs">
                    {JSON.stringify(reconstructedState, null, 2)}
                  </pre>
                </ScrollArea>
              </div>
            ) : (
              <div className="h-[400px] flex items-center justify-center text-muted-foreground">
                Select an event to reconstruct state
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <p className="text-sm text-muted-foreground">
          This demo shows how Event Sourcing allows you to reconstruct the exact
          state of an entity at any point in time by replaying the sequence of
          events that affected it.
        </p>
      </div>
    </div>
  );
}
