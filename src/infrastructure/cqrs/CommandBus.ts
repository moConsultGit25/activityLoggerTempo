/**
 * Command Bus Implementation
 *
 * This module implements a command bus for handling commands in a CQRS architecture.
 * It decouples command senders from handlers and provides a central point for command processing.
 */

/**
 * Command interface represents an intent to change the system state
 */
export interface Command {
  type: string;
  payload: Record<string, any>;
}

/**
 * CommandHandler interface defines the contract for handling commands
 */
export interface CommandHandler<T extends Command> {
  handle(command: T): Promise<any>;
}

/**
 * CommandBus class manages command registration and dispatching
 */
export class CommandBus {
  private handlers: Map<string, CommandHandler<any>> = new Map();

  /**
   * Registers a handler for a specific command type
   * @param commandType The type of command to register a handler for
   * @param handler The handler function for the command
   */
  registerHandler<T extends Command>(
    commandType: string,
    handler: CommandHandler<T>,
  ): void {
    if (this.handlers.has(commandType)) {
      console.warn(
        `Handler for command type '${commandType}' is being overwritten`,
      );
    }

    this.handlers.set(commandType, handler);
    console.log(`Registered handler for command type: ${commandType}`);
  }

  /**
   * Dispatches a command to its registered handler
   * @param command The command to dispatch
   * @returns The result of the command handling
   * @throws Error if no handler is registered for the command type
   */
  async dispatch<T extends Command>(command: T): Promise<any> {
    const handler = this.handlers.get(command.type);

    if (!handler) {
      throw new Error(
        `No handler registered for command type: ${command.type}`,
      );
    }

    console.log(`Dispatching command: ${command.type}`, command);
    try {
      const result = await handler.handle(command);
      console.log(`Command handled successfully: ${command.type}`);
      return result;
    } catch (error) {
      console.error(`Error handling command ${command.type}:`, error);
      throw error;
    }
  }

  /**
   * Removes a handler for a specific command type
   * @param commandType The type of command to unregister the handler for
   */
  unregisterHandler(commandType: string): void {
    this.handlers.delete(commandType);
    console.log(`Unregistered handler for command type: ${commandType}`);
  }
}

// Singleton instance of the command bus
export const commandBus = new CommandBus();
