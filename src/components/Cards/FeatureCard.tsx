import React from 'react';
import { UnifiedCard, CardContent, CardVariantConfig } from './UnifiedCard';
import { ArrowRight } from 'lucide-react';
export interface FeatureItem {
  id: string;
  title: string;
  description: string;
  benefits: string[];
  icon: React.ReactNode;
  ctaText?: string;
  isActive?: boolean;
}
export interface FeatureCardProps {
  item: FeatureItem;
  onClick: () => void;
  onQuickView?: () => void;
  'data-id'?: string;
}
export const FeatureCard: React.FC<FeatureCardProps> = ({
  item,
  onClick,
  onQuickView,
  'data-id': dataId
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick();
  };
  // Custom content for feature card with benefits list
  const content: CardContent = {
    title: item.title,
    description: item.description,
    media: {
      type: 'icon',
      icon: item.icon
    },
    primaryCTA: {
      text: item.ctaText || 'Learn More',
      onClick: handleClick,
      icon: <ArrowRight size={16} />
    }
  };
  const variant: CardVariantConfig = {
    type: 'feature',
    layout: 'feature'
  };
  return <div className="flex flex-col min-h-[340px] bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200 border border-gray-200" onClick={onQuickView} data-id={dataId} role={onQuickView ? 'button' : undefined} tabIndex={onQuickView ? 0 : undefined} onKeyDown={onQuickView ? e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onQuickView();
    }
  } : undefined}>
      <div className="p-6 flex flex-col h-full">
        {/* Header with Icon and Title */}
        <div className="flex items-center mb-4">
          <div className={`p-3 rounded-full mr-4 transition-colors duration-300 ${item.isActive ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-600'}`}>
            {item.icon}
          </div>
          <h3 className="text-lg font-bold text-gray-800">{item.title}</h3>
        </div>
        {/* Description */}
        <p className="text-gray-600 mb-4 leading-relaxed">{item.description}</p>
        {/* Key Benefits */}
        <div className="mb-6 flex-grow">
          <h4 className="font-semibold text-gray-700 mb-2">Key Benefits:</h4>
          <ul className="text-gray-600 space-y-1">
            {item.benefits.map((benefit, i) => <li key={i} className="flex items-start">
                <span className={`mr-2 transition-colors duration-300 ${item.isActive ? 'text-blue-500' : 'text-blue-600'}`}>
                  •
                </span>
                <span className="leading-relaxed">{benefit}</span>
              </li>)}
          </ul>
        </div>
        {/* CTA Button */}
        <button onClick={handleClick} className={`mt-auto text-white font-medium py-2 px-4 rounded-md transition-all duration-300 flex items-center justify-center overflow-hidden group ${item.isActive ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800' : 'bg-blue-600 hover:bg-blue-700'}`} aria-label={`${item.ctaText || 'Learn More'} about ${item.title}`}>
          {item.ctaText || 'Learn More'}
          <ArrowRight size={16} className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
        </button>
      </div>
    </div>;
};