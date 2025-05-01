import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  LineChart,
  PieChart,
  Activity,
  Users,
  MessageSquare,
  Phone,
  Mail,
} from "lucide-react";

interface AnalyticsOverviewProps {
  channelMetrics?: {
    calls: number;
    emails: number;
    chats: number;
    texts: number;
  };
  teamPerformance?: Array<{
    name: string;
    interactions: number;
    responseTime: number;
    sentiment: number;
  }>;
  engagementTrends?: Array<{
    date: string;
    interactions: number;
  }>;
}

const AnalyticsOverview = ({
  channelMetrics = {
    calls: 124,
    emails: 89,
    chats: 67,
    texts: 45,
  },
  teamPerformance = [
    { name: "John Doe", interactions: 45, responseTime: 2.3, sentiment: 0.8 },
    { name: "Jane Smith", interactions: 38, responseTime: 1.8, sentiment: 0.7 },
    {
      name: "Mike Johnson",
      interactions: 52,
      responseTime: 3.1,
      sentiment: 0.6,
    },
    {
      name: "Sarah Williams",
      interactions: 29,
      responseTime: 2.5,
      sentiment: 0.9,
    },
  ],
  engagementTrends = [
    { date: "Jan 1", interactions: 45 },
    { date: "Jan 8", interactions: 52 },
    { date: "Jan 15", interactions: 49 },
    { date: "Jan 22", interactions: 63 },
    { date: "Jan 29", interactions: 58 },
    { date: "Feb 5", interactions: 71 },
    { date: "Feb 12", interactions: 68 },
  ],
}: AnalyticsOverviewProps) => {
  return (
    <Card className="w-full bg-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Analytics Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="channels">
          <TabsList className="mb-4">
            <TabsTrigger value="channels" className="flex items-center gap-1">
              <PieChart className="h-4 w-4" />
              Channel Metrics
            </TabsTrigger>
            <TabsTrigger value="team" className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              Team Performance
            </TabsTrigger>
            <TabsTrigger value="trends" className="flex items-center gap-1">
              <LineChart className="h-4 w-4" />
              Engagement Trends
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-1">
              <BarChart className="h-4 w-4" />
              Custom Reports
            </TabsTrigger>
          </TabsList>

          <TabsContent value="channels" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 flex flex-col items-center">
                  <div className="rounded-full bg-blue-100 p-3 mb-2">
                    <Phone className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-medium">Calls</h3>
                  <p className="text-3xl font-bold">{channelMetrics.calls}</p>
                  <p className="text-sm text-muted-foreground">Last 30 days</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 flex flex-col items-center">
                  <div className="rounded-full bg-green-100 p-3 mb-2">
                    <Mail className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="text-lg font-medium">Emails</h3>
                  <p className="text-3xl font-bold">{channelMetrics.emails}</p>
                  <p className="text-sm text-muted-foreground">Last 30 days</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 flex flex-col items-center">
                  <div className="rounded-full bg-purple-100 p-3 mb-2">
                    <MessageSquare className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-medium">Chats</h3>
                  <p className="text-3xl font-bold">{channelMetrics.chats}</p>
                  <p className="text-sm text-muted-foreground">Last 30 days</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 flex flex-col items-center">
                  <div className="rounded-full bg-orange-100 p-3 mb-2">
                    <MessageSquare className="h-6 w-6 text-orange-600" />
                  </div>
                  <h3 className="text-lg font-medium">Texts</h3>
                  <p className="text-3xl font-bold">{channelMetrics.texts}</p>
                  <p className="text-sm text-muted-foreground">Last 30 days</p>
                </CardContent>
              </Card>
            </div>

            <div className="h-64 bg-muted/20 rounded-md flex items-center justify-center">
              <div className="text-center">
                <PieChart className="h-10 w-10 mx-auto text-muted-foreground" />
                <p className="mt-2 text-muted-foreground">
                  Channel Distribution Chart
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="team">
            <div className="rounded-md border">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="p-3 text-left">Team Member</th>
                    <th className="p-3 text-left">Interactions</th>
                    <th className="p-3 text-left">Avg. Response Time (min)</th>
                    <th className="p-3 text-left">Sentiment Score</th>
                  </tr>
                </thead>
                <tbody>
                  {teamPerformance.map((member, index) => (
                    <tr key={index} className="border-b">
                      <td className="p-3">{member.name}</td>
                      <td className="p-3">{member.interactions}</td>
                      <td className="p-3">{member.responseTime}</td>
                      <td className="p-3">
                        <div className="flex items-center">
                          <div className="w-full bg-muted rounded-full h-2.5">
                            <div
                              className="bg-green-500 h-2.5 rounded-full"
                              style={{ width: `${member.sentiment * 100}%` }}
                            ></div>
                          </div>
                          <span className="ml-2">
                            {member.sentiment.toFixed(1)}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="trends">
            <div className="h-64 bg-muted/20 rounded-md flex items-center justify-center">
              <div className="text-center">
                <LineChart className="h-10 w-10 mx-auto text-muted-foreground" />
                <p className="mt-2 text-muted-foreground">
                  Engagement Trend Chart
                </p>
                <p className="text-xs text-muted-foreground">
                  Data points:{" "}
                  {engagementTrends.map((point) => point.date).join(", ")}
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="reports">
            <div className="space-y-4">
              <div className="bg-muted/20 p-6 rounded-md text-center">
                <BarChart className="h-10 w-10 mx-auto text-muted-foreground" />
                <h3 className="mt-2 font-medium">Custom Reports</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Generate custom reports based on your specific requirements
                </p>
                <button className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
                  Create New Report
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-medium">Weekly Summary</h4>
                    <p className="text-sm text-muted-foreground">
                      Last generated: Yesterday
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-medium">Customer Satisfaction</h4>
                    <p className="text-sm text-muted-foreground">
                      Last generated: 3 days ago
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-medium">Team Productivity</h4>
                    <p className="text-sm text-muted-foreground">
                      Last generated: 1 week ago
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AnalyticsOverview;
