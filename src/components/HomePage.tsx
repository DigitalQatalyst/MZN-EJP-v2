import React, { useEffect, useState } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import HeroSection from './HeroSection';
import ProofAndTrust from './ProofAndTrust';
import EnterpriseStages from './EnterpriseStages';
import Home from './Home';
import KnowledgeHub from './KnowledgeHub';
import CallToAction from './CallToAction';

const HomePage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Simulate page loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-gradient-to-r from-blue-900 to-indigo-900 flex items-center justify-center z-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-white text-xl font-bold">
            Loading Enterprise Journey Platform
          </h2>
          <p className="text-blue-200 mt-2">
            Your gateway to business growth in Abu Dhabi
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header 
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
        sidebarOpen={sidebarOpen} 
      />
      <main className="flex-grow">
        <HeroSection />
        <ProofAndTrust />
        <EnterpriseStages />
        <Home />
        <KnowledgeHub graphqlEndpoint={null} />
        <CallToAction />
      </main>
      <Footer isLoggedIn={false} />
    </div>
  );
};

export default HomePage;