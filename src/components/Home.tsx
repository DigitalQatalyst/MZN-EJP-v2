import React, { useMemo, useState, useRef, cloneElement, Component } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, DollarSign, Briefcase, Users, Newspaper, Lightbulb, TrendingUp, Briefcase as JobIcon, Globe, Calendar, BookIcon, Award, MessageCircle, X, Clock, Compass, HeartHandshake, Building, Lock, ArrowRight, ChevronRight, Landmark, GraduationCap, BarChart } from 'lucide-react';
import { AnimatedCounter, FadeInUpOnScroll, useInView } from './AnimationUtils';
// AI Chatbot component
const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  return <>
      {/* Floating button */}
      <button onClick={() => setIsOpen(true)} className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 z-50 animate-pulse hover:animate-none" aria-label="Open AI Assistant">
        <MessageCircle size={24} />
      </button>
      {/* Chat modal */}
      {isOpen && <div className="fixed bottom-24 right-6 w-80 sm:w-96 bg-white rounded-lg shadow-xl z-50 overflow-hidden border border-gray-200 animate-fade-in-up">
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-4 text-white flex justify-between items-center">
            <h3 className="font-medium">AI Assistant</h3>
            <button onClick={() => setIsOpen(false)} className="text-white hover:text-gray-200 transition-colors">
              <X size={18} />
            </button>
          </div>
          <div className="p-4 h-80 overflow-y-auto bg-gray-50">
            <div className="bg-blue-100 p-3 rounded-lg rounded-tl-none inline-block max-w-[85%] animate-fade-in">
              <p className="text-gray-800">
                Hi there! How can I help you navigate the Abu Dhabi Enterprise
                Journey Platform?
              </p>
            </div>
            <div className="mt-4">
              <input type="text" placeholder="Type your question here..." className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300" autoFocus />
            </div>
          </div>
        </div>}
    </>;
};
// Service Category Card Component
const ServiceCard = ({
  service,
  onClick,
  isComingSoon = false
}) => {
  const [isHovered, setIsHovered] = useState(false);
  return <div className={`rounded-xl shadow-md overflow-hidden transition-all duration-500 transform p-6 h-full ${isComingSoon ? 'bg-gradient-to-br from-gray-400 to-gray-500 opacity-75 hover:opacity-85' : `bg-gradient-to-br ${service.gradientFrom} ${service.gradientTo} hover:shadow-lg hover:-translate-y-1 hover:scale-102 cursor-pointer`}`} onClick={isComingSoon ? undefined : onClick} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <div className="flex flex-col h-full relative">
        {isComingSoon && <div className="absolute top-0 right-0 bg-yellow-400 text-xs font-bold px-2 py-1 rounded-full text-gray-800 flex items-center animate-pulse">
            <Clock size={12} className="mr-1" />
            Coming Soon
          </div>}
        <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 shadow-sm transition-all duration-500 ${isHovered ? 'transform -translate-y-2 animate-pulse' : ''}`} style={{
        background: 'white'
      }}>
          <div className={isComingSoon ? 'text-gray-500' : 'text-blue-600'}>
            {cloneElement(service.icon, {
            size: 24,
            className: isComingSoon ? 'text-gray-500' : 'text-blue-600'
          })}
          </div>
        </div>
        <h2 className="text-lg font-semibold text-white mb-1">
          {service.title}
        </h2>
        <p className="text-sm text-white/90 mb-4 flex-grow">
          {service.description}
        </p>
        <button className={`mt-auto px-4 py-2 rounded-md font-medium w-full transition-all duration-500 flex items-center justify-center ${isComingSoon ? 'bg-white text-gray-500 cursor-not-allowed' : 'bg-white text-blue-700 hover:bg-blue-50 border border-white/20'} ${isHovered && !isComingSoon ? 'opacity-100' : 'opacity-80'}`} disabled={isComingSoon} onClick={e => {
        if (!isComingSoon) {
          e.stopPropagation();
          onClick();
        }
      }}>
          {isComingSoon ? <Lock size={14} className="mr-2" /> : 'Explore Now'}
          {!isComingSoon && <ChevronRight size={16} className={`ml-2 transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`} />}
        </button>
        {/* Background animation on hover */}
        {!isComingSoon && <div className="absolute inset-0 bg-white/5 opacity-0 transition-opacity duration-500" style={{
        opacity: isHovered ? 1 : 0
      }}></div>}
      </div>
    </div>;
};
// Category Header Component
interface CategoryHeaderProps {
  icon: React.ReactNode;
  title: string;
  count?: number | null;
}

const CategoryHeader: React.FC<CategoryHeaderProps> = ({
  icon,
  title,
  count = null
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [ref, isInView] = useInView({
    threshold: 0.1
  });
  return <div className="mb-6" ref={ref} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <div className="flex items-center mb-2">
        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3 text-blue-600">
          {icon}
        </div>
        <h2 className="text-2xl font-bold text-gray-800 group relative">
          {title}
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group" style={{
          width: isHovered ? '100%' : '0%'
        }}></span>
        </h2>
      </div>
      {count !== null && <div className="ml-13 text-gray-600">
          <span className="font-semibold mr-1">
            <AnimatedCounter value={count} />+
          </span>
          services available in this category
        </div>}
    </div>;
};
export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  // Define all services with categories
  const allServices = useMemo(() => {
    return {
      finance: [{
        id: 'funding',
        title: 'Business Funding',
        description: 'Access loans, grants, and investment opportunities tailored for Abu Dhabi businesses',
        icon: <DollarSign />,
        path: '/marketplace/non-financial',
        gradientFrom: 'from-blue-600',
        gradientTo: 'to-blue-400',
        isActive: true
      }, {
        id: 'financial',
        title: 'Financial Services',
        description: 'Access financial products to fuel your business growth and sustainability',
        icon: <Landmark />,
        path: '/marketplace/financial',
        gradientFrom: 'from-blue-600',
        gradientTo: 'to-blue-400',
        isActive: true
      }, {
        id: 'investments',
        title: 'Investment Marketplace',
        description: 'Find investment opportunities and funding options for your business',
        icon: <TrendingUp />,
        path: '/investments',
        gradientFrom: 'from-blue-600',
        gradientTo: 'to-blue-400',
        isActive: false
      }, {
        id: 'grants',
        title: 'Grants Directory',
        description: 'Find grants and funding opportunities for your business',
        icon: <Award />,
        path: '/grants',
        gradientFrom: 'from-blue-600',
        gradientTo: 'to-blue-400',
        isActive: false
      }],
      advisory: [{
        id: 'mentorship',
        title: 'Expert Mentorship',
        description: 'Connect with experienced business mentors who can guide your growth strategy',
        icon: <HeartHandshake />,
        path: '/marketplace/mentorship',
        gradientFrom: 'from-purple-600',
        gradientTo: 'to-purple-400',
        isActive: false
      }, {
        id: 'business-services',
        title: 'Business Services',
        description: 'Find professional services to support and grow your business',
        icon: <Briefcase />,
        path: '/marketplace/non-financial',
        gradientFrom: 'from-purple-600',
        gradientTo: 'to-purple-400',
        isActive: true
      }, {
        id: 'opportunities',
        title: 'Strategy Advisory',
        description: 'Discover new business opportunities and strategic partnerships',
        icon: <Lightbulb />,
        path: '/opportunities',
        gradientFrom: 'from-purple-600',
        gradientTo: 'to-purple-400',
        isActive: false
      }],
      growth: [{
        id: 'expansion',
        title: 'Global Expansion',
        description: "Leverage Abu Dhabi's strategic location to expand your business internationally",
        icon: <Compass />,
        path: '/marketplace/expansion',
        gradientFrom: 'from-teal-600',
        gradientTo: 'to-teal-400',
        isActive: false
      }, {
        id: 'communities',
        title: 'Business Communities',
        description: 'Connect with business networks and expand your professional connections',
        icon: <Users />,
        path: '/communities',
        gradientFrom: 'from-teal-600',
        gradientTo: 'to-teal-400',
        isActive: true
      }, {
        id: 'events',
        title: 'Networking Events',
        description: 'Discover and join business events and networking opportunities',
        icon: <Calendar />,
        path: '/events',
        gradientFrom: 'from-teal-600',
        gradientTo: 'to-teal-400',
        isActive: false
      }, {
        id: 'jobs',
        title: 'Jobs Marketplace',
        description: 'Find talent or explore career opportunities',
        icon: <JobIcon />,
        path: '/jobs',
        gradientFrom: 'from-teal-600',
        gradientTo: 'to-teal-400',
        isActive: false
      }],
      learning: [{
        id: 'courses',
        title: 'Learning & Development',
        description: 'Discover courses and training programs to enhance your business skills',
        icon: <BookOpen />,
        path: '/marketplace/courses',
        gradientFrom: 'from-amber-600',
        gradientTo: 'to-amber-400',
        isActive: true
      }, {
        id: 'digital',
        title: 'Digital Solutions',
        description: 'Explore digital tools and solutions for your business',
        icon: <Globe />,
        path: '/digital-services',
        gradientFrom: 'from-amber-600',
        gradientTo: 'to-amber-400',
        isActive: false
      }, {
        id: 'news',
        title: 'Knowledge Hub',
        description: 'Stay updated with the latest business news and industry insights',
        icon: <Newspaper />,
        path: '/news',
        gradientFrom: 'from-amber-600',
        gradientTo: 'to-amber-400',
        isActive: false
      }, {
        id: 'law',
        title: 'Legal & Compliance',
        description: 'Access resources on UAE business laws and regulations',
        icon: <BookIcon />,
        path: '/law',
        gradientFrom: 'from-amber-600',
        gradientTo: 'to-amber-400',
        isActive: false
      }]
    };
  }, []);
  // State for managing "View All" modal
  const [showAllComingSoon, setShowAllComingSoon] = useState(false);
  // Function to handle service click
  const handleServiceClick = path => {
    navigate(path);
  };
  return <div className="bg-white py-16">
      <div className="container mx-auto px-4">
        {/* Marketplaces by Category */}
        <div className="mb-16">
          <FadeInUpOnScroll className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Services & Marketplaces
            </h2>
            <div className="relative">
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Discover tailored solutions organized by category to accelerate
                your business growth in Abu Dhabi
              </p>
              <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-blue-500 to-teal-400"></div>
            </div>
          </FadeInUpOnScroll>
          {/* Finance & Funding Category */}
          <div className="mb-10">
            <FadeInUpOnScroll>
              <CategoryHeader icon={<DollarSign size={24} />} title="Finance & Funding" count={12} />
            </FadeInUpOnScroll>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {allServices.finance.map((service, index) => <FadeInUpOnScroll key={service.id} delay={index * 0.1}>
                  <ServiceCard service={service} onClick={() => handleServiceClick(service.path)} isComingSoon={!service.isActive} />
                </FadeInUpOnScroll>)}
            </div>
          </div>
          {/* Advisory & Expertise Category */}
          <div className="mb-10">
            <FadeInUpOnScroll>
              <CategoryHeader icon={<BarChart size={24} />} title="Advisory & Expertise" count={8} />
            </FadeInUpOnScroll>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {allServices.advisory.map((service, index) => <FadeInUpOnScroll key={service.id} delay={index * 0.1}>
                  <ServiceCard service={service} onClick={() => handleServiceClick(service.path)} isComingSoon={!service.isActive} />
                </FadeInUpOnScroll>)}
            </div>
          </div>
          {/* Growth & Expansion Category */}
          <div className="mb-10">
            <FadeInUpOnScroll>
              <CategoryHeader icon={<Globe size={24} />} title="Growth & Expansion" count={10} />
            </FadeInUpOnScroll>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {allServices.growth.map((service, index) => <FadeInUpOnScroll key={service.id} delay={index * 0.1}>
                  <ServiceCard service={service} onClick={() => handleServiceClick(service.path)} isComingSoon={!service.isActive} />
                </FadeInUpOnScroll>)}
            </div>
          </div>
          {/* Learning & Enablement Category */}
          <div className="mb-10">
            <FadeInUpOnScroll>
              <CategoryHeader icon={<GraduationCap size={24} />} title="Learning & Enablement" count={15} />
            </FadeInUpOnScroll>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {allServices.learning.map((service, index) => <FadeInUpOnScroll key={service.id} delay={index * 0.1}>
                  <ServiceCard service={service} onClick={() => handleServiceClick(service.path)} isComingSoon={!service.isActive} />
                </FadeInUpOnScroll>)}
            </div>
          </div>
        </div>
      </div>
      {/* AI Chatbot */}
      <AIChatbot />
      {/* Add keyframes for animations */}
      <style jsx>{`
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
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
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
        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out forwards;
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
        .animate-scale-in {
          animation: scale-in 0.3s ease-out forwards;
        }
        .animate-pulse {
          animation: pulse 2s infinite;
        }
        .hover\:scale-102:hover {
          transform: scale(1.02);
        }
      `}</style>
    </div>;
};
export default HomePage;