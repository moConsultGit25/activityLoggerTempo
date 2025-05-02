/**
 * Event Schema Registry
 *
 * This module implements a schema registry for event validation and versioning.
 * It ensures that events conform to their defined schemas and handles schema evolution.
 */

import { DomainEvent } from "@/domain/engagement/types";

/**
 * Schema definition for validating event structure
 */
export interface EventSchema {
  version: string;
  properties: Record<
    string,
    {
      type: string;
      required?: boolean;
      properties?: Record<string, any>;
    }
  >;
  validate: (event: any) => boolean;
}

/**
 * EventSchemaRegistry manages schemas for different event types and versions
 */
export class EventSchemaRegistry {
  private schemas: Map<string, Map<string, EventSchema>> = new Map();

  /**
   * Registers a schema for a specific event type and version
   * @param eventType The type of event
   * @param schema The schema definition
   */
  registerSchema(eventType: string, schema: EventSchema): void {
    if (!this.schemas.has(eventType)) {
      this.schemas.set(eventType, new Map());
    }

    const versionMap = this.schemas.get(eventType)!;
    versionMap.set(schema.version, schema);

    console.log(`Registered schema for ${eventType} version ${schema.version}`);
  }

  /**
   * Validates an event against its registered schema
   * @param event The event to validate
   * @returns True if the event is valid, false otherwise
   */
  validateEvent(event: DomainEvent): boolean {
    const { eventType, version } = event;

    if (!eventType || !version) {
      console.error("Event missing required eventType or version");
      return false;
    }

    const versionMap = this.schemas.get(eventType);
    if (!versionMap) {
      console.error(`No schema registered for event type: ${eventType}`);
      return false;
    }

    const schema = versionMap.get(version);
    if (!schema) {
      console.error(`No schema registered for ${eventType} version ${version}`);
      return false;
    }

    try {
      const isValid = schema.validate(event);
      if (!isValid) {
        console.error(
          `Event validation failed for ${eventType} version ${version}`,
        );
      }
      return isValid;
    } catch (error) {
      console.error(`Error validating event:`, error);
      return false;
    }
  }

  /**
   * Gets all registered versions for an event type
   * @param eventType The event type to get versions for
   * @returns Array of version strings or empty array if event type not found
   */
  getVersions(eventType: string): string[] {
    const versionMap = this.schemas.get(eventType);
    if (!versionMap) {
      return [];
    }

    return Array.from(versionMap.keys());
  }

  /**
   * Gets the latest version for an event type
   * @param eventType The event type to get the latest version for
   * @returns The latest version string or null if event type not found
   */
  getLatestVersion(eventType: string): string | null {
    const versions = this.getVersions(eventType);
    if (versions.length === 0) {
      return null;
    }

    // Sort versions semantically (assuming semver-like versions)
    versions.sort((a, b) => {
      const aParts = a.split(".").map(Number);
      const bParts = b.split(".").map(Number);

      for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
        const aVal = i < aParts.length ? aParts[i] : 0;
        const bVal = i < bParts.length ? bParts[i] : 0;

        if (aVal !== bVal) {
          return aVal - bVal;
        }
      }

      return 0;
    });

    return versions[versions.length - 1];
  }
}

// Singleton instance of the schema registry
export const eventSchemaRegistry = new EventSchemaRegistry();
