/**
 * Mock Interaction Repository
 *
 * This class provides a mock implementation of the InteractionRepository interface
 * for testing, storyboards, and development purposes. It simulates API delays and
 * implements filtering functionality similar to what would be available in a real backend.
 *
 * Following DDD principles, this repository maintains the same interface as the real
 * repository, allowing for easy substitution in different environments.
 */

import {
  InteractionRepository,
  InteractionFilters,
} from "../../domain/engagement/interfaces";
import { Interaction } from "../../domain/engagement/types";
export class MockInteractionRepository implements InteractionRepository {
  /**
   * Mock interaction data with dynamically calculated dates
   * This provides realistic test data for development and testing purposes
   */
  private mockInteractions: Interaction[] = [
    {
      id: "mock-1",
      sourceId: "1",
      type: "call",
      customer: "Acme Corp",
      date: new Date(),
      duration: "15:30",
      sentiment: "positive",
      summary:
        "Customer was very satisfied with the new features and discussed potential expansion.",
      actionItems: [
        "Send follow-up email",
        "Schedule demo for next week",
        "Prepare pricing proposal",
      ],
      followUp: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      content:
        "Customer: I'm really impressed with the new dashboard.\n\nAgent: Thank you! We've been working hard on improving it.\n\nCustomer: We're considering rolling this out to our entire team. What would pricing look like for 50 users?\n\nAgent: For that volume, we could offer a 15% discount on our enterprise plan. I'll send you a detailed proposal tomorrow.",
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(),
      highlights: [
        {
          id: "h1",
          type: "key_moment",
          text: "impressed with the new dashboard",
          position: 25,
        },
        {
          id: "h2",
          type: "key_moment",
          text: "considering rolling this out to our entire team",
          position: 120,
        },
        {
          id: "h3",
          type: "commitment",
          text: "I'll send you a detailed proposal tomorrow",
          position: 250,
        },
      ],
    },
    {
      id: "mock-2",
      sourceId: "2",
      type: "email",
      customer: "TechStart Inc",
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      sentiment: "neutral",
      summary:
        "Customer had questions about pricing and API integration capabilities.",
      actionItems: [
        "Send pricing sheet",
        "Schedule technical call with engineering",
        "Share API documentation",
      ],
      content:
        "Subject: Pricing Questions and API Integration\n\nHello Support Team,\n\nWe're evaluating your platform for our company. Could you please send me your current pricing information for 25 users? Also, we need to understand how your API integrates with our existing systems.\n\nThanks,\nSarah Johnson\nCTO, TechStart Inc",
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      highlights: [
        {
          id: "h4",
          type: "key_moment",
          text: "evaluating your platform for our company",
          position: 40,
        },
        {
          id: "h5",
          type: "key_moment",
          text: "pricing information for 25 users",
          position: 120,
        },
        {
          id: "h6",
          type: "concern",
          text: "how your API integrates with our existing systems",
          position: 180,
        },
      ],
    },
    {
      id: "mock-3",
      sourceId: "3",
      type: "chat",
      customer: "Global Services LLC",
      date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      sentiment: "negative",
      summary:
        "Customer experienced issues with the reporting module and requested urgent assistance.",
      actionItems: [
        "Escalate to engineering team",
        "Provide temporary workaround",
        "Schedule follow-up call tomorrow",
      ],
      followUp: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // tomorrow
      content:
        "Customer: We're having serious issues with the reporting module. None of our custom reports are loading.\n\nAgent: I'm sorry to hear that. When did you first notice this issue?\n\nCustomer: It started about an hour ago. This is critical for our end-of-month reporting.\n\nAgent: I understand the urgency. Let me escalate this to our engineering team right away. In the meantime, would exporting the raw data to Excel work as a temporary solution?\n\nCustomer: That's not ideal but it would help us get by. Please have someone fix this ASAP.",
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      highlights: [
        {
          id: "h7",
          type: "concern",
          text: "serious issues with the reporting module",
          position: 25,
        },
        {
          id: "h8",
          type: "concern",
          text: "critical for our end-of-month reporting",
          position: 150,
        },
        {
          id: "h9",
          type: "commitment",
          text: "escalate this to our engineering team right away",
          position: 220,
        },
        {
          id: "h10",
          type: "key_moment",
          text: "exporting the raw data to Excel work as a temporary solution",
          position: 280,
        },
      ],
    },
    {
      id: "mock-4",
      sourceId: "4",
      type: "text",
      customer: "Innovate Media",
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      sentiment: "positive",
      summary:
        "Customer confirmed successful onboarding and praised the support team.",
      actionItems: [
        "Check in next week",
        "Send user guide for advanced features",
      ],
      content:
        "Customer: Just wanted to let you know that the onboarding went smoothly. Your team was very helpful!\n\nAgent: That's great to hear! Is there anything else you need help with?\n\nCustomer: Not at the moment, but I'll reach out if we have questions as we explore more features.\n\nAgent: Perfect. I'll send over our guide for advanced features that might be useful as you get more familiar with the platform.",
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      highlights: [
        {
          id: "h11",
          type: "key_moment",
          text: "onboarding went smoothly",
          position: 30,
        },
        {
          id: "h12",
          type: "key_moment",
          text: "team was very helpful",
          position: 65,
        },
        {
          id: "h13",
          type: "commitment",
          text: "send over our guide for advanced features",
          position: 220,
        },
      ],
    },
    {
      id: "mock-5",
      sourceId: "5",
      type: "call",
      customer: "First National Bank",
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      duration: "42:15",
      sentiment: "neutral",
      summary:
        "Detailed discussion about security compliance requirements and necessary documentation.",
      actionItems: [
        "Send SOC 2 report",
        "Schedule call with security team",
        "Provide encryption documentation",
      ],
      followUp: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      content:
        "Customer: We need to complete our security review before proceeding with the implementation.\n\nAgent: Understood. What specific documentation do you require?\n\nCustomer: We'll need your SOC 2 report, details on your encryption standards, and information about your data retention policies.\n\nAgent: We can provide all of that. Our SOC 2 report was just updated last month. I'll send that over today and arrange a call with our security team to address any specific questions.",
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      highlights: [
        {
          id: "h14",
          type: "key_moment",
          text: "security review before proceeding with the implementation",
          position: 35,
        },
        {
          id: "h15",
          type: "key_moment",
          text: "SOC 2 report, details on your encryption standards, and information about your data retention policies",
          position: 150,
        },
        {
          id: "h16",
          type: "commitment",
          text: "send that over today and arrange a call with our security team",
          position: 320,
        },
      ],
    },
    {
      id: "mock-6",
      sourceId: "6",
      type: "email",
      customer: "Retail Solutions Co",
      date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
      sentiment: "positive",
      summary:
        "Customer requested a feature enhancement for retail-specific reporting.",
      actionItems: [
        "Add feature request to roadmap",
        "Share current workaround",
        "Update customer on timeline",
      ],
      content:
        "Subject: Feature Request - Retail-Specific Reporting\n\nHi Team,\n\nWe've been using your platform for our customer service department and it's been working great. We'd like to request a feature enhancement for retail-specific reporting that would help us track in-store vs. online customer interactions more effectively.\n\nIs this something that could be added to your roadmap?\n\nBest regards,\nMichael Chen\nCustomer Experience Director\nRetail Solutions Co",
      createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      highlights: [
        {
          id: "h17",
          type: "key_moment",
          text: "been working great",
          position: 110,
        },
        {
          id: "h18",
          type: "key_moment",
          text: "request a feature enhancement for retail-specific reporting",
          position: 140,
        },
        {
          id: "h19",
          type: "key_moment",
          text: "track in-store vs. online customer interactions more effectively",
          position: 210,
        },
      ],
    },
    {
      id: "mock-7",
      sourceId: "7",
      type: "chat",
      customer: "Healthcare Systems Inc",
      date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 6 days ago
      sentiment: "negative",
      summary:
        "Customer reported HIPAA compliance concerns with the current data handling process.",
      actionItems: [
        "Review data handling procedures",
        "Schedule call with compliance officer",
        "Provide updated documentation",
      ],
      followUp: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
      content:
        "Customer: We have concerns about how patient data is being handled in your system.\n\nAgent: I understand that HIPAA compliance is critical for your organization. Could you specify your concerns?\n\nCustomer: The audit logs don't show who accessed specific records, which is required for our compliance.\n\nAgent: Thank you for bringing this to our attention. This is definitely something we need to address. I'll have our compliance team review this immediately and get back to you with a solution.",
      createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
      highlights: [
        {
          id: "h20",
          type: "concern",
          text: "concerns about how patient data is being handled",
          position: 20,
        },
        {
          id: "h21",
          type: "concern",
          text: "audit logs don't show who accessed specific records",
          position: 130,
        },
        {
          id: "h22",
          type: "commitment",
          text: "have our compliance team review this immediately",
          position: 280,
        },
      ],
    },
    {
      id: "mock-8",
      sourceId: "8",
      type: "text",
      customer: "EdTech Platforms",
      date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      sentiment: "neutral",
      summary: "Quick question about API rate limits for the education plan.",
      actionItems: ["Confirm rate limits", "Send API documentation"],
      content:
        "Customer: Quick question - what are the API rate limits for the education plan?\n\nAgent: For education plans, the standard limit is 10,000 requests per day. Is that sufficient for your needs?\n\nCustomer: That should work for now. Can it be increased if needed later?\n\nAgent: Yes, we can adjust the limits as your usage grows. Just reach out when you need an increase.",
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      highlights: [
        {
          id: "h23",
          type: "key_moment",
          text: "API rate limits for the education plan",
          position: 25,
        },
        {
          id: "h24",
          type: "key_moment",
          text: "standard limit is 10,000 requests per day",
          position: 90,
        },
        {
          id: "h25",
          type: "commitment",
          text: "can adjust the limits as your usage grows",
          position: 180,
        },
      ],
    },
    {
      id: "mock-9",
      sourceId: "9",
      type: "call",
      customer: "Mountain Outfitters",
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      duration: "28:45",
      sentiment: "positive",
      summary:
        "Quarterly review call with discussion of expanded usage and new features.",
      actionItems: [
        "Send quarterly usage report",
        "Schedule demo of new features",
        "Discuss renewal options",
      ],
      followUp: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
      content:
        "Agent: Thanks for joining our quarterly review call. How has your experience been with the platform?\n\nCustomer: Overall very positive. Our customer service team has seen a 20% improvement in response times.\n\nAgent: That's fantastic to hear! We've just released some new features that might help you improve even further.\n\nCustomer: I'd be interested in seeing those. Also, our contract is up for renewal next quarter, so we should discuss options.\n\nAgent: Absolutely. I'll schedule a demo of the new features and prepare some renewal options for you to consider.",
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      highlights: [
        {
          id: "h26",
          type: "key_moment",
          text: "20% improvement in response times",
          position: 120,
        },
        {
          id: "h27",
          type: "key_moment",
          text: "contract is up for renewal next quarter",
          position: 220,
        },
        {
          id: "h28",
          type: "commitment",
          text: "schedule a demo of the new features and prepare some renewal options",
          position: 310,
        },
      ],
    },
    {
      id: "mock-10",
      sourceId: "10",
      type: "email",
      customer: "City Government Office",
      date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
      sentiment: "neutral",
      summary:
        "Request for information about government-specific compliance features.",
      actionItems: [
        "Send government compliance documentation",
        "Connect with government solutions specialist",
      ],
      content:
        "Subject: Government Compliance Features\n\nHello,\n\nOur city government is evaluating your platform for our citizen engagement department. Do you have specific features or documentation related to government compliance requirements such as FISMA?\n\nRegards,\nDirector of IT\nCity Government Office",
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      highlights: [
        {
          id: "h29",
          type: "key_moment",
          text: "evaluating your platform for our citizen engagement department",
          position: 50,
        },
        {
          id: "h30",
          type: "key_moment",
          text: "government compliance requirements such as FISMA",
          position: 150,
        },
      ],
    },
  ];

  /**
   * Retrieves interactions with optional filtering
   * @param filters - Optional criteria to filter interactions
   * @returns Promise resolving to filtered interactions array
   */
  async getInteractions(filters?: InteractionFilters): Promise<Interaction[]> {
    // Simulate API delay for realistic testing
    await new Promise((resolve) => setTimeout(resolve, 500));

    let interactions = [...this.mockInteractions];

    // Apply filters if provided
    if (filters) {
      // Text search across multiple fields
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        interactions = interactions.filter(
          (i) =>
            i.customer.toLowerCase().includes(query) ||
            i.summary.toLowerCase().includes(query) ||
            i.content.toLowerCase().includes(query),
        );
      }

      // Filter by interaction type
      if (filters.type && filters.type !== "all") {
        interactions = interactions.filter((i) => i.type === filters.type);
      }

      // Filter by sentiment
      if (filters.sentiment && filters.sentiment !== "all") {
        interactions = interactions.filter(
          (i) => i.sentiment === filters.sentiment,
        );
      }

      // Filter by date range if provided
      if (filters.dateRange) {
        interactions = interactions.filter(
          (i) =>
            i.date >= filters.dateRange!.startDate &&
            i.date <= filters.dateRange!.endDate,
        );
      }

      // Filter by specific date if provided
      if (filters.date) {
        interactions = interactions.filter(
          (i) => i.date.toDateString() === filters.date!.toDateString(),
        );
      }

      // Filter by source ID if provided
      if (filters.sourceId) {
        interactions = interactions.filter(
          (i) => i.sourceId === filters.sourceId,
        );
      }
    }

    return interactions;
  }

  async getInteractionById(id: string): Promise<Interaction | null> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    const interaction = this.mockInteractions.find((i) => i.id === id);
    return interaction ? { ...interaction } : null;
  }

  async createInteraction(
    interaction: Omit<Interaction, "id" | "createdAt" | "updatedAt">,
  ): Promise<Interaction> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 700));

    const newInteraction: Interaction = {
      ...(interaction as any),
      id: `mock-${Math.random().toString(36).substring(2, 9)}`,
    };

    this.mockInteractions.push(newInteraction);
    return { ...newInteraction };
  }

  async updateInteraction(interaction: Interaction): Promise<Interaction> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const index = this.mockInteractions.findIndex(
      (i) => i.id === interaction.id,
    );
    if (index >= 0) {
      this.mockInteractions[index] = { ...interaction };
    }

    return { ...interaction };
  }

  async deleteInteraction(id: string): Promise<boolean> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 400));

    const index = this.mockInteractions.findIndex((i) => i.id === id);
    if (index >= 0) {
      this.mockInteractions.splice(index, 1);
      return true;
    }

    return false;
  }
}
