import React from 'react';
import { BaseCard } from './BaseCard';
import { ArrowRight } from 'lucide-react';
export interface PromoItem {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  gradientFrom?: string;
  gradientTo?: string;
  ctaText?: string;
}
export interface PromoCardProps {
  item: PromoItem;
  onExplore: () => void;
  onQuickView?: () => void;
  'data-id'?: string;
}
export const PromoCard: React.FC<PromoCardProps> = ({
  item,
  onExplore,
  onQuickView,
  'data-id': dataId
}) => {
  const handleExplore = (e: React.MouseEvent) => {
    e.stopPropagation();
    onExplore();
  };
  const gradientClass = item.gradientFrom && item.gradientTo ? `bg-gradient-to-br ${item.gradientFrom} ${item.gradientTo}` : 'bg-gradient-to-br from-blue-600 to-purple-600';
  return <BaseCard onClick={onQuickView} data-id={dataId} className={`${gradientClass} text-white border-none shadow-lg hover:shadow-xl`}>
      <div className="p-6 flex flex-col h-full">
        <div className="flex items-center mb-4">
          <div className="bg-white bg-opacity-20 p-3 rounded-full mr-4 flex items-center justify-center">
            {item.icon}
          </div>
          <h3 className="text-xl font-bold text-white">{item.title}</h3>
        </div>
        <p className="text-white text-opacity-90 mb-6 flex-grow leading-relaxed">
          {item.description}
        </p>
        <button onClick={handleExplore} className="mt-auto flex items-center font-medium text-white hover:text-opacity-80 transition-colors self-start" aria-label={`Explore ${item.title}`}>
          {item.ctaText || 'Explore Now'}
          <ArrowRight className="ml-2" size={18} />
        </button>
      </div>
    </BaseCard>;
};