import React, { useEffect, useState, useRef } from 'react';
import { Star, Award, TrendingUp, Users, DollarSign, Play, X, ChevronLeft, ChevronRight, Building2, Landmark, Network, Users2 } from 'lucide-react';
import { AnimatedCounter, FadeInUpOnScroll, StaggeredFadeIn, AutoScrollMarquee, HorizontalScrollReveal, useInView } from './AnimationUtils';
interface Testimonial {
  id: string;
  name: string;
  position: string;
  company: string;
  companyLogo: string;
  avatar: string;
  quote: string;
  fullQuote: string;
  rating: number;
  videoThumbnail: string;
  videoUrl: string;
  metric: string;
  metricLabel: string;
  metricColor: 'green' | 'blue';
}
const testimonials: Testimonial[] = [{
  id: '1',
  name: 'Ahmed Al Mansoori',
  position: 'Founder & CEO',
  company: 'TechInnovate',
  companyLogo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
  quote: 'The Enterprise Journey Platform connected us with the right financial services that helped us scale our operations across the UAE.',
  fullQuote: "The Enterprise Journey Platform connected us with the right financial services that helped us scale our operations across the UAE. The guidance was invaluable and we saw immediate results. Our company has grown by 300% in the last year alone, and we've been able to expand into new markets thanks to the connections and resources provided by the platform.",
  rating: 5,
  videoThumbnail: 'https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  videoUrl: 'https://samplelib.com/lib/preview/mp4/sample-5s.mp4',
  metric: 'AED 5M',
  metricLabel: 'Raised',
  metricColor: 'green'
}, {
  id: '2',
  name: 'Fatima Al Hashimi',
  position: 'Managing Director',
  company: 'Green Solutions',
  companyLogo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?q=80&w=2073&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
  quote: 'As a sustainable business, we found specialized support through the platform that understood our unique needs.',
  fullQuote: "As a sustainable business, we found specialized support through the platform that understood our unique needs. The mentorship programs transformed our approach to market entry and helped us navigate regulatory challenges. We've been able to reduce our time to market by 40%, which has been crucial in our competitive industry.",
  rating: 5,
  videoThumbnail: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  videoUrl: 'https://samplelib.com/lib/preview/mp4/sample-10s.mp4',
  metric: '40%',
  metricLabel: 'Faster Market Entry',
  metricColor: 'blue'
}, {
  id: '3',
  name: 'Mohammed Al Zaabi',
  position: 'Co-founder',
  company: 'Falcon Logistics',
  companyLogo: 'https://images.unsplash.com/photo-1566125882500-87e10f726cdc?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
  quote: "From startup to expansion, the platform has been our trusted partner. The courses and community connections opened doors we didn't know existed.",
  fullQuote: "From startup to expansion, the platform has been our trusted partner. The courses and community connections opened doors we didn't know existed. We've experienced 200% growth in our customer base since joining the platform, and we've been able to secure contracts with major players in the logistics industry.",
  rating: 4,
  videoThumbnail: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  videoUrl: 'https://samplelib.com/lib/preview/mp4/sample-15s.mp4',
  metric: '200%',
  metricLabel: 'Customer Growth',
  metricColor: 'green'
}];
// Partner categories for the grid
const partnerCategories = [{
  id: 'government',
  title: 'Government Bodies',
  subtitle: 'Key regulatory authorities and public sector partners',
  icon: <Building2 size={28} />,
  metric: '25+',
  color: 'indigo-600'
}, {
  id: 'financial',
  title: 'Financial Partners',
  subtitle: 'Banks, investment firms, and funding institutions',
  icon: <Landmark size={28} />,
  metric: '50+',
  color: 'yellow-500'
}, {
  id: 'service',
  title: 'Service Providers',
  subtitle: 'Specialized business support and consultancy',
  icon: <Users2 size={28} />,
  metric: '500+',
  color: 'blue-600'
}, {
  id: 'network',
  title: 'Business Network',
  subtitle: 'Community of enterprises and industry leaders',
  icon: <Network size={28} />,
  metric: '5000+',
  color: 'orange-500'
}];
const partnerLogos = [
  { name: 'Abu Dhabi Ports', logo: '/logo/ad-ports-logo.webp' },
  { name: 'Abu Dhabi SME Hub', logo: '/logo/ad-sme-hub-logo.webp' },
  { name: 'ADCB', logo: '/logo/adcb-logo.webp' },
  { name: 'ADIB', logo: '/logo/adib-logo.webp' },
  { name: 'ADQ', logo: '/logo/adq-logo.webp' },
  { name: 'ALDAR', logo: '/logo/aldar-logo.webp' },
  { name: 'ASPIRE', logo: '/logo/aspire-logo.webp' },
  { name: 'ATRC', logo: '/logo/atrc-logo.webp' },
  { name: 'Emirates Development Bank', logo: '/logo/edb-logo.webp' },
  { name: 'Etihad Airways', logo: '/logo/etihad-logo.webp' },
  { name: 'Etisalat', logo: '/logo/etisalat-logo.webp' },
  { name: 'First Abu Dhabi Bank', logo: '/logo/fab-logo.webp' },
  { name: 'Masdar', logo: '/logo/masdar-logo.webp' },
  { name: 'Mohammed Bin Zayed Innovation Fund', logo: '/logo/mbzif-logo.webp' },
  { name: 'Mubadala', logo: '/logo/mubadala-logo.webp' },
  { name: 'TII', logo: '/logo/tii-logo.webp' },
  { name: 'Venture One', logo: '/logo/venture-one-logo.webp' }
];
const strategicPartners = [{
  name: 'Abu Dhabi Department of Economic Development',
  logo: '/logo/addad-logo.webp'
}, {
  name: 'Abu Dhabi Investment Office',
  logo: '/logo/abio-logo.webp'
}, {
  name: 'Mubadala',
  logo: '/logo/mubadala-logo.webp'
}, {
  name: 'First Abu Dhabi Bank',
  logo: '/logo/fab-logo.webp'
}, {
  name: 'Etihad Airways',
  logo: '/logo/etihad-logo.webp'
}];
const impactStats = [{
  label: 'SMEs Supported',
  value: 5000,
  icon: <Users size={24} className="text-blue-600" />
}, {
  label: 'Funding Facilitated',
  value: 500,
  prefix: 'AED ',
  suffix: 'M+',
  icon: <DollarSign size={24} className="text-blue-600" />
}, {
  label: 'Services Accessed',
  value: 15000,
  suffix: '+',
  icon: <TrendingUp size={24} className="text-blue-600" />
}, {
  label: 'Success Rate',
  value: 87,
  suffix: '%',
  icon: <Award size={24} className="text-blue-600" />
}];
const VideoTestimonialCard = ({
  testimonial,
  onClick
}: {
  testimonial: Testimonial;
  onClick: () => void;
}) => {
  const [isHovering, setIsHovering] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  // Handle hover state
  useEffect(() => {
    if (videoRef.current) {
      if (isHovering) {
        videoRef.current.play().catch(error => console.error('Video play error:', error));
      } else {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    }
  }, [isHovering]);
  return <div className="relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 h-[300px] cursor-pointer group" onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)} onClick={onClick}>
      {/* Video/Thumbnail Background */}
      <div className="absolute inset-0 bg-gray-900 overflow-hidden">
        {/* Thumbnail (shown by default) */}
        <img src={testimonial.videoThumbnail} alt={`${testimonial.name} from ${testimonial.company}`} className={`w-full h-full object-cover transition-opacity duration-300 ${isHovering ? 'opacity-0' : 'opacity-100'}`} />
        {/* Video (plays on hover) */}
        <video ref={videoRef} src={testimonial.videoUrl} className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${isHovering ? 'opacity-100' : 'opacity-0'}`} muted playsInline loop />
      </div>
      {/* Overlay with content */}
      <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30 p-6 flex flex-col transition-all duration-300 ${isHovering ? 'bg-black/60' : ''}`}>
        {/* Company Logo */}
        <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm overflow-hidden mb-4">
          <img src={testimonial.companyLogo} alt={testimonial.company} className="w-full h-full object-cover" />
        </div>
        {/* Metric */}
        <div className="mt-auto">
          <div className={`text-2xl font-bold mb-1 ${testimonial.metricColor === 'green' ? 'text-green-500' : 'text-blue-500'}`}>
            {testimonial.metric}{' '}
            <span className="text-white text-lg font-medium">
              {testimonial.metricLabel}
            </span>
          </div>
          {/* Quote preview */}
          <p className="text-white/90 text-sm line-clamp-2 mb-3">
            "{testimonial.quote}"
          </p>
          {/* Person details */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <img src={testimonial.avatar} alt={testimonial.name} className="w-8 h-8 rounded-full mr-2 border border-white/30" />
              <div>
                <p className="text-white text-sm font-medium">
                  {testimonial.name}
                </p>
                <p className="text-white/70 text-xs">
                  {testimonial.position}, {testimonial.company}
                </p>
              </div>
            </div>
            {/* Play button */}
            <div className={`w-10 h-10 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center transition-all duration-300 ${isHovering ? 'animate-pulse bg-white/50' : ''}`}>
              <Play size={18} className="text-white ml-1" />
            </div>
          </div>
        </div>
      </div>
    </div>;
};
const TestimonialModal = ({
  testimonial,
  isOpen,
  onClose
}: {
  testimonial: Testimonial | null;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  // Close modal when clicking outside content
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);
  if (!isOpen || !testimonial) return null;
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm transition-all duration-300">
      <div ref={modalRef} className="bg-white rounded-2xl overflow-hidden max-w-4xl w-full max-h-[90vh] shadow-2xl transform transition-all duration-300 animate-fadeIn">
        <div className="relative">
          {/* Video */}
          <div className="w-full aspect-video bg-gray-900">
            <video src={testimonial.videoUrl} controls autoPlay className="w-full h-full object-cover" />
          </div>
          {/* Close button */}
          <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-all" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <div className="p-6">
          <div className="flex items-center mb-4">
            <img src={testimonial.companyLogo} alt={testimonial.company} className="w-12 h-12 rounded-full object-cover mr-4" />
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                How {testimonial.company} scaled with Enterprise Journey
              </h3>
              <div className="flex items-center mt-1">
                {[...Array(5)].map((_, i) => <Star key={i} size={16} className={i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} />)}
              </div>
            </div>
          </div>
          <div className="flex items-start mb-6">
            <img src={testimonial.avatar} alt={testimonial.name} className="w-12 h-12 rounded-full object-cover mr-4 mt-1" />
            <div>
              <p className="text-gray-700 italic mb-3">
                "{testimonial.fullQuote}"
              </p>
              <div>
                <p className="font-medium text-gray-900">{testimonial.name}</p>
                <p className="text-sm text-gray-600">
                  {testimonial.position}, {testimonial.company}
                </p>
              </div>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${testimonial.metricColor === 'green' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                  {testimonial.metric} {testimonial.metricLabel}
                </span>
              </div>
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center" onClick={onClose}>
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
const VideoTestimonialCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  // Auto-scroll functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);
  // Scroll to active index
  useEffect(() => {
    if (carouselRef.current) {
      const scrollAmount = activeIndex * (carouselRef.current.scrollWidth / testimonials.length);
      carouselRef.current.scrollTo({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  }, [activeIndex]);
  const handlePrev = () => {
    setActiveIndex(prev => (prev - 1 + testimonials.length) % testimonials.length);
  };
  const handleNext = () => {
    setActiveIndex(prev => (prev + 1) % testimonials.length);
  };
  const openModal = (testimonial: Testimonial) => {
    setSelectedTestimonial(testimonial);
    setIsModalOpen(true);
  };
  return <div className="relative">
      {/* Carousel container */}
      <div ref={carouselRef} className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth gap-6 pb-8" style={{
      scrollbarWidth: 'none',
      msOverflowStyle: 'none'
    }}>
        {testimonials.map((testimonial, index) => <div key={testimonial.id} className="min-w-full sm:min-w-[calc(100%/2-12px)] lg:min-w-[calc(100%/3-16px)] flex-shrink-0 snap-center">
            <FadeInUpOnScroll delay={index * 0.1}>
              <VideoTestimonialCard testimonial={testimonial} onClick={() => openModal(testimonial)} />
            </FadeInUpOnScroll>
          </div>)}
      </div>
      {/* Navigation controls */}
      <div className="absolute top-1/2 left-0 right-0 flex justify-between items-center transform -translate-y-1/2 pointer-events-none px-4">
        <button className="w-10 h-10 rounded-full bg-white/80 shadow-md flex items-center justify-center text-gray-800 hover:bg-white transition-all pointer-events-auto" onClick={handlePrev} aria-label="Previous testimonial">
          <ChevronLeft size={20} />
        </button>
        <button className="w-10 h-10 rounded-full bg-white/80 shadow-md flex items-center justify-center text-gray-800 hover:bg-white transition-all pointer-events-auto" onClick={handleNext} aria-label="Next testimonial">
          <ChevronRight size={20} />
        </button>
      </div>
      {/* Pagination indicators */}
      <div className="flex justify-center mt-4 gap-2">
        {testimonials.map((_, index) => <button key={index} className={`w-2 h-2 rounded-full transition-all ${activeIndex === index ? 'bg-blue-600 w-6' : 'bg-gray-300'}`} onClick={() => setActiveIndex(index)} aria-label={`Go to testimonial ${index + 1}`} />)}
      </div>
      {/* Modal */}
      <TestimonialModal testimonial={selectedTestimonial} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      {/* Add keyframes for animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>;
};
// Partner Category Card component
const PartnerCategoryCard = ({
  category,
  index
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [ref, isInView] = useInView({
    threshold: 0.1
  });
  // Trigger animation once when card comes into view
  useEffect(() => {
    if (isInView && !hasAnimated) {
      setHasAnimated(true);
    }
  }, [isInView, hasAnimated]);
  return <div ref={ref} className={`relative overflow-hidden rounded-xl p-6 transition-all duration-500 ease-out transform ${isHovered ? 'shadow-md scale-[1.02]' : 'shadow-sm'}`} style={{
    background: isHovered ? `linear-gradient(to bottom right, #f9fafb, #ffffff)` : '#ffffff'
  }} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      {/* Icon with animated container */}
      <div className={`w-14 h-14 rounded-lg flex items-center justify-center mb-4 transition-all duration-300 ${isHovered ? 'scale-110' : ''}`} style={{
      backgroundColor: `rgba(var(--color-${category.color}-rgb), 0.1)`,
      color: `var(--color-${category.color})`
    }}>
        <div className={`transition-transform duration-500 ${isHovered ? 'animate-bounce-subtle' : ''}`}>
          {category.icon}
        </div>
      </div>
      {/* Title */}
      <h3 className="text-lg font-semibold text-gray-900 mb-1">
        {category.title}
      </h3>
      {/* Subtitle */}
      <p className="text-sm text-gray-600 mb-4">{category.subtitle}</p>
      {/* Metric */}
      <div className={`text-3xl font-bold transition-all duration-300 ${isHovered ? `text-${category.color}` : `text-${category.color}`}`}>
        {hasAnimated && <AnimatedCounter value={parseInt(category.metric)} />}
        {!hasAnimated && '0'}
        {category.metric.includes('+') && '+'}
      </div>
    </div>;
};
// Partner Logo component with hover effect
const PartnerLogo = ({
  partner,
  index
}) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div 
      className={`relative mx-6 my-2 transition-all duration-300 ease-out transform ${isHovered ? 'scale-110' : ''}`} 
      onMouseEnter={() => setIsHovered(true)} 
      onMouseLeave={() => setIsHovered(false)}
    >
      <img 
        src={partner.logo} 
        alt={partner.name} 
        className="h-12 object-contain transition-all duration-500"
        style={{
          filter: isHovered ? 'none' : 'grayscale(100%)',
          opacity: isHovered ? 1 : 0.7,
          width: 'auto',
          maxWidth: '120px'
        }} 
      />
    </div>
  );
};
// Featured Partners Carousel component
const FeaturedPartnersCarousel = () => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const allPartners = [...strategicPartners, ...partnerLogos];
  const totalPartners = allPartners.length;
  // Auto-scroll functionality
  useEffect(() => {
    const interval = setInterval(() => {
      if (carouselRef.current) {
        const maxScroll = carouselRef.current.scrollWidth - carouselRef.current.clientWidth;
        const currentScroll = carouselRef.current.scrollLeft;
        // If we're at the end, reset to the beginning
        if (currentScroll >= maxScroll - 10) {
          carouselRef.current.scrollTo({
            left: 0,
            behavior: 'smooth'
          });
        } else {
          // Otherwise, scroll a bit more
          carouselRef.current.scrollTo({
            left: currentScroll + 200,
            behavior: 'smooth'
          });
        }
      }
    }, 5000);
    return () => clearInterval(interval);
  }, []);
  const handlePrev = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollTo({
        left: carouselRef.current.scrollLeft - 300,
        behavior: 'smooth'
      });
    }
  };
  const handleNext = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollTo({
        left: carouselRef.current.scrollLeft + 300,
        behavior: 'smooth'
      });
    }
  };
  return <div className="relative py-8">
      {/* Heading */}
      <FadeInUpOnScroll className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Featured Partners
        </h3>
        <p className="text-gray-600">
          Trusted by leading organizations across the UAE
        </p>
      </FadeInUpOnScroll>
      {/* Carousel container */}
      <div className="relative overflow-hidden">
        <div ref={carouselRef} className="flex overflow-x-auto py-4 scrollbar-hide" style={{
        scrollbarWidth: 'none',
        msOverflowStyle: 'none'
      }}>
          {/* Double the partners for infinite scroll effect */}
          {[...allPartners, ...allPartners].map((partner, index) => <PartnerLogo key={`${partner.name}-${index}`} partner={partner} index={index} />)}
        </div>
        {/* Navigation arrows */}
        <div className="absolute top-1/2 left-0 right-0 flex justify-between items-center transform -translate-y-1/2 pointer-events-none px-4">
          <button className="w-10 h-10 rounded-full bg-white/90 shadow-md flex items-center justify-center text-gray-800 hover:bg-white transition-all pointer-events-auto" onClick={handlePrev} aria-label="Previous partners">
            <ChevronLeft size={20} />
          </button>
          <button className="w-10 h-10 rounded-full bg-white/90 shadow-md flex items-center justify-center text-gray-800 hover:bg-white transition-all pointer-events-auto" onClick={handleNext} aria-label="Next partners">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>;
};
const ProofAndTrust: React.FC = () => {
  return <div className="bg-white py-16">
      <div className="container mx-auto px-4">
        {/* Why Abu Dhabi / Platform Impact */}
        <div className="mb-16">
          <FadeInUpOnScroll className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Why Abu Dhabi for Your Business Growth
            </h2>
            <div className="relative">
              <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
                Abu Dhabi provides a strategic location, world-class
                infrastructure, and a business-friendly environment for
                enterprises at every stage
              </p>
              <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-blue-500 to-teal-400"></div>
            </div>
          </FadeInUpOnScroll>
          <StaggeredFadeIn className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto" staggerDelay={0.15}>
            {impactStats.map((stat, index) => <div key={index} className="bg-blue-50 rounded-lg p-6 text-center shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex justify-center mb-3">
                  <div className="relative">
                    {stat.icon}
                    <div className="absolute inset-0 bg-blue-400 rounded-full opacity-0 animate-ping-slow"></div>
                  </div>
                </div>
                <div className="text-3xl font-bold text-blue-700 mb-2 flex justify-center">
                  {stat.prefix && <span>{stat.prefix}</span>}
                  <AnimatedCounter value={stat.value} />
                  {stat.suffix && <span>{stat.suffix}</span>}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>)}
          </StaggeredFadeIn>
        </div>
        {/* Success Stories */}
        <div className="mb-16 bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 md:p-12 overflow-hidden relative">
          <FadeInUpOnScroll className="text-center mb-10 relative z-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Success Stories from Abu Dhabi Enterprises
            </h2>
            <div className="relative">
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Hear how SMEs scaled their business using the Enterprise Journey
                Platform
              </p>
              <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-blue-500 to-teal-400"></div>
            </div>
          </FadeInUpOnScroll>
          <VideoTestimonialCarousel />
        </div>
        {/* Powered by Strategic Partnerships - NEW SECTION */}
        <div className="mb-16 bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 md:p-12 overflow-hidden relative">
          {/* Section Title with Animation */}
          <HorizontalScrollReveal direction="left" className="text-center mb-10 relative z-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-3 relative inline-block">
              Powered by Strategic Partnerships
              <span className="absolute -bottom-1 left-0 w-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 animate-expand-line"></span>
            </h2>
            <div className="relative">
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Our network of government bodies, financial institutions, and
                service providers ensures comprehensive support for your
                business journey
              </p>
            </div>
          </HorizontalScrollReveal>
          {/* Partner Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {partnerCategories.map((category, index) => <FadeInUpOnScroll key={category.id} delay={index * 0.15}>
                <PartnerCategoryCard category={category} index={index} />
              </FadeInUpOnScroll>)}
          </div>
          {/* Featured Partners Carousel */}
          <FeaturedPartnersCarousel />
        </div>
        {/* Add keyframes for animations */}
        <style jsx>{`
          @keyframes animate-gradient-shift {
            0% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
            100% {
              background-position: 0% 50%;
            }
          }
          @keyframes ping-slow {
            0% {
              transform: scale(1);
              opacity: 0.8;
            }
            70%,
            100% {
              transform: scale(2);
              opacity: 0;
            }
          }
          @keyframes bounce-subtle {
            0%,
            100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-5px);
            }
          }
          @keyframes float {
            0%,
            100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-8px);
            }
          }
          @keyframes expand-line {
            0% {
              width: 0;
            }
            100% {
              width: 100%;
            }
          }
          .animate-ping-slow {
            animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
          }
          .animate-bounce-subtle {
            animation: bounce-subtle 2s ease-in-out infinite;
          }
          .animate-float {
            animation: float 3s ease-in-out infinite;
          }
          .animate-expand-line {
            animation: expand-line 1.5s ease-out forwards;
          }
          .animate-gradient-shift {
            background-size: 200% 200%;
            animation: animate-gradient-shift 15s ease infinite;
          }
        `}</style>
        {/* CSS Variables for dynamic colors */}
        <style jsx global>{`
          :root {
            --color-indigo-600: #4f46e5;
            --color-indigo-600-rgb: 79, 70, 229;
            --color-yellow-500: #eab308;
            --color-yellow-500-rgb: 234, 179, 8;
            --color-blue-600: #2563eb;
            --color-blue-600-rgb: 37, 99, 235;
            --color-orange-500: #f97316;
            --color-orange-500-rgb: 249, 115, 22;
          }
        `}</style>
      </div>
    </div>;
};
export default ProofAndTrust;