import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { commandBus } from "@/infrastructure/cqrs/CommandBus";
import { queryBus } from "@/infrastructure/cqrs/QueryBus";

/**
 * CqrsDemoStoryboard demonstrates the Command Query Responsibility Segregation pattern
 * by showing separate paths for commands (writes) and queries (reads)
 */
export default function CqrsDemoStoryboard() {
  // Command state
  const [commandType, setCommandType] = useState("CreateInteraction");
  const [commandPayload, setCommandPayload] = useState(
    JSON.stringify(
      {
        sourceId: "demo-source-1",
        customer: "Acme Corp",
        type: "call",
        content: "Customer called about new features",
      },
      null,
      2,
    ),
  );
  const [commandResult, setCommandResult] = useState<any>(null);
  const [commandError, setCommandError] = useState<string | null>(null);

  // Query state
  const [queryType, setQueryType] = useState("GetInteractionById");
  const [queryParams, setQueryParams] = useState(
    JSON.stringify(
      {
        id: "interaction-1",
      },
      null,
      2,
    ),
  );
  const [queryResult, setQueryResult] = useState<any>(null);
  const [queryError, setQueryError] = useState<string | null>(null);

  // Command history
  const [commandHistory, setCommandHistory] = useState<
    Array<{
      type: string;
      timestamp: Date;
      success: boolean;
    }>
  >([]);

  // Query history
  const [queryHistory, setQueryHistory] = useState<
    Array<{
      type: string;
      timestamp: Date;
      success: boolean;
    }>
  >([]);

  // Execute a command
  const executeCommand = async () => {
    try {
      setCommandError(null);

      // Parse the command payload
      const payload = JSON.parse(commandPayload);

      // Create the command object
      const command = {
        type: commandType,
        payload,
      };

      // Register a mock handler if one doesn't exist
      if (!commandBus["handlers"].has(commandType)) {
        commandBus.registerHandler(commandType, {
          handle: async (cmd) => {
            console.log(`Handling command: ${cmd.type}`, cmd);
            // Simulate processing delay
            await new Promise((resolve) => setTimeout(resolve, 500));
            return { success: true, id: `demo-${Date.now()}` };
          },
        });
      }

      // Dispatch the command
      const result = await commandBus.dispatch(command);

      // Update state
      setCommandResult(result);
      setCommandHistory((prev) => [
        { type: commandType, timestamp: new Date(), success: true },
        ...prev,
      ]);
    } catch (error) {
      console.error("Command error:", error);
      setCommandError(error instanceof Error ? error.message : String(error));
      setCommandHistory((prev) => [
        { type: commandType, timestamp: new Date(), success: false },
        ...prev,
      ]);
    }
  };

  // Execute a query
  const executeQuery = async () => {
    try {
      setQueryError(null);

      // Parse the query parameters
      const parameters = JSON.parse(queryParams);

      // Create the query object
      const query = {
        type: queryType,
        parameters,
      };

      // Register a mock handler if one doesn't exist
      if (!queryBus["handlers"].has(queryType)) {
        queryBus.registerHandler(queryType, {
          handle: async (q) => {
            console.log(`Handling query: ${q.type}`, q);
            // Simulate processing delay
            await new Promise((resolve) => setTimeout(resolve, 500));

            // Return mock data based on query type
            if (q.type === "GetInteractionById") {
              return {
                id: q.parameters.id || "interaction-1",
                customer: "Acme Corp",
                type: "call",
                date: new Date().toISOString(),
                content: "Customer called about new features",
                sentiment: "positive",
              };
            }

            return { data: "Mock query result" };
          },
        });
      }

      // Dispatch the query
      const result = await queryBus.dispatch(query);

      // Update state
      setQueryResult(result);
      setQueryHistory((prev) => [
        { type: queryType, timestamp: new Date(), success: true },
        ...prev,
      ]);
    } catch (error) {
      console.error("Query error:", error);
      setQueryError(error instanceof Error ? error.message : String(error));
      setQueryHistory((prev) => [
        { type: queryType, timestamp: new Date(), success: false },
        ...prev,
      ]);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">CQRS Pattern Demo</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Command Side */}
        <Card>
          <CardHeader>
            <CardTitle>Command Side (Write)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="commandType">Command Type</Label>
                <Input
                  id="commandType"
                  value={commandType}
                  onChange={(e) => setCommandType(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="commandPayload">Command Payload (JSON)</Label>
                <textarea
                  id="commandPayload"
                  className="w-full h-32 p-2 border rounded font-mono text-sm"
                  value={commandPayload}
                  onChange={(e) => setCommandPayload(e.target.value)}
                />
              </div>

              <Button onClick={executeCommand} className="w-full">
                Execute Command
              </Button>

              {commandError && (
                <div className="p-2 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
                  {commandError}
                </div>
              )}

              {commandResult && (
                <div>
                  <Label>Result:</Label>
                  <pre className="p-2 bg-muted rounded text-xs overflow-auto">
                    {JSON.stringify(commandResult, null, 2)}
                  </pre>
                </div>
              )}

              <div>
                <Label>Command History:</Label>
                <ScrollArea className="h-32 border rounded">
                  <div className="p-2 space-y-2">
                    {commandHistory.map((cmd, i) => (
                      <div
                        key={i}
                        className="flex justify-between items-center text-xs p-1 border-b"
                      >
                        <span>{cmd.type}</span>
                        <div className="flex items-center gap-2">
                          <Badge
                            className={
                              cmd.success ? "bg-green-500" : "bg-red-500"
                            }
                          >
                            {cmd.success ? "Success" : "Failed"}
                          </Badge>
                          <span className="text-muted-foreground">
                            {cmd.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Query Side */}
        <Card>
          <CardHeader>
            <CardTitle>Query Side (Read)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="queryType">Query Type</Label>
                <Input
                  id="queryType"
                  value={queryType}
                  onChange={(e) => setQueryType(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="queryParams">Query Parameters (JSON)</Label>
                <textarea
                  id="queryParams"
                  className="w-full h-32 p-2 border rounded font-mono text-sm"
                  value={queryParams}
                  onChange={(e) => setQueryParams(e.target.value)}
                />
              </div>

              <Button onClick={executeQuery} className="w-full">
                Execute Query
              </Button>

              {queryError && (
                <div className="p-2 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
                  {queryError}
                </div>
              )}

              {queryResult && (
                <div>
                  <Label>Result:</Label>
                  <pre className="p-2 bg-muted rounded text-xs overflow-auto">
                    {JSON.stringify(queryResult, null, 2)}
                  </pre>
                </div>
              )}

              <div>
                <Label>Query History:</Label>
                <ScrollArea className="h-32 border rounded">
                  <div className="p-2 space-y-2">
                    {queryHistory.map((query, i) => (
                      <div
                        key={i}
                        className="flex justify-between items-center text-xs p-1 border-b"
                      >
                        <span>{query.type}</span>
                        <div className="flex items-center gap-2">
                          <Badge
                            className={
                              query.success ? "bg-green-500" : "bg-red-500"
                            }
                          >
                            {query.success ? "Success" : "Failed"}
                          </Badge>
                          <span className="text-muted-foreground">
                            {query.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <p className="text-sm text-muted-foreground">
          This demo illustrates the CQRS pattern, which separates read and write
          operations. Commands change state but return minimal information,
          while queries retrieve data without modifying state. This separation
          allows for independent scaling and optimization of read and write
          paths.
        </p>
      </div>
    </div>
  );
}
