/**
 * Query Bus Implementation
 *
 * This module implements a query bus for handling queries in a CQRS architecture.
 * It decouples query senders from handlers and provides a central point for query processing.
 */

/**
 * Query interface represents a request for information without changing state
 */
export interface Query {
  type: string;
  parameters: Record<string, any>;
}

/**
 * QueryHandler interface defines the contract for handling queries
 */
export interface QueryHandler<T extends Query, R> {
  handle(query: T): Promise<R>;
}

/**
 * QueryBus class manages query registration and dispatching
 */
export class QueryBus {
  private handlers: Map<string, QueryHandler<any, any>> = new Map();

  /**
   * Registers a handler for a specific query type
   * @param queryType The type of query to register a handler for
   * @param handler The handler function for the query
   */
  registerHandler<T extends Query, R>(
    queryType: string,
    handler: QueryHandler<T, R>,
  ): void {
    if (this.handlers.has(queryType)) {
      console.warn(
        `Handler for query type '${queryType}' is being overwritten`,
      );
    }

    this.handlers.set(queryType, handler);
    console.log(`Registered handler for query type: ${queryType}`);
  }

  /**
   * Dispatches a query to its registered handler
   * @param query The query to dispatch
   * @returns The result of the query handling
   * @throws Error if no handler is registered for the query type
   */
  async dispatch<T extends Query, R>(query: T): Promise<R> {
    const handler = this.handlers.get(query.type) as QueryHandler<T, R>;

    if (!handler) {
      throw new Error(`No handler registered for query type: ${query.type}`);
    }

    console.log(`Dispatching query: ${query.type}`, query);
    try {
      const result = await handler.handle(query);
      console.log(`Query handled successfully: ${query.type}`);
      return result;
    } catch (error) {
      console.error(`Error handling query ${query.type}:`, error);
      throw error;
    }
  }

  /**
   * Removes a handler for a specific query type
   * @param queryType The type of query to unregister the handler for
   */
  unregisterHandler(queryType: string): void {
    this.handlers.delete(queryType);
    console.log(`Unregistered handler for query type: ${queryType}`);
  }
}

// Singleton instance of the query bus
export const queryBus = new QueryBus();
