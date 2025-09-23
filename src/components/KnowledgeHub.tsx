import React, { useEffect, useState, useRef, Component } from 'react';
import { Calendar, BookOpen, Newspaper, ArrowRight, ChevronLeft, ChevronRight, Tag, FileText, Download, ExternalLink, Calculator, Loader, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { FadeInUpOnScroll, StaggeredFadeIn, useInView } from './AnimationUtils';
import { EventCard, NewsCard, ResourceCard } from './CardComponents';

interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  imageUrl: string;
  source?: string;
}

interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  type: string;
  imageUrl?: string;
  organizer?: string;
}

interface Resource {
  id: string;
  title: string;
  type: string;
  description: string;
  icon: React.ReactNode;
  downloadUrl?: string;
  fileSize?: string;
  downloadCount?: number;
  lastUpdated?: string;
  isExternal?: boolean;
  tags?: string[];
}

interface KnowledgeHubProps {
  graphqlEndpoint?: string;
}

// Mock data for fallback - keep the existing data
const newsItems: NewsItem[] = [{
  id: '1',
  title: 'Abu Dhabi Launches New SME Support Program',
  excerpt: 'The Abu Dhabi government has launched a new program to support SMEs with access to funding and resources.',
  date: 'May 15, 2023',
  category: 'Government',
  source: 'Abu Dhabi Times',
  imageUrl: 'https://images.unsplash.com/photo-1534224039826-c627a92ad1ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80'
}, {
  id: '2',
  title: 'Tech Startups in Abu Dhabi See 40% Growth',
  excerpt: 'Technology startups in Abu Dhabi have seen a 40% growth in the past year, according to a new report.',
  date: 'April 28, 2023',
  category: 'Technology',
  source: 'TechNews Daily',
  imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80'
}, {
  id: '3',
  title: 'New E-commerce Regulations to Boost Online Businesses',
  excerpt: 'Abu Dhabi has introduced new e-commerce regulations aimed at boosting online businesses in the emirate.',
  date: 'April 10, 2023',
  category: 'Regulations',
  source: 'Business Insider UAE',
  imageUrl: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80'
}, {
  id: '4',
  title: 'Abu Dhabi Investment Fund Allocates AED 1 Billion for Startups',
  excerpt: 'A new investment fund has been established to support innovative startups in key sectors.',
  date: 'March 22, 2023',
  category: 'Investment',
  source: 'Financial Times UAE',
  imageUrl: 'https://images.unsplash.com/photo-1559526324-593bc073d938?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80'
}, {
  id: '5',
  title: 'Abu Dhabi Economic Vision 2030 Progress Report Released',
  excerpt: 'The latest progress report shows significant advancements in key economic sectors.',
  date: 'March 10, 2023',
  category: 'Government',
  source: 'Government News Network',
  imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80'
}, {
  id: '6',
  title: 'New Digital Innovation Hub Opens in Abu Dhabi',
  excerpt: 'A state-of-the-art innovation hub has opened to foster technology development and entrepreneurship.',
  date: 'February 28, 2023',
  category: 'Technology',
  source: 'Innovation Digest',
  imageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80'
}];

const events: Event[] = [{
  id: '1',
  title: 'Abu Dhabi Business Forum 2023',
  date: 'June 15-16, 2023',
  location: 'Abu Dhabi National Exhibition Centre',
  type: 'Conference',
  organizer: 'Abu Dhabi Chamber of Commerce',
  imageUrl: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80'
}, {
  id: '2',
  title: 'Startup Pitch Competition',
  date: 'May 25, 2023',
  location: 'Hub71, Abu Dhabi',
  type: 'Competition',
  organizer: 'Hub71',
  imageUrl: 'https://images.unsplash.com/photo-1591115765373-5207764f72e4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80'
}, {
  id: '3',
  title: 'Digital Transformation Workshop',
  date: 'June 5, 2023',
  location: 'Yas Creative Hub',
  type: 'Workshop',
  organizer: 'Digital Abu Dhabi',
  imageUrl: 'https://images.unsplash.com/photo-1540317580384-e5d43867caa6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80'
}, {
  id: '4',
  title: 'Export Market Opportunities Seminar',
  date: 'July 10, 2023',
  location: 'ADGM, Al Maryah Island',
  type: 'Seminar',
  organizer: 'Abu Dhabi Export Office',
  imageUrl: 'https://images.unsplash.com/photo-1559223607-a43f990c095d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80'
}, {
  id: '5',
  title: 'Global Trade Summit',
  date: 'August 3-5, 2023',
  location: 'Etihad Towers Conference Centre',
  type: 'Summit',
  organizer: 'Ministry of Economy',
  imageUrl: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80'
}, {
  id: '6',
  title: 'Entrepreneurship Masterclass',
  date: 'September 15, 2023',
  location: 'NYU Abu Dhabi',
  type: 'Workshop',
  organizer: 'Khalifa Fund',
  imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80'
}];

const resources: Resource[] = [{
  id: '1',
  title: 'Business Plan Template',
  type: 'Templates',
  description: 'Comprehensive business plan template with financial projections, market analysis, and strategic planning sections. Perfect for startups.',
  icon: <FileText size={24} className="text-blue-600" />,
  downloadUrl: '#',
  fileSize: '2.5 MB',
  downloadCount: 1847,
  lastUpdated: 'January 2024',
  tags: ['Business', 'Template']
}, {
  id: '2',
  title: 'Export Market Analysis Report',
  type: 'Guide',
  description: 'Detailed analysis of export opportunities for Abu Dhabi businesses with market insights and regulatory information.',
  icon: <BookOpen size={24} className="text-blue-600" />,
  downloadUrl: '#',
  fileSize: '4.1 MB',
  downloadCount: 3254,
  lastUpdated: 'December 2023',
  tags: ['Export', 'Market Research']
}, {
  id: '3',
  title: 'Financial Planning Templates',
  type: 'Templates',
  description: 'Ready-to-use templates for financial planning and forecasting with automated calculations and projections.',
  icon: <FileText size={24} className="text-blue-600" />,
  downloadUrl: '#',
  fileSize: '1.8 MB',
  downloadCount: 5632,
  lastUpdated: 'February 2024',
  tags: ['Finance', 'Planning']
}, {
  id: '4',
  title: 'SME Growth Toolkit',
  type: 'Guide',
  description: 'Essential resources and strategies for small and medium enterprise growth in Abu Dhabi market conditions.',
  icon: <BookOpen size={24} className="text-blue-600" />,
  downloadUrl: '#',
  fileSize: '3.2 MB',
  downloadCount: 2187,
  lastUpdated: 'January 2024',
  tags: ['SME', 'Growth']
}, {
  id: '5',
  title: 'Digital Marketing Handbook',
  type: 'Guide',
  description: 'Complete guide to digital marketing strategies including SEO, social media, content marketing, and paid advertising best practices.',
  icon: <BookOpen size={24} className="text-blue-600" />,
  downloadUrl: '#',
  fileSize: '4.5 MB',
  downloadCount: 8967,
  lastUpdated: 'December 2023',
  tags: ['Marketing', 'Digital']
}, {
  id: '6',
  title: 'Financial Calculator Tool',
  type: 'Tool',
  description: 'Interactive online calculator for loan payments, investment returns, and financial planning. Access powerful calculations instantly.',
  icon: <Calculator size={24} className="text-blue-600" />,
  downloadUrl: '#',
  fileSize: 'External',
  downloadCount: 12456,
  lastUpdated: 'February 2024',
  isExternal: true,
  tags: ['Finance', 'Calculator']
}];

// Define interface for tab items
interface TabItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

// Update SegmentedTabs props interface
interface SegmentedTabsProps {
  tabs: TabItem[];
  activeTab: number;
  setActiveTab: (index: number) => void;
}

// Segmented Tab Component
const SegmentedTabs: React.FC<SegmentedTabsProps> = ({
  tabs,
  activeTab,
  setActiveTab
}) => {
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [indicatorStyle, setIndicatorStyle] = useState({
    left: 0,
    width: 0
  });
  useEffect(() => {
    const activeTabElement = tabRefs.current[activeTab];
    if (activeTabElement) {
      setIndicatorStyle({
        left: activeTabElement.offsetLeft,
        width: activeTabElement.offsetWidth
      });
    }
  }, [activeTab]);
  return <div className="relative inline-flex bg-white rounded-full shadow-sm p-1 mx-auto mb-8">
      {/* Animated background indicator */}
      <div className="absolute bottom-0 h-full bg-blue-50 rounded-full transition-all duration-300 z-0" style={{
      left: `${indicatorStyle.left}px`,
      width: `${indicatorStyle.width}px`
    }}></div>
      {/* Animated underline */}
      <div className="absolute bottom-1 h-0.5 bg-blue-600 rounded-full transition-all duration-300 z-10" style={{
      left: `${indicatorStyle.left + 8}px`,
      width: `${indicatorStyle.width - 16}px`
    }}></div>
      {tabs.map((tab, index) => <button key={tab.id} ref={el => tabRefs.current[index] = el} onClick={() => setActiveTab(index)} className={`relative z-10 px-5 py-2 text-sm font-medium rounded-full transition-all duration-300 flex items-center
            ${activeTab === index ? 'text-blue-700' : 'text-gray-600 hover:text-gray-900'}`}>
          {tab.icon}
          <span className="ml-1">{tab.label}</span>
          {/* Ripple effect */}
          {activeTab === index && <span className="absolute inset-0 rounded-full animate-ripple bg-blue-200 opacity-30"></span>}
        </button>)}
    </div>;
};

// Loading indicator component
const LoadingIndicator = () => <div className="flex flex-col items-center justify-center py-12">
    <Loader size={40} className="text-blue-600 animate-spin mb-4" />
    <p className="text-gray-600 font-medium">Loading data...</p>
  </div>;

// Error message component
const ErrorMessage = ({
  message
}) => <div className="flex flex-col items-center justify-center py-12 text-center">
    <AlertCircle size={40} className="text-red-500 mb-4" />
    <h3 className="text-lg font-bold text-gray-800 mb-2">Error Loading Data</h3>
    <p className="text-gray-600 max-w-md mx-auto">
      {message || "We couldn't load the data. Please try again later."}
    </p>
  </div>;

// KnowledgeHub Content Component
const KnowledgeHubContent = ({
  graphqlEndpoint
}) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0); // 0: News, 1: Events, 2: Resources
  const [isTabChanging, setIsTabChanging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<{ message: string } | null>(null);
  
  // Define tabs
  const tabs = [{
    id: 'news',
    label: 'News',
    icon: <Newspaper size={16} className="text-blue-600" />
  }, {
    id: 'events',
    label: 'Events',
    icon: <Calendar size={16} className="text-blue-600" />
  }, {
    id: 'resources',
    label: 'Resources',
    icon: <BookOpen size={16} className="text-blue-600" />
  }];
  
  // Handle tab change with animation
  const handleTabChange = index => {
    setIsTabChanging(true);
    setTimeout(() => {
      setActiveTab(index);
      setIsTabChanging(false);
    }, 300);
  };
  
  // Get data based on active tab
  const getNewsData = () => newsItems;
  const getEventsData = () => events;
  const getResourcesData = () => resources;
  
  // Helper function to get the appropriate icon for a resource type
  const getResourceIconByType = type => {
    switch (type?.toLowerCase()) {
      case 'guide':
        return <BookOpen size={24} className="text-blue-600" />;
      case 'templates':
        return <FileText size={24} className="text-blue-600" />;
      case 'tool':
        return <Calculator size={24} className="text-blue-600" />;
      default:
        return <FileText size={24} className="text-blue-600" />;
    }
  };
  
  // Add this function to handle event registration
  const handleEventRegister = (event: Event) => {
    // Here you can implement what happens when someone registers for an event
    // For example, open a registration modal, navigate to a registration page, etc.
    console.log('Registering for event:', event.title);
    
    // Example: Open a registration URL if available
    // if (event.registrationUrl) {
    //   window.open(event.registrationUrl, '_blank');
    // }
    
    // Or show a confirmation message
    alert(`Registration for "${event.title}" will be available soon!`);
  };

  // Add function to handle resource downloads
  const handleResourceDownload = (resource: Resource) => {
    console.log('Downloading resource:', resource.title);
    
    if (resource.isExternal) {
      // For external resources, open in new tab
      if (resource.downloadUrl) {
        window.open(resource.downloadUrl, '_blank');
      }
    } else {
      // For internal resources, trigger download
      if (resource.downloadUrl) {
        // Create a temporary link element to trigger download
        const link = document.createElement('a');
        link.href = resource.downloadUrl;
        link.download = `${resource.title}.${resource.fileSize?.includes('PDF') ? 'pdf' : 'zip'}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        // Fallback for demo purposes
        alert(`Download for "${resource.title}" will begin shortly!`);
      }
    }
  };

  // Add function to handle resource access
  const handleResourceAccess = (resource: Resource) => {
    console.log('Accessing resource:', resource.title);
    
    if (resource.isExternal) {
      // For external resources, open in new tab
      if (resource.downloadUrl) {
        window.open(resource.downloadUrl, '_blank');
      }
    } else {
      // For internal resources, navigate to detail page
      navigate(`/resources/${resource.id}`);
    }
  };
  
  return <div className="bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <FadeInUpOnScroll className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-3 relative inline-block">
            Stay Ahead with Expert Insights
            <span className="absolute left-0 bottom-0 w-full h-1 bg-gradient-to-r from-blue-500 to-teal-400 transform origin-left"></span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Access the latest news, events, and resources to help your business
            thrive in Abu Dhabi
          </p>
        </FadeInUpOnScroll>
        {/* Segmented Tabs */}
        <div className="flex justify-center mb-8">
          <SegmentedTabs tabs={tabs} activeTab={activeTab} setActiveTab={handleTabChange} />
        </div>
        {/* Tab Content with Fade Transition */}
        <div className={`transition-opacity duration-300 ${isTabChanging ? 'opacity-0' : 'opacity-100'}`}>
          {/* Loading State */}
          {isLoading && <LoadingIndicator />}
          {/* Error State */}
          {error && !isLoading && <ErrorMessage message={error.message} />}
          {/* News Tab */}
          {activeTab === 0 && !isLoading && !error && <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getNewsData().map((item, index) => <div key={item.id} className="animate-fade-in-up" style={{
            animationDelay: `${index * 0.1}s`
          }}>
                  <NewsCard content={{
              title: item.title,
              description: item.excerpt,
              imageUrl: item.imageUrl,
              tags: [item.category],
              date: item.date,
              source: item.source
            }} onQuickView={() => navigate(`/news/${item.id}`)} />
                </div>)}
            </div>}
          {/* Events Tab */}
          {activeTab === 1 && !isLoading && !error && <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getEventsData().map((event, index) => <div key={event.id} className="animate-fade-in-up" style={{
            animationDelay: `${index * 0.1}s`
          }}>
                  <EventCard 
                    content={{
                      title: event.title,
                      description: `${event.type} at ${event.location}`,
                      dateTime: event.date,
                      location: event.location,
                      imageUrl: event.imageUrl,
                      tags: [event.type],
                      organizer: event.organizer
                    }} 
                    isUpcoming={index === 0} 
                    onQuickView={() => navigate(`/events/${event.id}`)}
                    onRegister={() => handleEventRegister(event)} 
                  />
                </div>)}
            </div>}
          {/* Resources Tab */}
          {activeTab === 2 && !isLoading && !error && <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getResourcesData().map((resource, index) => <div key={resource.id} className="animate-zoom-in" style={{
            animationDelay: `${index * 0.1}s`
          }}>
                  <ResourceCard 
                    content={{
                      title: resource.title,
                      description: resource.description,
                      type: resource.type,
                      icon: resource.icon,
                      tags: resource.tags,
                      downloadUrl: resource.downloadUrl,
                      fileSize: resource.fileSize,
                      downloadCount: resource.downloadCount,
                      lastUpdated: resource.lastUpdated,
                      isExternal: resource.isExternal
                    }} 
                    onQuickView={() => navigate(`/resources/${resource.id}`)}
                    onAccessResource={() => handleResourceAccess(resource)}
                    onDownload={() => handleResourceDownload(resource)}
                  />
                </div>)}
            </div>}
        </div>
      </div>
      {/* Add keyframes for animations */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fade-in-right {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes zoom-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes ripple {
          0% {
            transform: scale(0);
            opacity: 0.5;
          }
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out forwards;
        }
        .animate-fade-in-right {
          animation: fade-in-right 0.5s ease-out forwards;
        }
        .animate-zoom-in {
          animation: zoom-in 0.5s ease-out forwards;
        }
        .animate-ripple {
          animation: ripple 0.8s ease-out;
        }
        .animate-pulse {
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
      `}</style>
    </div>;
};

// Main KnowledgeHub component
const KnowledgeHub: React.FC<KnowledgeHubProps> = ({
  graphqlEndpoint
}) => {
  // Always render without Apollo since we don't have the dependency
  return <KnowledgeHubContent graphqlEndpoint={null} />;
};

export default KnowledgeHub;