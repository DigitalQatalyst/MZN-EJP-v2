import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import {
  BookmarkIcon,
  ScaleIcon,
  Clock,
  Calendar,
  DollarSign,
  MapPin,
  ArrowLeftIcon,
  StarIcon,
  CheckCircleIcon,
  ExternalLinkIcon,
  ChevronRightIcon,
  HomeIcon,
  FileText,
  BuildingIcon,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  XIcon,
  Target,
  Award,
  TrendingUp,
  BookOpen,
} from "lucide-react";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { getMarketplaceConfig } from "../../utils/marketplaceConfiguration";
import {
  fetchMarketplaceItemDetails,
  fetchRelatedMarketplaceItems,
} from "../../services/marketplace";
import { ErrorDisplay } from "../../components/SkeletonLoader";
import { Link } from "react-router-dom";
import {
  getFallbackItemDetails,
  getFallbackItems,
} from "../../utils/fallbackData";
import { useQuery } from "@apollo/client/react";
import GETPRODUCT from "../../utils/queries";
interface MarketplaceDetailsPageProps {
  marketplaceType: "courses" | "financial" | "non-financial";
  bookmarkedItems?: string[];
  onToggleBookmark?: (itemId: string) => void;
  onAddToComparison?: (item: any) => void;
}
const MarketplaceDetailsPage: React.FC<MarketplaceDetailsPageProps> = ({
  marketplaceType,
  bookmarkedItems = [],
  onToggleBookmark = () => {},
  onAddToComparison = () => {},
}) => {
  const { itemId } = useParams<{
    itemId: string;
  }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const shouldTakeAction = searchParams.get("action") === "true";
  const config = getMarketplaceConfig(marketplaceType);
  const [item, setItem] = useState<any | null>(null);
  const [relatedItems, setRelatedItems] = useState<any[]>([]);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showTabsMenu, setShowTabsMenu] = useState(false);
  const [showNavigation, setShowNavigation] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isFloatingCardVisible, setIsFloatingCardVisible] = useState(true);
  const [showStickyBottomCTA, setShowStickyBottomCTA] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(80);
  const [redirectTimer, setRedirectTimer] = useState<NodeJS.Timeout | null>(
    null
  );
  const mainContentRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const summaryCardRef = useRef<HTMLDivElement>(null);
  // Apollo useQuery is already initialized above via useQuery(GETPRODUCT,...)
  const {
    data: gqlData,
    error: gqlError,
    refetch,
  } = useQuery(GETPRODUCT, {
    variables: { id: itemId || "" },
    skip: !itemId,
  });

  // Helper: map GraphQL product to the UI's expected item shape
  const mapProductToItem = (product: any) => {
    if (!product) return null;
    const cf = (product as any).customFields || {};
    return {
      id: product.id,
      title: product.name,
      description: product.description,
      category: cf.Industry,
      businessStage: cf.BusinessStage,
      serviceType: cf.CustomerType,
      price: cf.Cost,
      processingTime: cf.ProcessingTime,
      amount: cf.Cost, // fallback for financial CTA amount
      details: Array.isArray(cf.Steps)
        ? cf.Steps
        : cf.TermsOfService
        ? [cf.TermsOfService]
        : [],
      requiredDocuments: Array.isArray(cf.RequiredDocuments)
        ? cf.RequiredDocuments
        : [],
      keyTerms: Array.isArray(cf.TermsOfService)
        ? cf.TermsOfService.join(", ")
        : cf.TermsOfService,
      tags: [cf.Industry, cf.CustomerType, cf.BusinessStage].filter(Boolean),
      // Defaults to keep UI stable
      provider: {
        name: "Service Provider",
        logoUrl: "/image.png",
      },
      providerLocation: "UAE",
      // Optional UI fields not in the query yet
      startDate: undefined,
      duration: undefined,
      durationType: undefined,
      deliveryMode: undefined,
      location: undefined,
      learningOutcomes: undefined,
      eligibilityCriteria: undefined,
      eligibility: undefined,
      applicationProcess: undefined,
      additionalTerms: undefined,
    } as any;
  };
  // Sync GraphQL product into local state without removing existing service-based flow
  useEffect(() => {
    if (!itemId) return;
    if (gqlError) {
      console.error("GraphQL error fetching product:", gqlError);
      // Let the existing services-based effect handle fallbacks
      return;
    }
    const product = (gqlData as any)?.product;
    if (!product) return;

    const mapped = mapProductToItem(product);
    if (mapped) {
      // Merge with existing fallback so missing fields (details/highlights/attributes) are filled
      const fallbackForItem = getFallbackItemDetails(
        marketplaceType,
        itemId || "fallback-1"
      );
      const merged = {
        ...(fallbackForItem || {}),
        ...mapped,
      } as any;
      // Do not overwrite fallback values with undefined/null/empty arrays
      if (fallbackForItem) {
        for (const key of Object.keys(fallbackForItem)) {
          const val = (merged as any)[key];
          const shouldUseFallback =
            val === undefined ||
            val === null ||
            (Array.isArray(val) && val.length === 0) ||
            (typeof val === "string" && val.trim() === "");
          if (shouldUseFallback) {
            (merged as any)[key] = (fallbackForItem as any)[key];
          }
        }
        // Merge provider subfields
        (merged as any).provider = {
          ...(fallbackForItem as any).provider,
          ...(mapped as any).provider,
        };
      }
      setItem(merged);
      setIsBookmarked(bookmarkedItems.includes(merged.id));

      const rs = product?.customFields?.RelatedServices;
      const relatedFromGql = Array.isArray(rs)
        ? rs.map((x: any) => ({
            id: x.id,
            title: x.name,
            description: "",
            provider: {
              name: merged.provider.name,
              logoUrl: merged.provider.logoUrl,
            },
            tags: [],
          }))
        : [];
      setRelatedItems((prev) =>
        relatedFromGql.length > 0
          ? relatedFromGql
          : prev?.length
          ? prev
          : getFallbackItems(marketplaceType)
      );

      if (shouldTakeAction) {
        setTimeout(() => {
          document
            .getElementById("action-section")
            ?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
      setError(null);
    }
  }, [
    gqlData,
    gqlError,
    itemId,
    marketplaceType,
    bookmarkedItems,
    shouldTakeAction,
  ]);
  // Check if tabs overflow and need navigation controls
  const checkOverflow = () => {
    if (tabsRef.current && containerRef.current) {
      const scrollWidth = tabsRef.current.scrollWidth;
      const clientWidth = containerRef.current.clientWidth - 96; // Account for potential arrow buttons
      setShowNavigation(scrollWidth > clientWidth);
    }
  };
  useEffect(() => {
    checkOverflow();
    const resizeObserver = new ResizeObserver(checkOverflow);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    return () => resizeObserver.disconnect();
  }, [config.tabs]);
  // Update floating card visibility based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      // Get header height dynamically
      const header = document.querySelector("header");
      const headerHeight = header ? header.offsetHeight : 80;
      setHeaderHeight(headerHeight);
      if (heroRef.current && mainContentRef.current) {
        const heroRect = heroRef.current.getBoundingClientRect();
        const heroBottom = heroRect.bottom;
        // Show floating card when hero section is scrolled past the header
        setIsVisible(heroBottom <= headerHeight + 16); // Add small margin
        // For mobile, we'll handle this differently with the sticky bottom CTA
        if (window.innerWidth < 1024) {
          const summaryCardBottom =
            summaryCardRef.current?.getBoundingClientRect().bottom || 0;
          setShowStickyBottomCTA(summaryCardBottom < 0);
        } else {
          setShowStickyBottomCTA(false);
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);
    // Initial check
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);
  // Handle scroll for sticky bottom CTA on mobile
  useEffect(() => {
    const handleScroll = () => {
      if (summaryCardRef.current && window.innerWidth < 1024) {
        const summaryCardBottom =
          summaryCardRef.current.offsetTop +
          summaryCardRef.current.offsetHeight;
        const scrollPosition = window.scrollY + window.innerHeight;
        // Show sticky CTA when scrolled past summary card
        setShowStickyBottomCTA(scrollPosition > summaryCardBottom + 100);
      } else {
        setShowStickyBottomCTA(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);
  // Clear any redirect timers when component unmounts
  useEffect(() => {
    return () => {
      if (redirectTimer) {
        clearTimeout(redirectTimer);
      }
    };
  }, [redirectTimer]);
  const scrollLeft = () => {
    if (tabsRef.current) {
      tabsRef.current.scrollBy({
        left: -200,
        behavior: "smooth",
      });
    }
  };
  const scrollRight = () => {
    if (tabsRef.current) {
      tabsRef.current.scrollBy({
        left: 200,
        behavior: "smooth",
      });
    }
  };
  // Add state for active tab
  const [activeTab, setActiveTab] = useState<string>(
    config.tabs[0]?.id || "about"
  );
  // Generate a random rating between 4.0 and 5.0 for display purposes
  const rating = (4 + Math.random()).toFixed(1);
  const reviewCount = Math.floor(Math.random() * 50) + 10;
  useEffect(() => {
    const fetchItemDetails = async () => {
      if (!itemId) return;
      setLoading(true);
      setError(null);
      // Clear any existing redirect timer
      if (redirectTimer) {
        clearTimeout(redirectTimer);
        setRedirectTimer(null);
      }
      try {
        // Try to fetch item details
        let itemData = null;
        try {
          itemData = await fetchMarketplaceItemDetails(marketplaceType, itemId);
        } catch (fetchError) {
          console.error(
            `Error fetching ${marketplaceType} item details:`,
            fetchError
          );
          // We'll handle this below by using fallback data
        }
        // If item data is available, use it, otherwise use fallback data
        const finalItemData =
          itemData ||
          getFallbackItemDetails(marketplaceType, itemId || "fallback-1");
        if (finalItemData) {
          setItem(finalItemData);
          setIsBookmarked(bookmarkedItems.includes(finalItemData.id));
          // Fetch related items
          let relatedItemsData = [];
          try {
            relatedItemsData = await fetchRelatedMarketplaceItems(
              marketplaceType,
              finalItemData.id,
              finalItemData.category || "",
              finalItemData.provider?.name || ""
            );
          } catch (relatedError) {
            console.error("Error fetching related items:", relatedError);
            // Use fallback related items on error
          }
          // Use fetched related items if available, otherwise use fallback
          setRelatedItems(
            relatedItemsData && relatedItemsData.length > 0
              ? relatedItemsData
              : getFallbackItems(marketplaceType)
          );
          // If the action parameter is true, scroll to the action section
          if (shouldTakeAction) {
            setTimeout(() => {
              const actionSection = document.getElementById("action-section");
              if (actionSection) {
                actionSection.scrollIntoView({
                  behavior: "smooth",
                });
              }
            }, 100);
          }
        } else {
          // Item not found - use generic fallback
          const genericFallback = getFallbackItemDetails(
            marketplaceType,
            "generic-fallback"
          );
          setItem(genericFallback);
          setError(null); // Clear any error since we're showing fallback data
          // Set a redirect timer with a longer delay (5 seconds)
          const timer = setTimeout(() => {
            navigate(config.route);
          }, 5000);
          setRedirectTimer(timer);
        }
      } catch (err) {
        console.error(`Error in marketplace details page:`, err);
        // Use fallback data even on general errors
        const fallbackItem = getFallbackItemDetails(
          marketplaceType,
          "generic-fallback"
        );
        setItem(fallbackItem);
        setRelatedItems(getFallbackItems(marketplaceType));
        setError(null); // Clear error since we're showing fallback data
      } finally {
        setLoading(false);
      }
    };
    fetchItemDetails();
  }, [
    itemId,
    marketplaceType,
    bookmarkedItems,
    shouldTakeAction,
    navigate,
    config,
  ]);
  const handleToggleBookmark = () => {
    if (item) {
      onToggleBookmark(item.id);
      setIsBookmarked(!isBookmarked);
    }
  };
  const handleAddToComparison = () => {
    if (item) {
      onAddToComparison(item);
    }
  };
  const retryFetch = () => {
    setError(null);
    // Re-fetch by triggering the useEffect
    if (itemId) {
      setLoading(true);
      try {
        refetch?.();
      } catch {}
    }
  };
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          sidebarOpen={sidebarOpen}
        />
        <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[300px] flex-grow">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-8 w-32 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 w-48 bg-gray-200 rounded"></div>
          </div>
        </div>
        <Footer isLoggedIn={false} />
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          sidebarOpen={sidebarOpen}
        />
        <div className="container mx-auto px-4 py-8 flex-grow">
          <nav className="flex mb-4" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-2">
              <li className="inline-flex items-center">
                <Link
                  to="/"
                  className="text-gray-600 hover:text-gray-900 inline-flex items-center"
                >
                  <HomeIcon size={16} className="mr-1" />
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <ChevronRightIcon size={16} className="text-gray-400" />
                  <Link
                    to={config.route}
                    className="ml-1 text-gray-600 hover:text-gray-900 md:ml-2"
                  >
                    {config.itemNamePlural}
                  </Link>
                </div>
              </li>
              <li aria-current="page">
                <div className="flex items-center">
                  <ChevronRightIcon size={16} className="text-gray-400" />
                  <span className="ml-1 text-gray-500 md:ml-2">Details</span>
                </div>
              </li>
            </ol>
          </nav>
          <ErrorDisplay
            message={error}
            onRetry={retryFetch}
            additionalMessage={
              redirectTimer
                ? `Redirecting to ${config.itemNamePlural} page in a few seconds...`
                : undefined
            }
          />
        </div>
        <Footer isLoggedIn={false} />
      </div>
    );
  }
  if (!item) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          sidebarOpen={sidebarOpen}
        />
        <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[300px] flex-grow">
          <div className="text-center">
            <h2 className="text-xl font-medium text-gray-900 mb-2">
              {config.itemName} Not Found
            </h2>
            <p className="text-gray-500 mb-4">
              The {config.itemName.toLowerCase()} you're looking for doesn't
              exist or has been removed.
            </p>
            <Link
              to={config.route}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors inline-block"
            >
              Back to {config.itemNamePlural}
            </Link>
          </div>
        </div>
        <Footer isLoggedIn={false} />
      </div>
    );
  }
  // Extract display properties based on marketplace type
  const itemTitle = item.title;
  const itemDescription = item.description;
  const provider = item.provider;
  const primaryAction = config.primaryCTA;
  const secondaryAction = config.secondaryCTA;
  // Extract tags based on marketplace type
  const displayTags =
    item.tags ||
    [
      item.category,
      marketplaceType === "courses" ? item.deliveryMode : item.serviceType,
      item.businessStage,
    ].filter(Boolean);
  // Extract details for the sidebar
  const detailItems = config.attributes
    .map((attr) => ({
      label: attr.label,
      value: item[attr.key] || "N/A",
    }))
    .filter((detail) => detail.value !== "N/A");
  // Extract highlights/features based on marketplace type
  const highlights =
    marketplaceType === "courses"
      ? item.learningOutcomes || []
      : item.details || [];
  // Render tab content with consistent styling
  const renderTabContent = (tabId: string) => {
    const tab = config.tabs.find((t) => t.id === tabId);
    if (!tab) return null;
    // Return specific tab content based on tab ID
    switch (tabId) {
      case "about":
        return (
          <div className="space-y-6">
            <p className="text-gray-600 text-lg mb-6">
              Learn more about this {config.itemName.toLowerCase()} and what it
              offers for your business.
            </p>
            <div className="prose max-w-none">
              <p className="text-gray-700 mb-5">{itemDescription}</p>
              {marketplaceType === "courses" && (
                <p className="text-gray-700">
                  This course is designed to accommodate {item.businessStage}{" "}
                  businesses, with a focus on practical applications that you
                  can implement immediately. Our experienced instructors bring
                  real-world expertise to help you navigate the challenges of
                  modern business environments.
                </p>
              )}
              {marketplaceType === "financial" && (
                <p className="text-gray-700">
                  This financial service is tailored for businesses at the{" "}
                  {item.businessStage || "growth"} stage, providing the
                  financial resources needed to achieve your business
                  objectives. With competitive terms and a streamlined
                  application process, you can access the funding you need
                  quickly and efficiently.
                </p>
              )}
              {marketplaceType === "non-financial" && (
                <p className="text-gray-700">
                  This service is designed to support businesses at all stages,
                  with particular benefits for those in the{" "}
                  {item.businessStage || "growth"} phase. Our team of experts
                  will work closely with you to ensure you receive the maximum
                  value and can implement effective solutions for your specific
                  business needs.
                </p>
              )}
            </div>
            {/* Key Highlights Section - Unified layout for all marketplace types */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Key Highlights
              </h3>
              {/* Features/Highlights list - Consistent for all types */}
              <ul className="space-y-2">
                {highlights.map((highlight, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircleIcon
                      size={16}
                      className="text-green-500 mr-3 mt-1 flex-shrink-0"
                    />
                    <span className="text-gray-700">{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );
      case "schedule":
        return (
          <div className="space-y-6">
            <p className="text-gray-600 text-lg mb-6">
              Here's the complete schedule and timeline for this course.
            </p>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex flex-col md:flex-row md:items-center mb-6 bg-blue-50 p-3 rounded-lg">
                <div className="flex-grow flex items-center">
                  <Calendar className="text-blue-600 mr-3" size={18} />
                  <div>
                    <p className="font-medium text-gray-800">
                      Start Date:{" "}
                      <span className="text-blue-700">{item.startDate}</span>
                    </p>
                    <p className="text-sm text-gray-600">
                      Duration: {item.duration}
                    </p>
                  </div>
                </div>
                <div className="mt-2 md:mt-0 md:ml-auto">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-50 text-green-700 border border-green-100">
                    {item.deliveryMode}
                  </span>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Course Timeline
              </h3>
              <div className="space-y-4">
                <div className="relative pl-8 pb-4 border-l-2 border-blue-200">
                  <div className="absolute left-[-8px] top-0 w-4 h-4 rounded-full bg-blue-500"></div>
                  <h4 className="font-semibold text-gray-900">Week 1</h4>
                  <p className="text-gray-700">
                    Introduction and foundation concepts
                  </p>
                </div>
                <div className="relative pl-8 pb-4 border-l-2 border-blue-200">
                  <div className="absolute left-[-8px] top-0 w-4 h-4 rounded-full bg-blue-500"></div>
                  <h4 className="font-semibold text-gray-900">Week 2</h4>
                  <p className="text-gray-700">
                    Core principles and practical exercises
                  </p>
                </div>
                {item.durationType === "Medium" ||
                item.durationType === "Long" ? (
                  <div className="relative pl-8 pb-4 border-l-2 border-blue-200">
                    <div className="absolute left-[-8px] top-0 w-4 h-4 rounded-full bg-blue-500"></div>
                    <h4 className="font-semibold text-gray-900">Week 3-4</h4>
                    <p className="text-gray-700">
                      Advanced techniques and final projects
                    </p>
                  </div>
                ) : null}
                {item.durationType === "Long" ? (
                  <div className="relative pl-8">
                    <div className="absolute left-[-8px] top-0 w-4 h-4 rounded-full bg-blue-500"></div>
                    <h4 className="font-semibold text-gray-900">Final Week</h4>
                    <p className="text-gray-700">
                      Project presentations and certification
                    </p>
                  </div>
                ) : null}
              </div>
              {/* Location if applicable */}
              {item.location && (
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                    <MapPin className="text-blue-600 mr-2" size={16} />
                    Location Details
                  </h4>
                  <p className="text-gray-700 ml-6">{item.location}</p>
                </div>
              )}
            </div>
          </div>
        );
      case "learning_outcomes":
        return (
          <div className="space-y-6">
            <p className="text-gray-600 text-lg mb-6">
              What you'll learn from this course and the skills you'll develop.
            </p>
            {/* Core Learning Outcomes - simplified numbered list */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Core Learning Outcomes
              </h3>
              <ol className="space-y-3">
                {highlights.map((outcome, index) => (
                  <li key={index} className="pl-2">
                    <div className="flex items-start gap-3">
                      <span className="text-gray-500 font-medium">
                        {index + 1}.
                      </span>
                      <p className="text-gray-700 leading-relaxed">{outcome}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
            {/* Skills You'll Gain - compact two-column grid */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Skills You'll Gain
              </h3>
              <div className="grid md:grid-cols-2 gap-2">
                {[
                  "Strategic thinking and planning",
                  "Problem-solving techniques",
                  "Implementation best practices",
                  "Performance measurement",
                  "Risk assessment and mitigation",
                  "Communication and presentation",
                ].map((skill, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircleIcon
                      size={16}
                      className="text-green-600 mr-2 flex-shrink-0"
                    />
                    <span className="text-gray-700">{skill}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Upon Completion - single subtle highlight box */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Upon Completion
              </h3>
              <p className="text-gray-700 mb-3">
                Receive a certificate of completion, gain practical skills for
                immediate implementation, and join our network of alumni and
                industry professionals.
              </p>
              <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded border border-blue-100">
                Businesses report an average of 40% improvement in relevant
                metrics within 6 months of course completion.
              </div>
            </div>
          </div>
        );
      case "eligibility_terms":
        return (
          <div className="space-y-6">
            <p className="text-gray-600 text-lg mb-6">
              Review eligibility requirements and terms & conditions for this
              service.
            </p>
            {/* Eligibility Section - unified card style */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Eligibility Requirements
              </h3>
              <ul className="space-y-2">
                {item.eligibilityCriteria ? (
                  item.eligibilityCriteria.map((criteria, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircleIcon
                        size={16}
                        className="text-green-500 mr-3 mt-1 flex-shrink-0"
                      />
                      <span className="text-gray-700">{criteria}</span>
                    </li>
                  ))
                ) : (
                  <li className="flex items-start">
                    <CheckCircleIcon
                      size={16}
                      className="text-green-500 mr-3 mt-1 flex-shrink-0"
                    />
                    <span className="text-gray-700">
                      {item.eligibility ||
                        `Businesses at the ${
                          item.businessStage || "growth"
                        } stage`}
                    </span>
                  </li>
                )}
              </ul>
              <div className="mt-6 bg-blue-50 rounded-lg p-3">
                <h4 className="text-md font-medium text-blue-800 mb-2">
                  Not sure if you qualify?
                </h4>
                <p className="text-gray-700 mb-3 text-sm">
                  Contact {item.provider.name} for a preliminary eligibility
                  assessment before submitting your full application.
                </p>
                <button className="text-blue-600 text-sm font-medium hover:text-blue-800 transition-colors flex items-center">
                  Contact Provider
                  <ChevronRight size={14} className="ml-1" />
                </button>
              </div>
            </div>
            {/* Terms & Conditions Section - unified card style */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Terms & Conditions
              </h3>
              <h4 className="text-md font-semibold text-gray-900 mb-3">
                Key Terms
              </h4>
              <p className="text-gray-700 mb-4">
                {item.keyTerms ||
                  "Zero interest rate with a grace period of 12 months. Repayment in equal monthly installments over the loan tenure. Early settlement allowed without penalties after 24 months."}
              </p>
              <h4 className="text-md font-semibold text-gray-900 mb-3">
                Additional Terms
              </h4>
              <ul className="space-y-2">
                {item.additionalTerms ? (
                  item.additionalTerms.map((term, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-gray-400 mr-2">•</span>
                      <span className="text-gray-700">{term}</span>
                    </li>
                  ))
                ) : (
                  <>
                    <li className="flex items-start">
                      <span className="text-gray-400 mr-2">•</span>
                      <span className="text-gray-700">
                        Collateral requirements will be determined based on loan
                        amount and business risk profile
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-gray-400 mr-2">•</span>
                      <span className="text-gray-700">
                        Late payment penalties may apply as per the final loan
                        agreement
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-gray-400 mr-2">•</span>
                      <span className="text-gray-700">
                        Prepayment options available subject to terms outlined
                        in the loan agreement
                      </span>
                    </li>
                  </>
                )}
              </ul>
            </div>
            <div className="text-sm text-gray-500 italic">
              The information provided here is a summary of key terms and
              conditions. The full terms and conditions will be provided in the
              final agreement. {item.provider.name} reserves the right to modify
              these terms at their discretion.
            </div>
          </div>
        );
      case "application_process":
        return (
          <div className="space-y-6">
            <p className="text-gray-600 text-lg mb-6">
              Follow these simple steps to complete your application.
            </p>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="space-y-3">
                {item.applicationProcess ? (
                  item.applicationProcess.map((step, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <span className="text-gray-500 font-medium">
                        {index + 1}.
                      </span>
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {step.title}
                        </h4>
                        <p className="text-gray-600 text-sm mt-1">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <>
                    <div className="flex items-start gap-3">
                      <span className="text-gray-500 font-medium">1.</span>
                      <div>
                        <h4 className="font-medium text-gray-900">
                          Submit Application
                        </h4>
                        <p className="text-gray-600 text-sm mt-1">
                          Complete the online application form with your
                          business details and required information.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-gray-500 font-medium">2.</span>
                      <div>
                        <h4 className="font-medium text-gray-900">
                          Document Verification
                        </h4>
                        <p className="text-gray-600 text-sm mt-1">
                          Upload required documents for verification and wait
                          for our team to review them.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-gray-500 font-medium">3.</span>
                      <div>
                        <h4 className="font-medium text-gray-900">
                          Review & Approval
                        </h4>
                        <p className="text-gray-600 text-sm mt-1">
                          Our team will review your application and contact you
                          with a decision within 5-7 business days.
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        );
      case "required_documents":
        return (
          <div className="space-y-6">
            <p className="text-gray-600 text-lg mb-6">
              Prepare these documents to support your application and ensure a
              smooth process.
            </p>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Required Documents
              </h3>
              <div className="grid md:grid-cols-2 gap-3">
                {item.requiredDocuments ? (
                  item.requiredDocuments.map((doc, index) => (
                    <div key={index} className="flex items-start">
                      <FileText
                        size={16}
                        className="text-blue-600 mr-3 mt-0.5 flex-shrink-0"
                      />
                      <span className="text-gray-700">{doc}</span>
                    </div>
                  ))
                ) : (
                  <>
                    <div className="flex items-start">
                      <FileText
                        size={16}
                        className="text-blue-600 mr-3 mt-0.5 flex-shrink-0"
                      />
                      <span className="text-gray-700">
                        Business Registration Certificate
                      </span>
                    </div>
                    <div className="flex items-start">
                      <FileText
                        size={16}
                        className="text-blue-600 mr-3 mt-0.5 flex-shrink-0"
                      />
                      <span className="text-gray-700">Trade License</span>
                    </div>
                    <div className="flex items-start">
                      <FileText
                        size={16}
                        className="text-blue-600 mr-3 mt-0.5 flex-shrink-0"
                      />
                      <span className="text-gray-700">
                        Financial Statements (last 2 years)
                      </span>
                    </div>
                    <div className="flex items-start">
                      <FileText
                        size={16}
                        className="text-blue-600 mr-3 mt-0.5 flex-shrink-0"
                      />
                      <span className="text-gray-700">
                        Business Plan or Proposal
                      </span>
                    </div>
                  </>
                )}
              </div>
              <div className="mt-6 text-sm text-gray-700 bg-amber-50 p-3 rounded border border-amber-100">
                <span className="font-medium text-amber-800">Note:</span> All
                documents must be submitted in PDF format. Documents in
                languages other than English or Arabic must be accompanied by
                certified translations.
              </div>
            </div>
          </div>
        );
      case "provider":
        return (
          <div className="space-y-6">
            <p className="text-gray-600 text-lg mb-6">
              Learn more about the provider and their expertise in this field.
            </p>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
                <img
                  src={provider.logoUrl}
                  alt={provider.name}
                  className="h-16 w-16 object-contain rounded-lg"
                />
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {provider.name}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {marketplaceType === "courses"
                      ? "Leading provider of business education"
                      : marketplaceType === "financial"
                      ? "Trusted financial services provider"
                      : "Expert business services provider"}
                  </p>
                </div>
                <div className="md:ml-auto flex flex-col md:items-end">
                  <div className="text-sm text-gray-500">Established</div>
                  <div className="font-medium text-blue-600">
                    {item.providerEstablished || "2007"}{" "}
                    {item.providerLocation || "UAE"}
                  </div>
                </div>
              </div>
              <p className="text-gray-700 mb-6">
                {provider.description ||
                  `${provider.name} is an independent, not-for-profit small and medium enterprises (SMEs) socio-economic development organization established in 2007.`}
              </p>
              <h4 className="text-md font-semibold text-gray-900 mb-3">
                Areas of Expertise
              </h4>
              <div className="flex flex-wrap gap-2 mb-6">
                {item.providerExpertise ? (
                  item.providerExpertise.map((expertise, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium"
                    >
                      {expertise}
                    </span>
                  ))
                ) : (
                  <>
                    <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                      SME Financing
                    </span>
                    <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium">
                      Business Advisory
                    </span>
                    <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm font-medium">
                      Entrepreneurship
                    </span>
                    <span className="px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-sm font-medium">
                      Financial Planning
                    </span>
                  </>
                )}
              </div>
              <button className="text-blue-600 font-medium hover:text-blue-800 transition-colors flex items-center">
                Visit Provider Website
                <ExternalLinkIcon size={16} className="ml-1" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                <h4 className="text-sm text-gray-500 mb-1">Location</h4>
                <p className="font-medium text-gray-900">
                  {item.providerLocation || "Abu Dhabi, UAE"}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                <h4 className="text-sm text-gray-500 mb-1">Contact</h4>
                <p className="font-medium text-gray-900">
                  {item.providerContact || "info@provider.ae"}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                <h4 className="text-sm text-gray-500 mb-1">Services</h4>
                <p className="font-medium text-gray-900">
                  {item.providerServices || "20+ Financial Products"}
                </p>
              </div>
            </div>
          </div>
        );
      // Add other tab cases as needed
      default:
        if (tab.renderContent) {
          return (
            <div>
              <p className="text-gray-600 text-lg mb-6">
                Additional information about this{" "}
                {config.itemName.toLowerCase()}.
              </p>
              {tab.renderContent(item, marketplaceType)}
            </div>
          );
        }
        return (
          <div>
            <p className="text-gray-600 text-lg mb-6">
              Additional information about this {config.itemName.toLowerCase()}.
            </p>
            <p className="text-gray-500">Content for {tab.label} tab</p>
          </div>
        );
    }
  };
  // Combined SummaryCard component that works for both desktop and mobile
  const SummaryCard = ({ isFloating = false }) => (
    <div
      ref={isFloating ? null : summaryCardRef}
      className={`
        bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden
        ${!isFloating ? "" : ""}
      `}
    >
      <div className="bg-gray-50 p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-lg text-gray-900">
            {config.itemName} Details
          </h3>
          {isFloating && (
            <button
              onClick={() => setIsFloatingCardVisible(false)}
              className="p-1 hover:bg-gray-200 rounded transition-colors text-gray-600"
              aria-label="Hide card"
            >
              <XIcon size={16} />
            </button>
          )}
        </div>
      </div>
      <div className="p-4">
        <div className="space-y-2 mb-4">
          {detailItems.map((detail, index) => (
            <div key={index} className="flex justify-between items-center">
              <span className="text-sm text-gray-500">{detail.label}:</span>
              <span className="text-sm font-medium text-gray-900">
                {detail.value || "N/A"}
              </span>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-200 pt-4 mb-4">
          <h4 className="text-sm font-medium text-gray-800 mb-3">
            {marketplaceType === "courses"
              ? "This course includes:"
              : marketplaceType === "financial"
              ? "This service includes:"
              : "This service includes:"}
          </h4>
          <ul className="space-y-2">
            {highlights.slice(0, 4).map((highlight, index) => (
              <li key={index} className="flex items-start">
                <CheckCircleIcon
                  size={14}
                  className="text-green-500 mr-2 mt-1 flex-shrink-0"
                />
                <span className="text-sm text-gray-700">{highlight}</span>
              </li>
            ))}
          </ul>
        </div>
        <button
          id="action-section"
          className="w-full px-4 py-3 text-white font-bold rounded-md bg-gradient-to-r from-teal-500 via-blue-500 to-purple-600 hover:from-teal-600 hover:via-blue-600 hover:to-purple-700 transition-colors shadow-md mb-3"
        >
          {primaryAction}
        </button>
        <button
          onClick={handleAddToComparison}
          className="w-full px-4 py-2.5 text-blue-600 font-medium bg-white border border-blue-600 rounded-md hover:bg-blue-50 transition-colors flex items-center justify-center"
        >
          <ScaleIcon size={16} className="mr-2" />
          Add to Comparison
        </button>
      </div>
    </div>
  );
  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Header
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        sidebarOpen={sidebarOpen}
      />
      <main className="flex-grow">
        {/* Hero Banner - consistent header layout */}
        <div
          ref={heroRef}
          className="w-full bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200"
        >
          <div className="container mx-auto px-4 md:px-6 max-w-7xl">
            {/* Breadcrumbs */}
            <nav className="flex pt-4" aria-label="Breadcrumb">
              <ol className="inline-flex items-center space-x-1 md:space-x-2">
                <li className="inline-flex items-center">
                  <Link
                    to="/"
                    className="text-gray-600 hover:text-gray-900 inline-flex items-center"
                  >
                    <HomeIcon size={16} className="mr-1" />
                    <span>Home</span>
                  </Link>
                </li>
                <li>
                  <div className="flex items-center">
                    <ChevronRightIcon size={16} className="text-gray-400" />
                    <Link
                      to={config.route}
                      className="ml-1 text-gray-600 hover:text-gray-900 md:ml-2"
                    >
                      {config.itemNamePlural}
                    </Link>
                  </div>
                </li>
                <li aria-current="page">
                  <div className="flex items-center">
                    <ChevronRightIcon size={16} className="text-gray-400" />
                    <span className="ml-1 text-gray-500 md:ml-2">
                      {itemTitle}
                    </span>
                  </div>
                </li>
              </ol>
            </nav>
            <div className="flex flex-col items-start max-w-3xl py-8">
              {/* Provider */}
              <div className="flex items-center mb-3">
                <img
                  src={provider.logoUrl}
                  alt={`${provider.name} logo`}
                  className="h-10 w-10 object-contain mr-3 rounded-md"
                />
                <span className="text-gray-600 font-medium">
                  {provider.name}
                </span>
              </div>
              {/* Title */}
              <h1 className="text-3xl font-bold text-gray-900 mb-2 leading-tight">
                {itemTitle}
              </h1>
              {/* Tags row - Separated from ratings */}
              <div className="flex flex-wrap gap-2 mb-3">
                {displayTags.map((tag, index) => (
                  <span
                    key={index}
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      index === 0
                        ? "bg-blue-50 text-blue-700 border border-blue-100"
                        : index === 1
                        ? "bg-green-50 text-green-700 border border-green-100"
                        : "bg-purple-50 text-purple-700 border border-purple-100"
                    }`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
              {/* Ratings and bookmark row - Now in a separate row below tags */}
              <div className="flex items-center justify-between w-full mb-4">
                <div className="flex items-center">
                  {marketplaceType === "courses" && (
                    <div className="flex items-center">
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <StarIcon
                            key={star}
                            size={16}
                            className={`${
                              parseFloat(rating) >= star
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="ml-2 text-sm font-medium text-gray-700">
                        {rating}
                      </span>
                      <span className="mx-1.5 text-gray-500">·</span>
                      <span className="text-sm text-gray-500">
                        {reviewCount} reviews
                      </span>
                    </div>
                  )}
                </div>
                <button
                  onClick={handleToggleBookmark}
                  className={`p-1.5 rounded-full ${
                    isBookmarked
                      ? "bg-yellow-100 text-yellow-600"
                      : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                  }`}
                  aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
                  title={isBookmarked ? "Remove bookmark" : "Add bookmark"}
                >
                  <BookmarkIcon
                    size={18}
                    className={isBookmarked ? "fill-yellow-600" : ""}
                  />
                </button>
              </div>
              {/* Description */}
              <p className="text-gray-700 mb-6 max-w-2xl">{itemDescription}</p>
            </div>
          </div>
        </div>
        {/* Tabs Navigation */}
        <div className="border-b border-gray-200 w-full bg-white">
          <div className="container mx-auto px-4 md:px-6 max-w-7xl">
            <div
              ref={containerRef}
              className="flex items-center w-full relative"
            >
              {showNavigation && (
                <button
                  className="absolute left-0 p-2 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md transition-colors bg-white z-10"
                  onClick={scrollLeft}
                  aria-label="Scroll tabs left"
                >
                  <ChevronLeft size={16} />
                </button>
              )}
              <div
                ref={tabsRef}
                className="flex overflow-x-auto scrollbar-hide w-full"
                style={{
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                }}
              >
                {config.tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-all duration-200 border-b-2 ${
                      activeTab === tab.id
                        ? "text-blue-600 border-blue-600"
                        : "text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300"
                    }`}
                    aria-selected={activeTab === tab.id}
                    aria-controls={`tabpanel-${tab.id}`}
                    role="tab"
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              {showNavigation && (
                <>
                  <button
                    className="absolute right-8 p-2 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md transition-colors bg-white z-10"
                    onClick={scrollRight}
                    aria-label="Scroll tabs right"
                  >
                    <ChevronRight size={16} />
                  </button>
                  <div className="absolute right-0">
                    <button
                      className="p-2 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md transition-colors bg-white z-10"
                      onClick={() => setShowTabsMenu(!showTabsMenu)}
                      aria-label="Show all tabs menu"
                      aria-expanded={showTabsMenu}
                    >
                      <MoreHorizontal size={16} />
                    </button>
                    {showTabsMenu && (
                      <>
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => setShowTabsMenu(false)}
                          aria-hidden="true"
                        />
                        <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg z-20 border border-gray-200">
                          <div className="py-1 max-h-64 overflow-y-auto">
                            {config.tabs.map((tab) => (
                              <button
                                key={tab.id}
                                className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                                  activeTab === tab.id
                                    ? "bg-blue-50 text-blue-600"
                                    : "text-gray-700 hover:bg-gray-100"
                                }`}
                                onClick={() => {
                                  setActiveTab(tab.id);
                                  setShowTabsMenu(false);
                                }}
                                role="menuitem"
                              >
                                {tab.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        {/* Main content area with 12-column grid layout */}
        <div
          ref={mainContentRef}
          className="container mx-auto px-4 md:px-6 max-w-7xl py-8"
        >
          <div className="grid grid-cols-12 gap-8">
            {/* Content column (~8 columns) */}
            <div className="col-span-12 lg:col-span-8">
              {/* Tab Content */}
              <div className="mb-8">
                {config.tabs.map((tab) => (
                  <div
                    key={tab.id}
                    className={activeTab === tab.id ? "block" : "hidden"}
                    id={`tabpanel-${tab.id}`}
                    role="tabpanel"
                    aria-labelledby={`tab-${tab.id}`}
                  >
                    {renderTabContent(tab.id)}
                  </div>
                ))}
              </div>
              {/* Mobile Summary Card - only visible on mobile/tablet */}
              <div className="lg:hidden mt-8">
                <SummaryCard isFloating={false} />
              </div>
            </div>
            {/* Summary card column (~4 columns) - visible only on desktop */}
            <div className="hidden lg:block lg:col-span-4">
              <div className="sticky top-[96px]">
                {isFloatingCardVisible && (
                  <SummaryCard isFloating={isVisible} />
                )}
              </div>
            </div>
          </div>
        </div>
        {/* Related Items */}
        <section className="bg-gray-50 py-10 border-t border-gray-200">
          <div className="container mx-auto px-4 md:px-6 max-w-7xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Related {config.itemNamePlural}
              </h2>
              <a
                href={config.route}
                className="text-blue-600 font-medium hover:text-blue-800 flex items-center"
              >
                See All {config.itemNamePlural}
                <ChevronRightIcon size={16} className="ml-1" />
              </a>
            </div>
            {relatedItems.length > 0 ? (
              <div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {relatedItems.map((relatedItem) => (
                    <div
                      key={relatedItem.id}
                      className="bg-white rounded-lg shadow p-4 cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() =>
                        navigate(
                          `/marketplace/${marketplaceType}/${relatedItem.id}`
                        )
                      }
                    >
                      <div className="flex items-center mb-3">
                        <img
                          src={relatedItem.provider.logoUrl}
                          alt={relatedItem.provider.name}
                          className="h-8 w-8 object-contain mr-2 rounded"
                        />
                        <span className="text-sm text-gray-600">
                          {relatedItem.provider.name}
                        </span>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">
                        {relatedItem.title}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                        {relatedItem.description}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {(relatedItem.tags || [])
                          .slice(0, 2)
                          .map((tag, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 bg-white rounded-lg shadow-sm border border-gray-200">
                <p className="text-gray-500">
                  No related {config.itemNamePlural.toLowerCase()} found
                </p>
              </div>
            )}
          </div>
        </section>
        {/* Sticky mobile CTA */}
        {showStickyBottomCTA && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 lg:hidden z-30 transform transition-transform duration-300 ease-in-out">
            <div className="flex items-center justify-between max-w-sm mx-auto">
              <div className="mr-3">
                <div className="text-gray-900 font-bold">
                  {marketplaceType === "courses"
                    ? item.price || "Free"
                    : marketplaceType === "financial"
                    ? item.amount || "Apply Now"
                    : "Request Now"}
                </div>
                <div className="text-sm text-gray-600">
                  {item.duration || item.serviceType || ""}
                </div>
              </div>
              <button className="flex-1 px-4 py-3 text-white font-bold rounded-md bg-gradient-to-r from-teal-500 via-blue-500 to-purple-600 hover:from-teal-600 hover:via-blue-600 hover:to-purple-700 transition-colors shadow-md">
                {primaryAction}
              </button>
            </div>
          </div>
        )}
      </main>
      <Footer isLoggedIn={false} />
    </div>
  );
};
export default MarketplaceDetailsPage;
