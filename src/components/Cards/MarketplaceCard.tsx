import React from 'react';
import { Bookmark, Scale } from 'lucide-react';
export interface Provider {
  name: string;
  logoUrl: string;
}
export interface MarketplaceItem {
  id: string;
  title: string;
  description: string;
  provider: Provider;
  tags: string[];
}
export interface MarketplaceCardConfig {
  primaryCTA: string;
  secondaryCTA: string;
}
export interface MarketplaceCardProps {
  item: MarketplaceItem;
  isBookmarked?: boolean;
  config?: MarketplaceCardConfig;
  onQuickView: () => void;
  onToggleBookmark: () => void;
  onAddToComparison: () => void;
  onViewDetails: () => void;
  onPrimaryAction: () => void;
  'data-id'?: string;
}
export const MarketplaceCard: React.FC<MarketplaceCardProps> = ({
  item,
  isBookmarked = false,
  config = {
    primaryCTA: 'Apply Now',
    secondaryCTA: 'View Details'
  },
  onQuickView,
  onToggleBookmark,
  onAddToComparison,
  onViewDetails,
  onPrimaryAction,
  'data-id': dataId
}) => {
  // Show maximum 2 tags to prevent overflow
  const displayTags = item.tags.slice(0, 2);
  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    onViewDetails();
  };
  const handlePrimaryAction = (e: React.MouseEvent) => {
    e.stopPropagation();
    onPrimaryAction();
  };
  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleBookmark();
  };
  const handleComparisonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToComparison();
  };
  return <div className="flex flex-col min-h-[340px] bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200 cursor-pointer" onClick={onQuickView} data-id={dataId} role="button" tabIndex={0} onKeyDown={e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onQuickView();
    }
  }} aria-label={`View details for ${item.title} by ${item.provider.name}`}>
      {/* Card Header with fixed height for title and provider */}
      <div className="px-4 py-5 flex-grow flex flex-col">
        <div className="flex items-start mb-5">
          <img src={item.provider.logoUrl} alt={`${item.provider.name} logo`} className="h-12 w-12 object-contain rounded-md flex-shrink-0 mr-3" />
          <div className="flex-grow min-h-[72px] flex flex-col justify-center">
            <h3 className="font-bold text-gray-900 line-clamp-2 min-h-[48px] leading-snug">
              {item.title}
            </h3>
            <p className="text-sm text-gray-500 min-h-[20px] mt-1">
              {item.provider.name}
            </p>
          </div>
        </div>
        {/* Description with consistent height */}
        <div className="mb-5">
          <p className="text-sm text-gray-600 line-clamp-3 min-h-[60px] leading-relaxed">
            {item.description}
          </p>
        </div>
        {/* Tags and Actions in same row - fixed position */}
        <div className="flex justify-between items-center mt-auto">
          <div className="flex flex-wrap gap-1 max-w-[70%]">
            {displayTags.map((tag, index) => <span key={index} className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium truncate ${index === 0 ? 'bg-blue-50 text-blue-700 border border-blue-100' : 'bg-green-50 text-green-700 border border-green-100'}`}>
                {tag}
              </span>)}
          </div>
          <div className="flex space-x-2 flex-shrink-0">
            <button onClick={handleBookmarkClick} className={`p-1.5 rounded-full transition-colors ${isBookmarked ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`} aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'} title={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}>
              <Bookmark size={16} className={isBookmarked ? 'fill-yellow-600' : ''} />
            </button>
            <button onClick={handleComparisonClick} className="p-1.5 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors" aria-label="Add to comparison" title="Add to comparison">
              <Scale size={16} />
            </button>
          </div>
        </div>
      </div>
      {/* Card Footer - with two buttons */}
      <div className="mt-auto border-t border-gray-100 p-4 pt-5">
        <div className="flex justify-between gap-2">
          <button onClick={handleViewDetails} className="px-4 py-2 text-sm font-medium text-blue-600 bg-white border border-blue-600 rounded-md hover:bg-blue-50 transition-colors whitespace-nowrap min-w-[120px] flex-1">
            {config.secondaryCTA}
          </button>
          <button onClick={handlePrimaryAction} className="px-4 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors whitespace-nowrap flex-1">
            {config.primaryCTA}
          </button>
        </div>
      </div>
    </div>;
};