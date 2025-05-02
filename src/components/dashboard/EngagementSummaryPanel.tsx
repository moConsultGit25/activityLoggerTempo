import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { format, subDays } from "date-fns";
import {
  AlertCircle,
  CalendarIcon,
  CheckCircle,
  Clock,
  Filter,
  Loader2,
  Mail,
  MessageSquare,
  Phone,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import { DateRange } from "react-day-picker";
import { useInteractions } from "@/hooks/useInteractions";
import { Interaction } from "@/domain/engagement/types";

const EngagementSummaryPanel = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 7),
    to: new Date(),
  });
  const [isAllTime, setIsAllTime] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [customerFilter, setCustomerFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [sentimentFilter, setSentimentFilter] = useState<string>("all");

  const { interactions, loading, error, filterInteractions } =
    useInteractions();

  const filteredInteractions = filterInteractions({
    searchQuery,
    dateRange: isAllTime ? undefined : dateRange,
    customer: customerFilter,
    type: typeFilter,
    sentiment: sentimentFilter,
  });

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return <ThumbsUp className="h-4 w-4 text-green-500" />;
      case "negative":
        return <ThumbsDown className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "call":
        return <Phone className="h-4 w-4" />;
      case "email":
        return <Mail className="h-4 w-4" />;
      case "chat":
      case "text":
        return <MessageSquare className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const handleApplyFilters = () => {
    // Filters are already applied through the filterInteractions call
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <Card className="w-full bg-white">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle>Engagement Summary</CardTitle>
          <div className="flex gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <Filter className="h-4 w-4" />
                  Filter
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium leading-none">Date Range</h4>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="all-time"
                          checked={isAllTime}
                          onCheckedChange={(checked) => {
                            setIsAllTime(checked);
                          }}
                        />
                        <Label htmlFor="all-time">All Time</Label>
                      </div>

                      {!isAllTime && (
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start text-left font-normal"
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {dateRange?.from ? (
                                dateRange.to ? (
                                  <>
                                    {format(dateRange.from, "LLL dd, y")} -{" "}
                                    {format(dateRange.to, "LLL dd, y")}
                                  </>
                                ) : (
                                  format(dateRange.from, "LLL dd, y")
                                )
                              ) : (
                                <span>Pick a date range</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              initialFocus
                              mode="range"
                              defaultMonth={dateRange?.from}
                              selected={dateRange}
                              onSelect={setDateRange}
                              numberOfMonths={2}
                            />
                          </PopoverContent>
                        </Popover>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium leading-none">Customer</h4>
                    <Select
                      value={customerFilter}
                      onValueChange={setCustomerFilter}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select customer" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Customers</SelectItem>
                        <SelectItem value="Acme Corp">Acme Corp</SelectItem>
                        <SelectItem value="TechStart Inc">
                          TechStart Inc
                        </SelectItem>
                        <SelectItem value="Global Services LLC">
                          Global Services LLC
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium leading-none">
                      Interaction Type
                    </h4>
                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="call">Calls</SelectItem>
                        <SelectItem value="email">Emails</SelectItem>
                        <SelectItem value="chat">Chats</SelectItem>
                        <SelectItem value="text">Texts</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium leading-none">Sentiment</h4>
                    <Select
                      value={sentimentFilter}
                      onValueChange={setSentimentFilter}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select sentiment" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="positive">Positive</SelectItem>
                        <SelectItem value="neutral">Neutral</SelectItem>
                        <SelectItem value="negative">Negative</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={handleApplyFilters}>Apply Filters</Button>
                </div>
              </PopoverContent>
            </Popover>
            <Input
              placeholder="Search interactions..."
              className="max-w-xs"
              type="search"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading && (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Loading interactions...</span>
          </div>
        )}

        {error && (
          <div className="flex justify-center items-center py-8 text-destructive">
            <AlertCircle className="h-6 w-6 mr-2" />
            <span>{error}</span>
          </div>
        )}

        {!loading && !error && filteredInteractions.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p>No interactions found matching your filters.</p>
          </div>
        )}

        {!loading && !error && filteredInteractions.length > 0 && (
          <Tabs defaultValue="recent">
            <TabsList className="mb-4">
              <TabsTrigger value="recent">Recent Interactions</TabsTrigger>
              <TabsTrigger value="action">Action Items</TabsTrigger>
              <TabsTrigger value="followup">Follow-ups</TabsTrigger>
            </TabsList>
            <TabsContent value="recent">
              <div className="space-y-4">
                {filteredInteractions.map((interaction) => (
                  <div
                    key={interaction.id}
                    className="border rounded-lg p-4 hover:bg-slate-50"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <div className="bg-slate-100 p-2 rounded-full">
                          {getTypeIcon(interaction.type)}
                        </div>
                        <div>
                          <h3 className="font-medium">
                            {interaction.customer}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {format(interaction.date, "MMM d, yyyy")}
                            {interaction.duration &&
                              ` • ${interaction.duration}`}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            interaction.sentiment === "positive"
                              ? "default"
                              : interaction.sentiment === "negative"
                                ? "destructive"
                                : "outline"
                          }
                          className="flex items-center gap-1"
                        >
                          {getSentimentIcon(interaction.sentiment)}
                          {interaction.sentiment.charAt(0).toUpperCase() +
                            interaction.sentiment.slice(1)}
                        </Badge>
                        {interaction.followUp && (
                          <Badge
                            variant="outline"
                            className="flex items-center gap-1"
                          >
                            <Clock className="h-3 w-3" />
                            Follow-up: {format(interaction.followUp, "MMM d")}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <p className="text-sm mb-3">{interaction.summary}</p>
                    {interaction.actionItems.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium mb-1">
                          Action Items:
                        </h4>
                        <ul className="text-sm space-y-1">
                          {interaction.actionItems.map((item, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <div className="flex justify-end mt-4 gap-2">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                      <Button size="sm">Mark Complete</Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="action">
              <div className="space-y-4">
                {filteredInteractions.flatMap((interaction) =>
                  interaction.actionItems.map((item, index) => (
                    <div
                      key={`${interaction.id}-${index}`}
                      className="border rounded-lg p-4 hover:bg-slate-50"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-5 w-5 text-green-500" />
                          <div>
                            <h3 className="font-medium">{item}</h3>
                            <p className="text-sm text-muted-foreground">
                              {interaction.customer}
                            </p>
                          </div>
                        </div>
                        <Badge variant="outline">
                          {format(interaction.date, "MMM d, yyyy")}
                        </Badge>
                      </div>
                      <div className="flex justify-end mt-4 gap-2">
                        <Button variant="outline" size="sm">
                          View Interaction
                        </Button>
                        <Button size="sm">Complete</Button>
                      </div>
                    </div>
                  )),
                )}
              </div>
            </TabsContent>
            <TabsContent value="followup">
              <div className="space-y-4">
                {filteredInteractions
                  .filter((interaction) => interaction.followUp)
                  .map((interaction) => (
                    <div
                      key={interaction.id}
                      className="border rounded-lg p-4 hover:bg-slate-50"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <div className="bg-slate-100 p-2 rounded-full">
                            <Clock className="h-4 w-4" />
                          </div>
                          <div>
                            <h3 className="font-medium">
                              {interaction.customer}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              Follow-up on{" "}
                              {format(interaction.followUp!, "MMM d, yyyy")}
                            </p>
                          </div>
                        </div>
                        <Badge
                          variant={
                            interaction.sentiment === "positive"
                              ? "default"
                              : interaction.sentiment === "negative"
                                ? "destructive"
                                : "outline"
                          }
                        >
                          {interaction.sentiment.charAt(0).toUpperCase() +
                            interaction.sentiment.slice(1)}
                        </Badge>
                      </div>
                      <p className="text-sm mb-3">{interaction.summary}</p>
                      <div className="flex justify-end mt-4 gap-2">
                        <Button variant="outline" size="sm">
                          Reschedule
                        </Button>
                        <Button size="sm">Complete Follow-up</Button>
                      </div>
                    </div>
                  ))}
              </div>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
};

export default EngagementSummaryPanel;
