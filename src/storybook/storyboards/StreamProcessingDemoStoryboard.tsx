import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { eventBus, EventTopics } from "@/infrastructure/kafka/eventBus";
import {
  StreamProcessor,
  WindowType,
} from "@/infrastructure/streaming/StreamProcessor";

/**
 * StreamProcessingDemoStoryboard demonstrates real-time event stream processing
 * with different windowing strategies and pattern detection
 */
export default function StreamProcessingDemoStoryboard() {
  // Event generation state
  const [eventType, setEventType] = useState(EventTopics.INTERACTION_CREATED);
  const [eventPayload, setEventPayload] = useState(
    JSON.stringify(
      {
        interactionId: `interaction-${Date.now()}`,
        sourceId: "demo-source-1",
        customer: "Acme Corp",
        type: "call",
        content: "Customer called about new features",
        sentiment: "positive",
        highlights: [
          {
            id: "h1",
            type: "key_moment",
            text: "interested in new features",
            position: 25,
          },
          {
            id: "h2",
            type: "commitment",
            text: "will send documentation",
            position: 120,
          },
        ],
      },
      null,
      2,
    ),
  );

  // Stream processor state
  const [processorName, setProcessorName] = useState("demo-processor");
  const [windowType, setWindowType] = useState<WindowType>(WindowType.TUMBLING);
  const [windowSize, setWindowSize] = useState("10000"); // 10 seconds in ms
  const [isProcessorRunning, setIsProcessorRunning] = useState(false);

  // Event and processing logs
  const [eventLog, setEventLog] = useState<
    Array<{
      id: string;
      type: string;
      timestamp: Date;
      payload: string;
    }>
  >([]);

  const [processingLog, setProcessingLog] = useState<
    Array<{
      timestamp: Date;
      message: string;
      events: number;
    }>
  >([]);

  // Stream processor instance
  const [processor, setProcessor] = useState<StreamProcessor | null>(null);

  // Create and configure the stream processor
  const setupProcessor = () => {
    // Clean up any existing processor
    if (processor) {
      processor.stop();
    }

    // Create window configuration
    const windowConfig = {
      type: windowType,
      size: parseInt(windowSize),
      // Add slide for sliding windows
      ...(windowType === WindowType.SLIDING
        ? { slide: parseInt(windowSize) / 2 }
        : {}),
      // Add timeout for session windows
      ...(windowType === WindowType.SESSION ? { timeout: 30000 } : {}),
    };

    // Create the processor
    const newProcessor = new StreamProcessor({
      name: processorName,
      topics: [eventType],
      window: windowConfig,
      // Group by customer for demo purposes
      keySelector: (event) => event.payload.customer || "default",
    });

    // Add a processor function that logs processing activity
    newProcessor.addProcessor(async (events) => {
      console.log(`Processing ${events.length} events in ${processorName}`);

      // Log the processing activity
      setProcessingLog((prev) => [
        {
          timestamp: new Date(),
          message: `Processed batch of events with ${windowType} window`,
          events: events.length,
        },
        ...prev,
      ]);

      // Example processing - count sentiment by customer
      const sentimentCounts: Record<string, Record<string, number>> = {};

      for (const event of events) {
        if (event.payload.sentiment && event.payload.customer) {
          const customer = event.payload.customer;
          const sentiment = event.payload.sentiment;

          if (!sentimentCounts[customer]) {
            sentimentCounts[customer] = {};
          }

          sentimentCounts[customer][sentiment] =
            (sentimentCounts[customer][sentiment] || 0) + 1;
        }
      }

      // Log sentiment counts
      for (const [customer, counts] of Object.entries(sentimentCounts)) {
        setProcessingLog((prev) => [
          {
            timestamp: new Date(),
            message: `Customer ${customer} sentiment: ${JSON.stringify(counts)}`,
            events: 0,
          },
          ...prev,
        ]);
      }
    });

    setProcessor(newProcessor);
    return newProcessor;
  };

  // Start the stream processor
  const startProcessor = () => {
    const proc = processor || setupProcessor();
    proc.start();
    setIsProcessorRunning(true);

    setProcessingLog((prev) => [
      {
        timestamp: new Date(),
        message: `Started ${processorName} with ${windowType} window of ${windowSize}ms`,
        events: 0,
      },
      ...prev,
    ]);
  };

  // Stop the stream processor
  const stopProcessor = () => {
    if (processor) {
      processor.stop();
      setIsProcessorRunning(false);

      setProcessingLog((prev) => [
        {
          timestamp: new Date(),
          message: `Stopped ${processorName}`,
          events: 0,
        },
        ...prev,
      ]);
    }
  };

  // Generate and publish an event
  const generateEvent = () => {
    try {
      // Parse the event payload
      const payload = JSON.parse(eventPayload);

      // Ensure we have a unique ID
      if (!payload.interactionId) {
        payload.interactionId = `interaction-${Date.now()}`;
      }

      // Publish the event
      const eventId = eventBus.produceEvent(eventType, payload);

      // Log the event
      setEventLog((prev) => [
        {
          id: eventId,
          type: eventType,
          timestamp: new Date(),
          payload: JSON.stringify(payload),
        },
        ...prev,
      ]);
    } catch (error) {
      console.error("Error generating event:", error);
      alert(
        `Error generating event: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  };

  // Generate a random event for quick testing
  const generateRandomEvent = () => {
    const customers = [
      "Acme Corp",
      "TechStart Inc",
      "Global Services",
      "Mountain Outfitters",
    ];
    const sentiments = ["positive", "neutral", "negative"];
    const types = ["call", "email", "chat", "text"];
    const concerns = [
      "pricing is too high",
      "service was slow",
      "product is confusing",
      "need more documentation",
      "having technical issues",
    ];

    const randomCustomer =
      customers[Math.floor(Math.random() * customers.length)];
    const randomSentiment =
      sentiments[Math.floor(Math.random() * sentiments.length)];
    const randomType = types[Math.floor(Math.random() * types.length)];
    const randomConcern = concerns[Math.floor(Math.random() * concerns.length)];

    const payload = {
      interactionId: `interaction-${Date.now()}`,
      sourceId: "demo-source-1",
      customer: randomCustomer,
      type: randomType,
      content: `Customer mentioned that ${randomConcern}`,
      sentiment: randomSentiment,
      highlights: [
        {
          id: `h-${Date.now()}`,
          type: "concern",
          text: randomConcern,
          position: 25,
        },
      ],
    };

    setEventPayload(JSON.stringify(payload, null, 2));
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (processor) {
        processor.stop();
      }
    };
  }, [processor]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Stream Processing Demo</h2>

      <Tabs defaultValue="configuration">
        <TabsList>
          <TabsTrigger value="configuration">Configuration</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="processing">Processing</TabsTrigger>
        </TabsList>

        {/* Configuration Tab */}
        <TabsContent value="configuration" className="space-y-6 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Stream Processor Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="processorName">Processor Name</Label>
                  <Input
                    id="processorName"
                    value={processorName}
                    onChange={(e) => setProcessorName(e.target.value)}
                    disabled={isProcessorRunning}
                  />
                </div>

                <div>
                  <Label htmlFor="eventType">Event Topic</Label>
                  <Select
                    value={eventType}
                    onValueChange={setEventType}
                    disabled={isProcessorRunning}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select event topic" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={EventTopics.INTERACTION_CREATED}>
                        {EventTopics.INTERACTION_CREATED}
                      </SelectItem>
                      <SelectItem value={EventTopics.INTERACTION_UPDATED}>
                        {EventTopics.INTERACTION_UPDATED}
                      </SelectItem>
                      <SelectItem value={EventTopics.SOURCE_CONNECTED}>
                        {EventTopics.SOURCE_CONNECTED}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="windowType">Window Type</Label>
                  <Select
                    value={windowType}
                    onValueChange={(value) =>
                      setWindowType(value as WindowType)
                    }
                    disabled={isProcessorRunning}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select window type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={WindowType.TUMBLING}>
                        Tumbling Window (Fixed, Non-overlapping)
                      </SelectItem>
                      <SelectItem value={WindowType.SLIDING}>
                        Sliding Window (Fixed, Overlapping)
                      </SelectItem>
                      <SelectItem value={WindowType.SESSION}>
                        Session Window (Dynamic, Activity-based)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="windowSize">Window Size (ms)</Label>
                  <Input
                    id="windowSize"
                    type="number"
                    value={windowSize}
                    onChange={(e) => setWindowSize(e.target.value)}
                    disabled={isProcessorRunning}
                  />
                </div>

                <div className="pt-4 flex gap-4">
                  {!isProcessorRunning ? (
                    <Button onClick={startProcessor} className="flex-1">
                      Start Processor
                    </Button>
                  ) : (
                    <Button
                      onClick={stopProcessor}
                      variant="destructive"
                      className="flex-1"
                    >
                      Stop Processor
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Events Tab */}
        <TabsContent value="events" className="space-y-6 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Event Generator</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="eventPayload">Event Payload (JSON)</Label>
                  <textarea
                    id="eventPayload"
                    className="w-full h-48 p-2 border rounded font-mono text-sm"
                    value={eventPayload}
                    onChange={(e) => setEventPayload(e.target.value)}
                  />
                </div>

                <div className="flex gap-4">
                  <Button onClick={generateEvent} className="flex-1">
                    Generate Event
                  </Button>
                  <Button
                    onClick={generateRandomEvent}
                    variant="outline"
                    className="flex-1"
                  >
                    Random Event
                  </Button>
                </div>

                <div>
                  <Label>Event Log:</Label>
                  <ScrollArea className="h-48 border rounded">
                    <div className="p-2 space-y-2">
                      {eventLog.map((event) => (
                        <div
                          key={event.id}
                          className="text-xs p-2 border rounded"
                        >
                          <div className="flex justify-between items-center mb-1">
                            <Badge className="bg-blue-500">{event.type}</Badge>
                            <span className="text-muted-foreground">
                              {event.timestamp.toLocaleTimeString()}
                            </span>
                          </div>
                          <div className="font-mono bg-muted p-1 rounded text-[10px] overflow-hidden text-ellipsis">
                            {event.payload.length > 100
                              ? `${event.payload.substring(0, 100)}...`
                              : event.payload}
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Processing Tab */}
        <TabsContent value="processing" className="space-y-6 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Processing Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label>Processing Log:</Label>
                  <ScrollArea className="h-96 border rounded">
                    <div className="p-2 space-y-2">
                      {processingLog.map((log, i) => (
                        <div key={i} className="text-xs p-2 border rounded">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-medium">{log.message}</span>
                            <span className="text-muted-foreground">
                              {log.timestamp.toLocaleTimeString()}
                            </span>
                          </div>
                          {log.events > 0 && (
                            <Badge className="bg-green-500">
                              {log.events} events
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-6">
        <p className="text-sm text-muted-foreground">
          This demo shows real-time stream processing with different windowing
          strategies:
          <br />
          <strong>Tumbling Windows</strong>: Fixed-size, non-overlapping time
          windows that process events in discrete batches.
          <br />
          <strong>Sliding Windows</strong>: Fixed-size windows that move
          continuously, allowing events to be part of multiple windows.
          <br />
          <strong>Session Windows</strong>: Dynamic windows based on activity,
          which close after a period of inactivity.
        </p>
      </div>
    </div>
  );
}
