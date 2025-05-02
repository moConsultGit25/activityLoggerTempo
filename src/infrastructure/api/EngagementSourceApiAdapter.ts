/**
 * API Adapter for Engagement Sources
 *
 * This adapter implements the EngagementSourceRepository interface and would connect
 * to a real backend API in a production environment. Currently, it falls back to
 * using the mock repository for demonstration purposes.
 *
 * Following the Adapter pattern from DDD, this class translates between the domain
 * model and the external API representation.
 *
 * @implements {EngagementSourceRepository}
 * @description Handles all API interactions for engagement sources including CRUD operations,
 * connection management, health checks, and connection testing.
 *
 * @example
 * // Create an instance of the adapter
 * const sourceAdapter = new EngagementSourceApiAdapter();
 *
 * // Get all sources
 * const sources = await sourceAdapter.getSources();
 *
 * // Connect a source
 * const connectedSource = await sourceAdapter.connectSource('source-id', { apiKey: 'key123' });
 *
 * // Check connection health
 * const healthStatus = await sourceAdapter.checkConnectionHealth('source-id');
 */

import {
  ConnectionHealthStatus,
  EngagementSourceRepository,
} from "../../domain/engagement/interfaces";
import { EngagementSource, SourceType } from "../../domain/engagement/types";

/**
 * Logger for API connections
 *
 * A singleton class that provides consistent logging for all API connection operations.
 * Logs include timestamps, log levels, messages, and optional contextual details.
 *
 * @class
 * @singleton
 */
class ConnectionLogger {
  private static instance: ConnectionLogger;
  private logs: Array<{
    timestamp: Date;
    level: "info" | "warn" | "error";
    message: string;
    details?: Record<string, any>;
  }> = [];

  private constructor() {}

  /**
   * Gets the singleton instance of the ConnectionLogger
   *
   * @returns {ConnectionLogger} The singleton instance
   */
  static getInstance(): ConnectionLogger {
    if (!ConnectionLogger.instance) {
      ConnectionLogger.instance = new ConnectionLogger();
    }
    return ConnectionLogger.instance;
  }

  /**
   * Logs a message with the specified level and optional details
   *
   * @param {"info" | "warn" | "error"} level - The log level
   * @param {string} message - The log message
   * @param {Record<string, any>} [details] - Optional contextual details
   * @returns {Object} The created log entry
   */
  log(
    level: "info" | "warn" | "error",
    message: string,
    details?: Record<string, any>,
  ) {
    const logEntry = {
      timestamp: new Date(),
      level,
      message,
      details,
    };
    this.logs.push(logEntry);

    // In a real implementation, this might send logs to a server or write to a file
    console[level](message, details || "");

    return logEntry;
  }

  /**
   * Logs an info-level message
   *
   * @param {string} message - The log message
   * @param {Record<string, any>} [details] - Optional contextual details
   * @returns {Object} The created log entry
   */
  info(message: string, details?: Record<string, any>) {
    return this.log("info", message, details);
  }

  /**
   * Logs a warning-level message
   *
   * @param {string} message - The log message
   * @param {Record<string, any>} [details] - Optional contextual details
   * @returns {Object} The created log entry
   */
  warn(message: string, details?: Record<string, any>) {
    return this.log("warn", message, details);
  }

  /**
   * Logs an error-level message
   *
   * @param {string} message - The log message
   * @param {Record<string, any>} [details] - Optional contextual details
   * @returns {Object} The created log entry
   */
  error(message: string, details?: Record<string, any>) {
    return this.log("error", message, details);
  }

  /**
   * Gets all logs
   *
   * @returns {Array} A copy of all log entries
   */
  getLogs() {
    return [...this.logs];
  }

  /**
   * Clears all logs
   */
  clearLogs() {
    this.logs = [];
  }
}

/**
 * Error handling for API connections
 *
 * A specialized error class for tracking connection errors with additional context
 * such as source ID, source type, and timestamps.
 *
 * @class
 * @extends {Error}
 */
class ConnectionError extends Error {
  public readonly sourceId?: string;
  public readonly sourceType?: SourceType;
  public readonly details?: Record<string, any>;
  public readonly timestamp: Date;

  /**
   * Creates a new ConnectionError
   *
   * @param {string} message - The error message
   * @param {Object} [options] - Additional error context
   * @param {string} [options.sourceId] - The ID of the source that caused the error
   * @param {SourceType} [options.sourceType] - The type of source that caused the error
   * @param {Record<string, any>} [options.details] - Additional error details
   */
  constructor(
    message: string,
    options?: {
      sourceId?: string;
      sourceType?: SourceType;
      details?: Record<string, any>;
    },
  ) {
    super(message);
    this.name = "ConnectionError";
    this.sourceId = options?.sourceId;
    this.sourceType = options?.sourceType;
    this.details = options?.details;
    this.timestamp = new Date();
  }
}
export class EngagementSourceApiAdapter implements EngagementSourceRepository {
  private baseUrl: string;
  private logger = ConnectionLogger.getInstance();
  private connectionHealthCache: Record<string, ConnectionHealthStatus> = {};
  private readonly healthCheckInterval: number = 60000; // 1 minute in milliseconds
  private healthCheckTimer?: NodeJS.Timeout;

  // Helper validation methods
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  private isValidEmailProvider(provider: string): boolean {
    const supportedProviders = [
      "gmail",
      "outlook",
      "yahoo",
      "office365",
      "exchange",
      "imap",
      "smtp",
    ];
    return supportedProviders.includes(provider.toLowerCase());
  }

  private isValidSocialPlatform(platform: string): boolean {
    const supportedPlatforms = [
      "twitter",
      "linkedin",
      "facebook",
      "instagram",
      "tiktok",
    ];
    return supportedPlatforms.includes(platform.toLowerCase());
  }

  constructor(baseUrl: string = "/api/engagement/sources") {
    this.baseUrl = baseUrl;

    // Start periodic health checks
    this.startPeriodicHealthChecks();
  }

  /**
   * Starts periodic health checks for all connected sources
   * Runs every healthCheckInterval milliseconds (default: 60000ms)
   *
   * @private
   */
  private startPeriodicHealthChecks() {
    // Clear any existing timer
    if (this.healthCheckTimer) {
      clearInterval(this.healthCheckTimer);
    }

    // Set up periodic health checks
    this.healthCheckTimer = setInterval(async () => {
      try {
        await this.checkAllConnectionsHealth();
      } catch (error) {
        this.logger.error("Failed to perform periodic health checks", {
          error,
        });
      }
    }, this.healthCheckInterval);
  }

  /**
   * Gets all engagement sources
   *
   * @returns {Promise<EngagementSource[]>} A promise that resolves to an array of engagement sources
   */
  async getSources(): Promise<EngagementSource[]> {
    try {
      // In a real implementation, this would be a fetch call to the API
      // const response = await fetch(`${this.baseUrl}`);
      // if (!response.ok) throw new Error(`Failed to fetch sources: ${response.statusText}`);
      // return await response.json();

      // For now, we'll use the mock data from the repository
      const { EngagementRepository } = await import(
        "../../domain/engagement/repository"
      );
      return EngagementRepository.getSources();
    } catch (error) {
      console.error("Error fetching engagement sources:", error);
      throw error;
    }
  }

  /**
   * Gets a specific engagement source by ID
   *
   * @param {string} id - The ID of the source to retrieve
   * @returns {Promise<EngagementSource | null>} A promise that resolves to the source or null if not found
   */
  async getSourceById(id: string): Promise<EngagementSource | null> {
    try {
      // In a real implementation, this would be a fetch call to the API
      // const response = await fetch(`${this.baseUrl}/${id}`);
      // if (!response.ok) {
      //   if (response.status === 404) return null;
      //   throw new Error(`Failed to fetch source: ${response.statusText}`);
      // }
      // return await response.json();

      // For now, we'll use the mock data from the repository
      const { EngagementRepository } = await import(
        "../../domain/engagement/repository"
      );
      const sources = await EngagementRepository.getSources();
      const source = sources.find((s) => s.id === id);
      return source || null;
    } catch (error) {
      console.error(`Error fetching engagement source ${id}:`, error);
      throw error;
    }
  }

  /**
   * Creates a new engagement source
   *
   * @param {Omit<EngagementSource, "id" | "createdAt" | "updatedAt">} source - The source data to create
   * @returns {Promise<EngagementSource>} A promise that resolves to the created source
   */
  async createSource(
    source: Omit<EngagementSource, "id" | "createdAt" | "updatedAt">,
  ): Promise<EngagementSource> {
    try {
      // In a real implementation, this would be a POST request to the API
      // const response = await fetch(`${this.baseUrl}`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(source)
      // });
      // if (!response.ok) throw new Error(`Failed to create source: ${response.statusText}`);
      // return await response.json();

      // For now, we'll create a mock implementation
      const newSource: EngagementSource = {
        ...(source as any),
        id: Math.random().toString(36).substring(2, 11),
      };

      return newSource;
    } catch (error) {
      console.error("Error creating engagement source:", error);
      throw error;
    }
  }

  /**
   * Updates an existing engagement source
   *
   * @param {EngagementSource} source - The source data to update
   * @returns {Promise<EngagementSource>} A promise that resolves to the updated source
   */
  async updateSource(source: EngagementSource): Promise<EngagementSource> {
    try {
      // In a real implementation, this would be a PUT request to the API
      // const response = await fetch(`${this.baseUrl}/${source.id}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(source)
      // });
      // if (!response.ok) throw new Error(`Failed to update source: ${response.statusText}`);
      // return await response.json();

      // For now, we'll use the mock data from the repository
      const { EngagementRepository } = await import(
        "../../domain/engagement/repository"
      );
      return EngagementRepository.updateSource(source);
    } catch (error) {
      console.error(`Error updating engagement source ${source.id}:`, error);
      throw error;
    }
  }

  /**
   * Deletes an engagement source
   *
   * @param {string} id - The ID of the source to delete
   * @returns {Promise<boolean>} A promise that resolves to true if the deletion was successful
   */
  async deleteSource(id: string): Promise<boolean> {
    try {
      // In a real implementation, this would be a DELETE request to the API
      // const response = await fetch(`${this.baseUrl}/${id}`, { method: 'DELETE' });
      // if (!response.ok) throw new Error(`Failed to delete source: ${response.statusText}`);
      // return true;

      // For now, we'll return a mock success response
      return true;
    } catch (error) {
      console.error(`Error deleting engagement source ${id}:`, error);
      throw error;
    }
  }

  /**
   * Connects an engagement source with the provided settings
   * Tests the connection before connecting and updates the health status cache
   *
   * @param {string} id - The ID of the source to connect
   * @param {Record<string, any>} settings - The connection settings
   * @returns {Promise<EngagementSource>} A promise that resolves to the connected source
   * @throws {ConnectionError} If the connection test fails or the source is not found
   */
  async connectSource(
    id: string,
    settings: Record<string, any>,
  ): Promise<EngagementSource> {
    this.logger.info(`Attempting to connect source ${id}`, { settings });
    try {
      // First test the connection before actually connecting
      const source = await this.getSourceById(id);
      if (!source) {
        const error = new ConnectionError(`Source with ID ${id} not found`, {
          sourceId: id,
        });
        this.logger.error(error.message, { error });
        throw error;
      }

      // Test the connection with the provided settings
      const testResult = await this.testConnection(source.type, settings);
      if (!testResult.success) {
        const errorDetails = {
          sourceId: id,
          sourceType: source.type,
          details: testResult.details,
          missingFields: testResult.missingFields,
          recommendedAction: testResult.recommendedAction,
        };

        const error = new ConnectionError(
          `Connection test failed: ${testResult.message}`,
          errorDetails,
        );
        this.logger.error(error.message, { error, ...errorDetails });
        throw error;
      }

      // In a real implementation, this would be a POST request to the API
      // const response = await fetch(`${this.baseUrl}/${id}/connect`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(settings)
      // });
      // if (!response.ok) throw new Error(`Failed to connect source: ${response.statusText}`);
      // return await response.json();

      // For now, we'll use the mock data from the repository
      const { EngagementRepository } = await import(
        "../../domain/engagement/repository"
      );

      const updatedSource: EngagementSource = {
        ...source,
        isConnected: true,
        settings: { ...source.settings, ...settings },
      };

      const result = await EngagementRepository.updateSource(updatedSource);

      // Update the health status cache
      this.connectionHealthCache[id] = {
        status: "healthy",
        lastChecked: new Date(),
        message: "Connection established successfully",
        latency: testResult.details?.latency,
      };

      this.logger.info(`Successfully connected source ${id}`, {
        sourceId: id,
        sourceType: source.type,
      });
      return result;
    } catch (error) {
      this.logger.error(`Error connecting engagement source ${id}:`, { error });

      // Update health status cache with error
      if (error instanceof ConnectionError && error.sourceId) {
        this.connectionHealthCache[id] = {
          status: "error",
          lastChecked: new Date(),
          message: error.message,
          details: error.details,
        };
      }

      throw error;
    }
  }

  /**
   * Disconnects an engagement source
   * Updates the health status cache to remove the disconnected source
   *
   * @param {string} id - The ID of the source to disconnect
   * @returns {Promise<EngagementSource>} A promise that resolves to the disconnected source
   * @throws {ConnectionError} If the source is not found
   */
  async disconnectSource(id: string): Promise<EngagementSource> {
    this.logger.info(`Attempting to disconnect source ${id}`);
    try {
      // In a real implementation, this would be a POST request to the API
      // const response = await fetch(`${this.baseUrl}/${id}/disconnect`, { method: 'POST' });
      // if (!response.ok) throw new Error(`Failed to disconnect source: ${response.statusText}`);
      // return await response.json();

      // For now, we'll use the mock data from the repository
      const { EngagementRepository } = await import(
        "../../domain/engagement/repository"
      );
      const source = await this.getSourceById(id);
      if (!source) {
        const error = new ConnectionError(`Source with ID ${id} not found`, {
          sourceId: id,
        });
        this.logger.error(error.message, { error });
        throw error;
      }

      const updatedSource: EngagementSource = {
        ...source,
        isConnected: false,
      };

      const result = await EngagementRepository.updateSource(updatedSource);

      // Update the health status cache
      if (this.connectionHealthCache[id]) {
        delete this.connectionHealthCache[id]; // Remove from health cache since it's disconnected
      }

      this.logger.info(`Successfully disconnected source ${id}`);
      return result;
    } catch (error) {
      this.logger.error(`Error disconnecting engagement source ${id}:`, {
        error,
      });
      throw error;
    }
  }

  /**
   * Checks the health of a specific connection
   * Updates the health status cache with the result
   *
   * @param {string} id - The ID of the source to check
   * @returns {Promise<ConnectionHealthStatus>} A promise that resolves to the connection health status
   */

  async checkConnectionHealth(id: string): Promise<ConnectionHealthStatus> {
    this.logger.info(`Checking health of source ${id}`);
    try {
      const startTime = Date.now();

      // Get the source
      const source = await this.getSourceById(id);
      if (!source) {
        const status: ConnectionHealthStatus = {
          status: "error",
          lastChecked: new Date(),
          message: `Source with ID ${id} not found`,
        };
        this.connectionHealthCache[id] = status;
        return status;
      }

      if (!source.isConnected) {
        const status: ConnectionHealthStatus = {
          status: "error",
          lastChecked: new Date(),
          message: `Source ${id} is not connected`,
        };
        this.connectionHealthCache[id] = status;
        return status;
      }

      // In a real implementation, this would make an API call to check the health
      // const response = await fetch(`${this.baseUrl}/${id}/health`);
      // const healthData = await response.json();

      // For now, simulate a health check
      const endTime = Date.now();
      const latency = endTime - startTime;

      // Simulate occasional degraded performance
      const randomFactor = Math.random();
      let status: "healthy" | "degraded" | "error";
      let message: string;

      if (randomFactor > 0.9) {
        status = "degraded";
        message = `Connection to ${source.name} is experiencing high latency`;
      } else if (randomFactor > 0.95) {
        status = "error";
        message = `Connection to ${source.name} failed health check`;
      } else {
        status = "healthy";
        message = `Connection to ${source.name} is healthy`;
      }

      const healthStatus: ConnectionHealthStatus = {
        status,
        latency,
        lastChecked: new Date(),
        message,
        details: {
          sourceType: source.type,
          sourceName: source.name,
        },
      };

      // Cache the health status
      this.connectionHealthCache[id] = healthStatus;

      this.logger.info(`Health check for source ${id}: ${status}`, {
        healthStatus,
      });
      return healthStatus;
    } catch (error) {
      this.logger.error(`Error checking health of source ${id}:`, { error });

      const errorStatus: ConnectionHealthStatus = {
        status: "error",
        lastChecked: new Date(),
        message:
          error instanceof Error
            ? error.message
            : "Unknown error checking connection health",
        details: { error },
      };

      this.connectionHealthCache[id] = errorStatus;
      return errorStatus;
    }
  }

  /**
   * Checks the health of all connections
   * Updates the health status cache with the results
   *
   * @returns {Promise<Record<string, ConnectionHealthStatus>>} A promise that resolves to a record of connection health statuses by source ID
   */

  async checkAllConnectionsHealth(): Promise<
    Record<string, ConnectionHealthStatus>
  > {
    this.logger.info("Checking health of all sources");
    try {
      const sources = await this.getSources();
      const connectedSources = sources.filter((source) => source.isConnected);

      const healthPromises = connectedSources.map((source) =>
        this.checkConnectionHealth(source.id)
          .then((health) => ({ [source.id]: health }))
          .catch((error) => ({
            [source.id]: {
              status: "error" as const,
              lastChecked: new Date(),
              message: error instanceof Error ? error.message : "Unknown error",
              details: { error },
            },
          })),
      );

      const healthResults = await Promise.all(healthPromises);
      const combinedResults = healthResults.reduce(
        (acc, result) => ({ ...acc, ...result }),
        {},
      );

      return combinedResults;
    } catch (error) {
      this.logger.error("Error checking health of all sources:", { error });
      throw error;
    }
  }

  /**
   * Tests a connection with the provided settings without actually connecting
   * Validates the settings based on the source type and returns detailed results
   *
   * @param {SourceType} sourceType - The type of source to test
   * @param {Record<string, any>} settings - The settings to test with
   * @returns {Promise<{success: boolean, message: string, details?: Record<string, any>}>} A promise that resolves to a result object indicating success or failure
   */

  async testConnection(
    sourceType: SourceType,
    settings: Record<string, any>,
  ): Promise<{
    success: boolean;
    message: string;
    details?: Record<string, any>;
    missingFields?: string[];
    recommendedAction?: string;
  }> {
    this.logger.info(`Testing connection for ${sourceType}`, { settings });
    try {
      const startTime = Date.now();

      // In a real implementation, this would make an API call to test the connection
      // const response = await fetch(`${this.baseUrl}/test`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ sourceType, settings })
      // });
      // const testResult = await response.json();
      // return testResult;

      // For now, simulate a connection test with validation
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API call delay

      let success = true;
      let message = `Successfully tested connection to ${sourceType}`;
      let details: Record<string, any> = {};
      let missingFields: string[] = [];
      let recommendedAction: string | undefined;

      // Validate settings based on source type
      switch (sourceType) {
        case "email":
          if (!settings.provider) {
            success = false;
            missingFields.push("provider");
          }
          if (!settings.account) {
            success = false;
            missingFields.push("account");
          }

          if (missingFields.length > 0) {
            message = `Email connection failed: Missing required fields: ${missingFields.join(", ")}`;
            recommendedAction =
              "Please provide all required email connection details.";
          } else if (
            settings.provider &&
            !this.isValidEmailProvider(settings.provider)
          ) {
            success = false;
            message = `Unsupported email provider: ${settings.provider}`;
            recommendedAction =
              "Please use a supported email provider (Gmail, Outlook, Yahoo, etc).";
          } else if (settings.account && !this.isValidEmail(settings.account)) {
            success = false;
            message = `Invalid email format: ${settings.account}`;
            recommendedAction = "Please enter a valid email address.";
          }
          break;

        case "phone":
          if (!settings.provider) {
            success = false;
            missingFields.push("provider");
          }
          if (!settings.apiKey) {
            success = false;
            missingFields.push("apiKey");
          }

          if (missingFields.length > 0) {
            message = `Phone connection failed: Missing required fields: ${missingFields.join(", ")}`;
            recommendedAction =
              "Please provide all required phone system connection details.";
          } else if (settings.apiKey && settings.apiKey.length < 10) {
            success = false;
            message = "API key appears to be invalid (too short)";
            recommendedAction = "Please check your API key and try again.";
          }
          break;

        case "social":
          if (!settings.platform) {
            success = false;
            missingFields.push("platform");
          }
          if (!settings.apiKey) {
            success = false;
            missingFields.push("apiKey");
          }
          if (!settings.apiSecret) {
            success = false;
            missingFields.push("apiSecret");
          }
          if (!settings.account) {
            success = false;
            missingFields.push("account");
          }

          if (missingFields.length > 0) {
            message = `Social media connection failed: Missing required fields: ${missingFields.join(", ")}`;
            recommendedAction =
              "Please provide all required social media connection details.";
          } else if (
            settings.platform &&
            !this.isValidSocialPlatform(settings.platform)
          ) {
            success = false;
            message = `Unsupported social platform: ${settings.platform}`;
            recommendedAction =
              "Please use a supported social platform (Twitter, LinkedIn, Facebook, etc).";
          }
          break;

        case "recording":
          if (!settings.application) {
            success = false;
            missingFields.push("application");
          }
          if (!settings.apiKey) {
            success = false;
            missingFields.push("apiKey");
          }
          if (!settings.accountId) {
            success = false;
            missingFields.push("accountId");
          }

          if (missingFields.length > 0) {
            message = `Recording application connection failed: Missing required fields: ${missingFields.join(", ")}`;
            recommendedAction =
              "Please provide all required recording application connection details.";
          } else if (settings.webhook && !this.isValidUrl(settings.webhook)) {
            success = false;
            message = `Invalid webhook URL: ${settings.webhook}`;
            recommendedAction =
              "Please enter a valid webhook URL starting with http:// or https://.";
          }
          break;

        default:
          success = false;
          message = `Unknown source type: ${sourceType}`;
          recommendedAction = "Please select a valid source type.";
      }

      const endTime = Date.now();
      const latency = endTime - startTime;
      details.latency = latency;

      // Log the test result
      if (success) {
        this.logger.info(`Connection test successful for ${sourceType}`, {
          latency,
        });
      } else {
        this.logger.warn(
          `Connection test failed for ${sourceType}: ${message}`,
          { settings, missingFields, recommendedAction },
        );
      }

      return { success, message, details, missingFields, recommendedAction };
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Unknown error testing connection";
      this.logger.error(`Error testing connection for ${sourceType}:`, {
        error,
        settings,
      });

      return {
        success: false,
        message: errorMessage,
        details: { error },
        recommendedAction:
          "Please check your network connection and try again. If the problem persists, contact support.",
      };
    }
  }
}
