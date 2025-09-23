import React, { useEffect, useState, useRef } from 'react';
import { Lightbulb, Code, Rocket, TrendingUp, BarChart3, Award, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { FadeInUpOnScroll, HorizontalScrollReveal } from './AnimationUtils';
interface StageCardProps {
  title: string;
  description: string;
  benefits: string[];
  icon: React.ReactNode;
  ctaText: string;
  onClick: () => void;
  index: number;
  activeIndex: number;
  setActiveIndex: (index: number) => void;
}
const StageCard: React.FC<StageCardProps> = ({
  title,
  description,
  benefits,
  icon,
  ctaText,
  onClick,
  index,
  activeIndex,
  setActiveIndex
}) => {
  const isActive = index === activeIndex;
  return <div className={`bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 min-w-[300px] flex-shrink-0 md:min-w-0 relative ${isActive ? 'shadow-lg transform scale-105 md:scale-100 border-2 border-blue-500' : 'hover:shadow-lg hover:-translate-y-1'}`} onMouseEnter={() => setActiveIndex(index)}>
      <div className="p-6 flex flex-col h-full">
        <div className="flex items-center mb-4">
          <div className={`p-3 rounded-full mr-4 transition-colors duration-300 ${isActive ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-600'}`}>
            {icon}
          </div>
          <h3 className="text-xl font-bold text-gray-800">{title}</h3>
        </div>
        <p className="text-gray-600 mb-4">{description}</p>
        <div className="mb-6">
          <h4 className="font-semibold text-gray-700 mb-2">Key Benefits:</h4>
          <ul className="text-gray-600 space-y-1">
            {benefits.map((benefit, i) => <li key={i} className="flex items-start">
                <span className={`mr-2 transition-colors duration-300 ${isActive ? 'text-blue-500' : 'text-blue-600'}`}>
                  •
                </span>
                <span>{benefit}</span>
              </li>)}
          </ul>
        </div>
        <button onClick={onClick} className={`mt-auto text-white font-medium py-2 px-4 rounded-md transition-all duration-300 flex items-center justify-center overflow-hidden group ${isActive ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800' : 'bg-blue-600 hover:bg-blue-700'}`}>
          {ctaText}
          <ArrowRight size={16} className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
        </button>
      </div>
      {/* Stage number indicator */}
      <div className={`absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${isActive ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'}`}>
        {index + 1}
      </div>
    </div>;
};
const EnterpriseStages: React.FC = () => {
  const navigate = useNavigate();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const timelineRef = useRef<HTMLDivElement>(null);
  // Scroll left/right controls
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -300,
        behavior: 'smooth'
      });
    }
  };
  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 300,
        behavior: 'smooth'
      });
    }
  };
  // Animate timeline when in view
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsInView(true);
      }
    }, {
      threshold: 0.2
    });
    if (timelineRef.current) {
      observer.observe(timelineRef.current);
    }
    return () => {
      if (timelineRef.current) {
        observer.unobserve(timelineRef.current);
      }
    };
  }, []);
  const stages = [{
    id: 'ideation',
    title: 'Ideation',
    description: 'Transform your business idea into a viable concept',
    benefits: ['Idea validation workshops', 'Market research support', 'Business model canvas tools'],
    icon: <Lightbulb size={24} className="transition-colors duration-300" />,
    ctaText: 'Start Your Idea',
    path: '/stages/ideation'
  }, {
    id: 'launch',
    title: 'Launch',
    description: 'Set up and launch your business in Abu Dhabi',
    benefits: ['Business registration support', 'Startup funding access', 'Office space solutions'],
    icon: <Rocket size={24} className="transition-colors duration-300" />,
    ctaText: 'Launch Your Business',
    path: '/stages/launch'
  }, {
    id: 'growth',
    title: 'Growth',
    description: 'Scale your operations and expand your customer base',
    benefits: ['Growth financing options', 'Marketing & sales support', 'Talent acquisition services'],
    icon: <TrendingUp size={24} className="transition-colors duration-300" />,
    ctaText: 'Accelerate Growth',
    path: '/stages/growth'
  }, {
    id: 'expansion',
    title: 'Expansion',
    description: 'Enter new markets and diversify your business',
    benefits: ['International market entry', 'Product diversification', 'Strategic partnerships'],
    icon: <BarChart3 size={24} className="transition-colors duration-300" />,
    ctaText: 'Expand Your Reach',
    path: '/stages/expansion'
  }, {
    id: 'optimization',
    title: 'Optimization',
    description: 'Streamline operations and maximize efficiency',
    benefits: ['Process optimization', 'Technology integration', 'Cost reduction strategies'],
    icon: <Award size={24} className="transition-colors duration-300" />,
    ctaText: 'Optimize Operations',
    path: '/stages/optimization'
  }, {
    id: 'transformation',
    title: 'Transformation',
    description: 'Reinvent your business model for future growth',
    benefits: ['Digital transformation', 'Business model innovation', 'Sustainability integration'],
    icon: <Code size={24} className="transition-colors duration-300" />,
    ctaText: 'Transform Your Business',
    path: '/stages/transformation'
  }];
  return <div className="bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <FadeInUpOnScroll className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Business Growth Journey
          </h2>
          <div className="relative">
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Find the right support for every stage of your business
              development
            </p>
            <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-blue-500 to-teal-400"></div>
          </div>
        </FadeInUpOnScroll>
        {/* Timeline connector (visible on desktop) */}
        <div ref={timelineRef} className="hidden lg:block relative max-w-6xl mx-auto h-2 bg-gray-200 rounded-full my-12">
          <div className="absolute top-0 left-0 h-2 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full transition-all duration-1000 ease-out" style={{
          width: isInView ? `${(activeIndex + 1) / stages.length * 100}%` : '0%'
        }}></div>
          {/* Stage markers */}
          {stages.map((_, index) => <div key={index} className={`absolute top-0 transform -translate-y-1/2 w-6 h-6 rounded-full transition-all duration-500 ${index <= activeIndex ? 'bg-blue-500 border-2 border-white' : 'bg-gray-300'}`} style={{
          left: `calc(${index / (stages.length - 1) * 100}% - 12px)`,
          transform: 'translateY(-50%)',
          transition: 'background-color 0.5s ease-out'
        }} onClick={() => setActiveIndex(index)}></div>)}
        </div>
        {/* Scroll Controls - Desktop */}
        <div className="hidden md:flex justify-end mb-4 space-x-2">
          <button onClick={scrollLeft} className="p-2 rounded-full bg-white shadow hover:bg-gray-100 transition-colors duration-300" aria-label="Scroll left">
            <ChevronLeft size={20} />
          </button>
          <button onClick={scrollRight} className="p-2 rounded-full bg-white shadow hover:bg-gray-100 transition-colors duration-300" aria-label="Scroll right">
            <ChevronRight size={20} />
          </button>
        </div>
        {/* Scrollable Container */}
        <div ref={scrollContainerRef} className="flex overflow-x-auto pb-6 gap-6 md:grid md:grid-cols-2 lg:grid-cols-3 md:overflow-x-visible scrollbar-hide" style={{
        scrollbarWidth: 'none',
        msOverflowStyle: 'none'
      }}>
          {stages.map((stage, index) => <HorizontalScrollReveal key={stage.id} direction={index % 2 === 0 ? 'left' : 'right'} distance={50} threshold={0.2}>
              <StageCard title={stage.title} description={stage.description} benefits={stage.benefits} icon={stage.icon} ctaText={stage.ctaText} onClick={() => navigate(stage.path)} index={index} activeIndex={activeIndex} setActiveIndex={setActiveIndex} />
            </HorizontalScrollReveal>)}
        </div>
        {/* Mobile Scroll Indicator */}
        <div className="flex md:hidden justify-center mt-4">
          <div className="flex space-x-1">
            {stages.map((_, index) => <button key={index} className={`h-1 rounded-full w-6 transition-all duration-300 ${index === activeIndex ? 'bg-blue-600 w-10' : 'bg-gray-300'}`} onClick={() => setActiveIndex(index)} aria-label={`Go to stage ${index + 1}`} />)}
          </div>
        </div>
      </div>
    </div>;
};
export default EnterpriseStages;