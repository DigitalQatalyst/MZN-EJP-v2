import { providers } from "./mockData";
import {
  mockFinancialServices,
  mockNonFinancialServices,
} from "./mockMarketplaceData";
// Generic fallback items that can be used when API returns no results
export const getFallbackItems = (marketplaceType: string) => {
  switch (marketplaceType) {
    case "courses":
      return [
        {
          id: "fallback-1",
          title: "Business Strategy Fundamentals",
          description:
            "Learn essential business strategy concepts and frameworks to drive your organization forward.",
          provider: providers[0],
          category: "Strategy",
          deliveryMode: "Online",
          businessStage: "Growth",
          duration: "4 weeks",
          startDate: "Next intake: March 15, 2024",
          tags: ["Strategy", "Online", "Growth"],
        },
        {
          id: "fallback-2",
          title: "Digital Marketing Essentials",
          description:
            "Master the fundamentals of digital marketing to grow your business online presence and reach.",
          provider: providers[1],
          category: "Marketing",
          deliveryMode: "Hybrid",
          businessStage: "Conception",
          duration: "6 weeks",
          startDate: "Next intake: April 1, 2024",
          tags: ["Marketing", "Hybrid", "Conception"],
        },
        {
          id: "fallback-3",
          title: "Financial Management for Entrepreneurs",
          description:
            "Develop financial literacy and management skills essential for business success and growth.",
          provider: providers[2],
          category: "Finance",
          deliveryMode: "In-person",
          businessStage: "Maturity",
          duration: "3 weeks",
          startDate: "Next intake: March 10, 2024",
          tags: ["Finance", "In-person", "Maturity"],
        },
      ];
    case "financial":
      return mockFinancialServices.slice(0, 3);
    case "non-financial":
      return mockNonFinancialServices.slice(0, 3);
    default:
      return [];
  }
};
// Fallback item details that can be used when API returns no specific item
export const getFallbackItemDetails = (
  marketplaceType: string,
  itemId: string
) => {
  const fallbackItems = getFallbackItems(marketplaceType);
  const fallbackItem = fallbackItems.find((item) => item.id === itemId);
  if (fallbackItem) {
    return fallbackItem;
  }
  // Return a generic fallback item if no matching item is found
  return {
    id: "generic-fallback",
    title: "Sample Service",
    description:
      "This is a sample service description that appears when the requested item cannot be found.",
    provider: providers[0],
    category: marketplaceType === "courses" ? "General" : "Service",
    deliveryMode: marketplaceType === "courses" ? "Online" : undefined,
    businessStage: "All Stages",
    duration: "4 weeks",
    startDate: "Available now",
    processingTime: marketplaceType === "financial" ? "3 weeks" : undefined,
    tags: ["Sample", "Fallback"],
    details: [
      "Feature 1: Sample feature description",
      "Feature 2: Another sample feature",
      "Feature 3: Yet another feature",
    ],
    learningOutcomes: [
      "Outcome 1: Sample learning outcome",
      "Outcome 2: Another learning outcome",
      "Outcome 3: Final learning outcome",
    ],
  };
};
