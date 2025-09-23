import React, { useEffect, useState } from 'react';
import { Send, ChevronDown, ArrowRight, Building } from 'lucide-react';
import { AnimatedText, FadeInUpOnScroll, StaggeredFadeIn } from './AnimationUtils';
interface HeroSectionProps {
  'data-id'?: string;
}
const HeroSection: React.FC<HeroSectionProps> = ({
  'data-id': dataId
}) => {
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const handleSubmitPrompt = () => {
    if (!prompt.trim()) return;
    setIsProcessing(true);
    // Simulate AI processing
    setTimeout(() => {
      setIsProcessing(false);
      setPrompt('');
      // Here you would typically handle the actual AI response
    }, 1500);
  };
  const scrollToMarketplaces = () => {
    const marketplacesSection = document.getElementById('marketplaces-section');
    if (marketplacesSection) {
      marketplacesSection.scrollIntoView({
        behavior: 'smooth'
      });
    }
  };
  // Show suggestion pills with delay after focus
  useEffect(() => {
    let timer;
    if (isSearchFocused) {
      timer = setTimeout(() => {
        setShowSuggestions(true);
      }, 500);
    } else {
      setShowSuggestions(false);
    }
    return () => clearTimeout(timer);
  }, [isSearchFocused]);
  const suggestionPills = ['How do I get funding for my business?', 'What services help with business expansion?', 'How to connect with business mentors?', 'Steps to register a company in Abu Dhabi'];
  return <div className="relative w-full bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 overflow-hidden" style={{
    backgroundImage: "linear-gradient(rgba(17, 24, 39, 0.7), rgba(17, 24, 39, 0.7)), url('https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1470&auto=format&fit=crop')",
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '100vh'
  }} data-id={dataId}>
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/40 to-purple-600/40 mix-blend-multiply" style={{
      animation: 'pulse-gradient 8s ease-in-out infinite alternate'
    }}></div>
      <div className="container mx-auto px-4 h-full flex flex-col justify-center items-center relative z-10">
        <div className="text-center max-w-4xl mx-auto mb-8">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight overflow-hidden">
            <AnimatedText text="Your Gateway to Enterprise Growth in Abu Dhabi" />
          </h1>
          <FadeInUpOnScroll delay={0.8}>
            <p className="text-xl text-white/90 mb-8">
              Start and scale your business with access to funding, services,
              and partners.
            </p>
          </FadeInUpOnScroll>
        </div>
        {/* AI Prompt Interface with animation */}
        <FadeInUpOnScroll delay={1.2} className="w-full max-w-3xl mb-10">
          <div className={`bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 ${isSearchFocused ? 'shadow-xl transform scale-105' : ''}`}>
            <div className="p-2 md:p-3">
              <div className="flex items-center">
                {/* Input field */}
                <div className="flex-grow relative">
                  <input type="text" placeholder="Ask how to grow your business in Abu Dhabi..." className={`w-full py-3 px-4 outline-none text-gray-700 rounded-lg bg-gray-50 transition-all duration-300 ${isSearchFocused ? 'bg-white' : ''}`} value={prompt} onChange={e => setPrompt(e.target.value)} onFocus={() => setIsSearchFocused(true)} onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)} onKeyDown={e => {
                  if (e.key === 'Enter') {
                    handleSubmitPrompt();
                  }
                }} />
                </div>
                {/* Submit button */}
                <button onClick={handleSubmitPrompt} disabled={isProcessing || !prompt.trim()} className={`ml-2 p-3 rounded-lg flex items-center justify-center transition-all ${isProcessing || !prompt.trim() ? 'bg-gray-200 cursor-not-allowed text-gray-400' : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white'}`}>
                  <Send size={20} className={isProcessing ? 'animate-pulse' : ''} />
                </button>
              </div>
            </div>
            {/* Example prompts with staggered animation */}
            <div className={`bg-gray-50 px-4 py-3 border-t border-gray-100 transition-all duration-500 ease-in-out ${showSuggestions ? 'opacity-100 max-h-24' : 'opacity-0 max-h-0 overflow-hidden'}`}>
              <p className="text-xs text-gray-500 mb-2">Try asking:</p>
              <div className="flex flex-wrap gap-2">
                {suggestionPills.map((pill, index) => <button key={index} className="text-xs bg-white border border-gray-200 rounded-full px-3 py-1 text-gray-600 hover:bg-gray-100 transition-colors" style={{
                opacity: showSuggestions ? 1 : 0,
                transform: showSuggestions ? 'translateY(0)' : 'translateY(10px)',
                transition: 'opacity 0.3s ease-out, transform 0.3s ease-out',
                transitionDelay: `${0.1 + index * 0.1}s`
              }} onClick={() => {
                setPrompt(pill);
                setIsSearchFocused(true);
              }}>
                    {pill}
                  </button>)}
              </div>
            </div>
          </div>
        </FadeInUpOnScroll>
        {/* Call to Action Buttons with animations */}
        <StaggeredFadeIn staggerDelay={0.2} className="flex flex-col sm:flex-row gap-4 mt-2">
          <a href="/register" className="px-8 py-3 bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white font-bold rounded-lg shadow-lg transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl text-center flex items-center justify-center overflow-hidden group">
            <span className="relative z-10">Start Your Growth Journey</span>
            <ArrowRight size={18} className="ml-2 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
            {/* Ripple effect on hover */}
            <span className="absolute inset-0 overflow-hidden rounded-lg">
              <span className="absolute inset-0 bg-white/20 transform scale-0 opacity-0 group-hover:scale-[2.5] group-hover:opacity-100 rounded-full transition-all duration-700 origin-center"></span>
            </span>
          </a>
          <a href="/partners" className="px-8 py-3 bg-white text-blue-700 hover:bg-blue-50 font-bold rounded-lg shadow-lg flex items-center justify-center gap-2 transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            Become a Partner
            <Building size={18} />
          </a>
        </StaggeredFadeIn>
      </div>
      {/* Scroll indicator with animation */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce cursor-pointer" onClick={() => {
      const nextSection = document.querySelector('main > div:nth-child(2)');
      nextSection?.scrollIntoView({
        behavior: 'smooth'
      });
    }}>
        <ChevronDown size={24} className="text-white" />
        <span className="sr-only">Scroll down</span>
      </div>
      {/* Add keyframes for gradient animation */}
      <style jsx>{`
        @keyframes pulse-gradient {
          0% {
            opacity: 0.4;
          }
          50% {
            opacity: 0.6;
          }
          100% {
            opacity: 0.4;
          }
        }
      `}</style>
    </div>;
};
export default HeroSection;