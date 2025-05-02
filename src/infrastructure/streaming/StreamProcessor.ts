/**
 * Stream Processor Implementation
 *
 * This module implements real-time stream processing capabilities for analyzing
 * customer interactions as they occur. It supports windowing, aggregation, and
 * pattern detection across multiple interactions.
 */

import { DomainEvent } from "@/domain/engagement/types";
import { eventBus, EventTopics } from "@/infrastructure/kafka/eventBus";

/**
 * Window types for stream processing
 */
export enum WindowType {
  TUMBLING = "tumbling", // Fixed-size, non-overlapping windows
  SLIDING = "sliding", // Fixed-size, overlapping windows
  SESSION = "session", // Dynamic-size windows based on activity
}

/**
 * Window definition for grouping events
 */
export interface Window {
  type: WindowType;
  size: number; // Window size in milliseconds
  slide?: number; // For sliding windows, how much to slide
  timeout?: number; // For session windows, session timeout
}

/**
 * Stream processor configuration
 */
export interface StreamProcessorConfig {
  name: string;
  topics: string[];
  window?: Window;
  keySelector?: (event: DomainEvent) => string;
  filter?: (event: DomainEvent) => boolean;
}

/**
 * Processor function type for handling windowed events
 */
export type ProcessorFn = (events: DomainEvent[]) => Promise<void>;

/**
 * StreamProcessor class for real-time event processing
 */
export class StreamProcessor {
  private config: StreamProcessorConfig;
  private processors: ProcessorFn[] = [];
  private eventBuffer: Map<string, DomainEvent[]> = new Map();
  private timers: Map<string, NodeJS.Timeout> = new Map();
  private unsubscribeFns: (() => void)[] = [];

  /**
   * Creates a new stream processor with the given configuration
   * @param config The stream processor configuration
   */
  constructor(config: StreamProcessorConfig) {
    this.config = config;
    console.log(`Created stream processor: ${config.name}`);
  }

  /**
   * Adds a processor function to the stream processor
   * @param processorFn The function to process windowed events
   * @returns This stream processor for method chaining
   */
  addProcessor(processorFn: ProcessorFn): StreamProcessor {
    this.processors.push(processorFn);
    return this;
  }

  /**
   * Starts the stream processor
   */
  start(): void {
    console.log(`Starting stream processor: ${this.config.name}`);

    // Subscribe to all configured topics
    for (const topic of this.config.topics) {
      const unsubscribe = eventBus.consumeEvent(topic, (event) => {
        this.handleEvent(event);
      });

      this.unsubscribeFns.push(unsubscribe);
    }
  }

  /**
   * Stops the stream processor and cleans up resources
   */
  stop(): void {
    console.log(`Stopping stream processor: ${this.config.name}`);

    // Unsubscribe from all topics
    for (const unsubscribe of this.unsubscribeFns) {
      unsubscribe();
    }
    this.unsubscribeFns = [];

    // Clear all timers
    for (const [key, timer] of this.timers.entries()) {
      clearTimeout(timer);
      this.timers.delete(key);
    }

    // Clear event buffer
    this.eventBuffer.clear();
  }

  /**
   * Handles an incoming event
   * @param event The domain event to process
   */
  private handleEvent(event: DomainEvent): void {
    // Apply filter if configured
    if (this.config.filter && !this.config.filter(event)) {
      return;
    }

    // Determine the key for this event
    const key = this.config.keySelector
      ? this.config.keySelector(event)
      : "default";

    // Add event to buffer
    if (!this.eventBuffer.has(key)) {
      this.eventBuffer.set(key, []);
    }
    this.eventBuffer.get(key)!.push(event);

    // Process based on window type
    if (this.config.window) {
      switch (this.config.window.type) {
        case WindowType.TUMBLING:
          this.handleTumblingWindow(key);
          break;
        case WindowType.SLIDING:
          this.handleSlidingWindow(key);
          break;
        case WindowType.SESSION:
          this.handleSessionWindow(key, event);
          break;
      }
    } else {
      // No windowing, process each event immediately
      this.processEvents([event]);
    }
  }

  /**
   * Handles tumbling window processing
   * @param key The key for the event group
   */
  private handleTumblingWindow(key: string): void {
    if (!this.timers.has(key)) {
      // Start a new window
      const timer = setTimeout(() => {
        const events = this.eventBuffer.get(key) || [];
        this.eventBuffer.set(key, []);
        this.timers.delete(key);

        if (events.length > 0) {
          this.processEvents(events);
        }
      }, this.config.window!.size);

      this.timers.set(key, timer);
    }
  }

  /**
   * Handles sliding window processing
   * @param key The key for the event group
   */
  private handleSlidingWindow(key: string): void {
    const window = this.config.window!;
    const slideInterval = window.slide || window.size / 2;

    if (!this.timers.has(key)) {
      // Start a new sliding window
      const timer = setInterval(() => {
        const events = this.eventBuffer.get(key) || [];

        if (events.length > 0) {
          // Process events but don't clear buffer
          this.processEvents([...events]);

          // Remove events older than the window size
          const cutoff = Date.now() - window.size;
          const newEvents = events.filter(
            (e) => e.timestamp.getTime() >= cutoff,
          );

          this.eventBuffer.set(key, newEvents);
        }
      }, slideInterval);

      this.timers.set(key, timer);
    }
  }

  /**
   * Handles session window processing
   * @param key The key for the event group
   * @param event The current event
   */
  private handleSessionWindow(key: string, event: DomainEvent): void {
    // Clear any existing timer
    if (this.timers.has(key)) {
      clearTimeout(this.timers.get(key)!);
    }

    // Set a new timer for session expiration
    const timer = setTimeout(() => {
      const events = this.eventBuffer.get(key) || [];
      this.eventBuffer.set(key, []);
      this.timers.delete(key);

      if (events.length > 0) {
        this.processEvents(events);
      }
    }, this.config.window!.timeout || 30000); // Default 30s timeout

    this.timers.set(key, timer);
  }

  /**
   * Processes a batch of events through all registered processors
   * @param events The events to process
   */
  private async processEvents(events: DomainEvent[]): Promise<void> {
    if (events.length === 0) return;

    console.log(`Processing ${events.length} events in ${this.config.name}`);

    for (const processor of this.processors) {
      try {
        await processor(events);
      } catch (error) {
        console.error(`Error in processor for ${this.config.name}:`, error);
      }
    }
  }
}

/**
 * Creates and configures a sentiment analysis processor
 * This processor analyzes customer sentiment across interactions
 */
export function createSentimentAnalysisProcessor(): StreamProcessor {
  return new StreamProcessor({
    name: "sentiment-analysis",
    topics: [EventTopics.INTERACTION_CREATED],
    window: {
      type: WindowType.SLIDING,
      size: 3600000, // 1 hour
      slide: 300000, // 5 minutes
    },
    keySelector: (event) => event.payload.sourceId,
  }).addProcessor(async (events) => {
    // In a real implementation, this would use NLP to analyze sentiment
    console.log(`Analyzing sentiment for ${events.length} interactions`);

    // Example implementation
    const customerSentiments = new Map<string, number[]>();

    // Group sentiments by customer
    for (const event of events) {
      if (event.payload.sentiment) {
        const customer = event.payload.customer;
        if (!customerSentiments.has(customer)) {
          customerSentiments.set(customer, []);
        }

        // Convert sentiment to numeric value
        let sentimentValue = 0;
        switch (event.payload.sentiment) {
          case "positive":
            sentimentValue = 1;
            break;
          case "neutral":
            sentimentValue = 0;
            break;
          case "negative":
            sentimentValue = -1;
            break;
        }

        customerSentiments.get(customer)!.push(sentimentValue);
      }
    }

    // Calculate average sentiment by customer
    for (const [customer, sentiments] of customerSentiments.entries()) {
      if (sentiments.length > 0) {
        const average =
          sentiments.reduce((sum, val) => sum + val, 0) / sentiments.length;
        console.log(
          `Customer ${customer} average sentiment: ${average.toFixed(2)}`,
        );

        // Here you would store this insight or trigger alerts for negative trends
      }
    }
  });
}

/**
 * Creates and configures a pattern detection processor
 * This processor identifies patterns in customer interactions
 */
export function createPatternDetectionProcessor(): StreamProcessor {
  return new StreamProcessor({
    name: "pattern-detection",
    topics: [EventTopics.INTERACTION_CREATED],
    window: {
      type: WindowType.SESSION,
      timeout: 1800000, // 30 minutes
    },
    keySelector: (event) => event.payload.customer,
  }).addProcessor(async (events) => {
    // In a real implementation, this would use pattern recognition algorithms
    console.log(`Detecting patterns in ${events.length} interactions`);

    // Example implementation - detect repeated concerns
    const concerns = events
      .filter((e) => e.payload.highlights)
      .flatMap((e) =>
        (e.payload.highlights || [])
          .filter((h) => h.type === "concern")
          .map((h) => h.text),
      );

    // Count occurrences of each concern
    const concernCounts = concerns.reduce(
      (counts, concern) => {
        counts[concern] = (counts[concern] || 0) + 1;
        return counts;
      },
      {} as Record<string, number>,
    );

    // Identify repeated concerns
    const repeatedConcerns = Object.entries(concernCounts)
      .filter(([_, count]) => count > 1)
      .map(([concern, count]) => ({ concern, count }));

    if (repeatedConcerns.length > 0) {
      console.log("Detected repeated customer concerns:", repeatedConcerns);
      // Here you would trigger alerts or create tasks for customer service
    }
  });
}
