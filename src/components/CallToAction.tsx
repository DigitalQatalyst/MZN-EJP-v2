import React, { useEffect, useState, useRef } from 'react';
import { ArrowRight, Building, Users, ChevronRight, MessageCircle, Phone, CheckCircle, X, Briefcase } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { FadeInUpOnScroll, useInView } from './AnimationUtils';

// Animated shape component
const FloatingShape = ({
  size,
  color,
  delay,
  duration,
  className = ''
}) => {
  return <div className={`absolute rounded-full opacity-30 animate-float ${className}`} style={{
    width: `${size}px`,
    height: `${size}px`,
    background: color,
    animationDuration: `${duration}s`,
    animationDelay: `${delay}s`
  }}></div>;
};

// Form input component
const FormInput = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  required = false
}) => {
  return <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input type={type} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" placeholder={placeholder} value={value} onChange={onChange} required={required} />
    </div>;
};

// Form select component
const FormSelect = ({
  label,
  options,
  value,
  onChange,
  required = false
}) => {
  return <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" value={value} onChange={onChange} required={required}>
        <option value="">Select an option</option>
        {options.map(option => <option key={option.value} value={option.value}>
            {option.label}
          </option>)}
      </select>
    </div>;
};

// Form textarea component
const FormTextarea = ({
  label,
  placeholder,
  value,
  onChange,
  required = false
}) => {
  return <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <textarea className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" placeholder={placeholder} value={value} onChange={onChange} required={required} rows={4}></textarea>
    </div>;
};

// Toast notification component
const Toast = ({
  message,
  type = 'success',
  onClose
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);
  return <div className="fixed bottom-4 right-4 z-50 animate-slide-up">
      <div className={`rounded-lg shadow-lg p-4 flex items-start ${type === 'success' ? 'bg-green-50 border-l-4 border-green-500' : 'bg-red-50 border-l-4 border-red-500'}`}>
        <div className={`flex-shrink-0 mr-3 ${type === 'success' ? 'text-green-500' : 'text-red-500'}`}>
          {type === 'success' ? <CheckCircle size={20} /> : <X size={20} />}
        </div>
        <div className="flex-1">
          <p className={`text-sm font-medium ${type === 'success' ? 'text-green-800' : 'text-red-800'}`}>
            {message}
          </p>
        </div>
        <button onClick={onClose} className="ml-4 text-gray-400 hover:text-gray-500 focus:outline-none">
          <X size={16} />
        </button>
      </div>
    </div>;
};

// Interactive CTA Card component
interface CTACardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  buttonText: string;
  buttonColor: string;
  onClick?: () => void;
  delay?: number;
  isExpanded?: boolean;
  onExpand?: () => void;
  children?: React.ReactNode;
  isSuccess?: boolean;
}

const CTACard: React.FC<CTACardProps> = ({
  icon,
  title,
  description,
  buttonText,
  buttonColor,
  onClick = () => {},
  delay = 0,
  isExpanded = false,
  onExpand = undefined,
  children = null,
  isSuccess = false
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [ref, isInView] = useInView({
    threshold: 0.2
  });
  // Fix: Properly type the ref for HTMLSpanElement
  const rippleRef = useRef<HTMLSpanElement>(null);
  
  const handleRippleEffect = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (rippleRef.current) {
      const button = e.currentTarget;
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Now TypeScript knows rippleRef.current is an HTMLSpanElement with style property
      rippleRef.current.style.left = `${x}px`;
      rippleRef.current.style.top = `${y}px`;
      rippleRef.current.style.transform = 'translate(-50%, -50%) scale(0)';
      rippleRef.current.style.opacity = '1';
      
      // Trigger animation
      setTimeout(() => {
        if (rippleRef.current) {
          rippleRef.current.style.transform = 'translate(-50%, -50%) scale(15)';
          rippleRef.current.style.opacity = '0';
        }
      }, 10);
    }
  };

  return <div ref={ref} className={`bg-white rounded-xl shadow-lg transition-all duration-500 relative overflow-hidden 
        ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'} 
        ${isHovered ? 'shadow-xl scale-[1.02]' : ''} 
        ${isExpanded ? 'p-8 md:col-span-2 lg:col-span-1' : 'p-8'}`} style={{
    transitionDelay: `${delay}s`
  }} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      {/* Card content */}
      <div className="relative z-10">
        {!isExpanded ? <>
            <div className={`${buttonColor === 'blue' ? 'bg-blue-100' : buttonColor === 'green' ? 'bg-emerald-100' : 'bg-purple-100'} p-4 rounded-full inline-block mb-6 transition-transform duration-500 ${isHovered ? 'scale-110' : ''}`}>
              {icon}
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
            <p className="text-gray-600 mb-6">{description}</p>
            <button onClick={(e) => {
          handleRippleEffect(e);
          if (onExpand) {
            onExpand();
          } else {
            onClick();
          }
        }} className={`relative overflow-hidden px-6 py-3 font-medium rounded-lg shadow-md transition-all duration-300 flex items-center ${buttonColor === 'blue' ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800' : buttonColor === 'green' ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700' : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700'} ${isHovered ? 'shadow-lg' : ''}`}>
              {buttonText}
              <ChevronRight size={16} className={`ml-2 transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`} />
              {/* Ripple effect */}
              <span ref={rippleRef} className="absolute rounded-full bg-white/20 pointer-events-none transition-all duration-700" style={{
            width: '10px',
            height: '10px',
            opacity: 0
          }}></span>
            </button>
          </> : <>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">{title}</h3>
              <button onClick={onExpand} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={20} />
              </button>
            </div>
            {isSuccess ? <div className="text-center py-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                  <CheckCircle size={32} className="text-green-600" />
                </div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">
                  Thank you!
                </h4>
                <p className="text-gray-600">We'll be in touch soon!</p>
              </div> : children}
          </>}
      </div>
      {/* Background glow effect */}
      <div className={`absolute inset-0 transition-opacity duration-700 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
        <div className={`absolute -inset-1 rounded-xl blur-xl ${buttonColor === 'blue' ? 'bg-blue-600/20' : buttonColor === 'green' ? 'bg-emerald-600/20' : 'bg-purple-600/20'}`}></div>
      </div>
    </div>;
};

interface ToastData {
  message: string;
  type: 'success' | 'error' | 'info';
}

const CallToAction: React.FC = () => {
  const navigate = useNavigate();
  const [ref, isInView] = useInView({
    threshold: 0.2
  });
  // State for expandable cards
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastData | null>(null);
  // Form states
  const [partnerFormData, setPartnerFormData] = useState({
    name: '',
    email: '',
    serviceCategory: '',
    message: ''
  });
  const [contactFormData, setContactFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [partnerFormSuccess, setPartnerFormSuccess] = useState(false);
  const [contactFormSuccess, setContactFormSuccess] = useState(false);
  // Service categories
  const serviceCategories = [{
    value: 'financial',
    label: 'Financial Services'
  }, {
    value: 'advisory',
    label: 'Business Advisory'
  }, {
    value: 'technology',
    label: 'Technology Solutions'
  }, {
    value: 'marketing',
    label: 'Marketing Services'
  }, {
    value: 'legal',
    label: 'Legal Services'
  }];
  // Handle form submissions
  const handlePartnerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    setTimeout(() => {
      setPartnerFormSuccess(true);
      setToast({
        message: "Thanks! We'll be in touch about your services soon.",
        type: 'success'
      });
      // Reset form after 3 seconds
      setTimeout(() => {
        setExpandedCard(null);
        setPartnerFormSuccess(false);
        setPartnerFormData({
          name: '',
          email: '',
          serviceCategory: '',
          message: ''
        });
      }, 3000);
    }, 1000);
  };
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    setTimeout(() => {
      setContactFormSuccess(true);
      setToast({
        message: "Message received! We'll respond shortly.",
        type: 'success'
      });
      // Reset form after 3 seconds
      setTimeout(() => {
        setExpandedCard(null);
        setContactFormSuccess(false);
        setContactFormData({
          name: '',
          email: '',
          message: ''
        });
      }, 3000);
    }, 1000);
  };
  // Handle card expansion
  const handleExpandCard = (cardId: string) => {
    if (expandedCard === cardId) {
      setExpandedCard(null);
    } else {
      setExpandedCard(cardId);
    }
  };
  return <div ref={ref} className="bg-gradient-to-r from-blue-700 via-indigo-800 to-teal-700 py-20 relative overflow-hidden">
      {/* Animated floating shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <FloatingShape size={120} color="rgba(255, 255, 255, 0.1)" delay={0} duration={15} className="top-[10%] left-[5%]" />
        <FloatingShape size={80} color="rgba(79, 209, 197, 0.2)" delay={2} duration={18} className="top-[30%] left-[15%]" />
        <FloatingShape size={150} color="rgba(99, 102, 241, 0.15)" delay={1} duration={20} className="bottom-[20%] left-[10%]" />
        <FloatingShape size={100} color="rgba(255, 255, 255, 0.1)" delay={3} duration={12} className="top-[20%] right-[15%]" />
        <FloatingShape size={70} color="rgba(79, 209, 197, 0.2)" delay={2.5} duration={16} className="top-[60%] right-[5%]" />
        <FloatingShape size={130} color="rgba(99, 102, 241, 0.15)" delay={1.5} duration={22} className="bottom-[10%] right-[20%]" />
      </div>
      <div className="container mx-auto px-4 text-center relative z-10">
        <FadeInUpOnScroll>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Accelerate Your Journey?
          </h2>
        </FadeInUpOnScroll>
        <FadeInUpOnScroll delay={0.2}>
          <p className="text-lg text-gray-200 mb-12 max-w-3xl mx-auto">
            One platform. Every resource you need to grow in Abu Dhabi.
          </p>
        </FadeInUpOnScroll>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Card 1: Register Your Enterprise */}
          <CTACard icon={<Users size={28} className="text-blue-600" />} title="Register Your Enterprise" description="Get access to tailored services, funding opportunities, and resources to accelerate your business growth." buttonText="Register Now" buttonColor="blue" onClick={() => navigate('/register')} delay={0.3} />
          {/* Card 2: List Your Services */}
          <CTACard icon={<Briefcase size={28} className="text-emerald-600" />} title="List Your Services" description="Join our ecosystem of service providers and help businesses thrive while expanding your own reach and impact." buttonText="Become a Partner" buttonColor="green" isExpanded={expandedCard === 'partner'} onExpand={() => handleExpandCard('partner')} delay={0.5} isSuccess={partnerFormSuccess}>
            <form onSubmit={handlePartnerSubmit} className="mt-2">
              <FormInput label="Name" placeholder="Your full name" value={partnerFormData.name} onChange={(e) => setPartnerFormData({
              ...partnerFormData,
              name: e.target.value
            })} required />
              <FormInput label="Email" type="email" placeholder="your@email.com" value={partnerFormData.email} onChange={(e) => setPartnerFormData({
              ...partnerFormData,
              email: e.target.value
            })} required />
              <FormSelect label="Service Category" options={serviceCategories} value={partnerFormData.serviceCategory} onChange={(e) => setPartnerFormData({
              ...partnerFormData,
              serviceCategory: e.target.value
            })} required />
              <FormTextarea label="Message" placeholder="Tell us about your services..." value={partnerFormData.message} onChange={(e) => setPartnerFormData({
              ...partnerFormData,
              message: e.target.value
            })} required />
              <button type="submit" className="w-full px-6 py-3 mt-2 font-medium rounded-lg shadow-md bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 flex items-center justify-center relative overflow-hidden">
                Submit Application
                <ChevronRight size={16} className="ml-2" />
              </button>
            </form>
          </CTACard>
          {/* Card 3: Contact Us */}
          <CTACard icon={<Phone size={28} className="text-purple-600" />} title="Contact Us" description="Have questions or need assistance? Our team is ready to help you navigate your business journey." buttonText="Get in Touch" buttonColor="purple" isExpanded={expandedCard === 'contact'} onExpand={() => handleExpandCard('contact')} delay={0.7} isSuccess={contactFormSuccess}>
            <form onSubmit={handleContactSubmit} className="mt-2">
              <FormInput label="Name" placeholder="Your full name" value={contactFormData.name} onChange={(e) => setContactFormData({
              ...contactFormData,
              name: e.target.value
            })} required />
              <FormInput label="Email" type="email" placeholder="your@email.com" value={contactFormData.email} onChange={(e) => setContactFormData({
              ...contactFormData,
              email: e.target.value
            })} required />
              <FormTextarea label="Message" placeholder="How can we help you?" value={contactFormData.message} onChange={(e) => setContactFormData({
              ...contactFormData,
              message: e.target.value
            })} required />
              <button type="submit" className="w-full px-6 py-3 mt-2 font-medium rounded-lg shadow-md bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 flex items-center justify-center">
                Send Message
                <ChevronRight size={16} className="ml-2" />
              </button>
            </form>
          </CTACard>
        </div>
      </div>
      {/* Toast notification */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      {/* Add keyframes for animations */}
      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(0) translateX(0) rotate(0);
            opacity: 0.3;
          }
          33% {
            transform: translateY(-30px) translateX(20px) rotate(5deg);
            opacity: 0.6;
          }
          66% {
            transform: translateY(20px) translateX(-15px) rotate(-3deg);
            opacity: 0.4;
          }
          100% {
            transform: translateY(0) translateX(0) rotate(0);
            opacity: 0.3;
          }
        }
        .animate-float {
          animation: float ease-in-out infinite;
        }
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out forwards;
        }
      `}</style>
    </div>;
};
export default CallToAction;