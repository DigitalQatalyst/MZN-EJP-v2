import React from 'react';
import { BaseCard } from './BaseCard';
import { CardHeader } from './CardHeader';
import { CardFooter } from './CardFooter';
import { TagChip } from './TagChip';
import { Bookmark, Star } from 'lucide-react';
export interface ServiceItem {
  id: string;
  title: string;
  provider: string;
  description: string;
  tags: string[];
  providerLogoUrl?: string;
  rating?: number;
  isBookmarked?: boolean;
}
export interface ServiceCardProps {
  item: ServiceItem;
  onApply: () => void;
  onLearnMore?: () => void;
  onToggleBookmark?: () => void;
  onQuickView?: () => void;
  'data-id'?: string;
}
export const ServiceCard: React.FC<ServiceCardProps> = ({
  item,
  onApply,
  onLearnMore,
  onToggleBookmark,
  onQuickView,
  'data-id': dataId
}) => {
  const handleApply = (e: React.MouseEvent) => {
    e.stopPropagation();
    onApply();
  };
  const handleLearnMore = (e: React.MouseEvent) => {
    e.stopPropagation();
    onLearnMore?.();
  };
  const handleToggleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleBookmark?.();
  };
  return <BaseCard onClick={onQuickView} data-id={dataId}>
      <CardHeader title={item.title} subtitle={item.provider} imageUrl={item.providerLogoUrl} imageAlt={`${item.provider} logo`}>
        {/* Rating */}
        {item.rating && <div className="flex items-center mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => <Star key={i} size={14} className={i < Math.floor(item.rating!) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} />)}
            </div>
            <span className="text-sm text-gray-600 ml-2">{item.rating}</span>
          </div>}
        {/* Description */}
        <div className="mb-5">
          <p className="text-sm text-gray-600 line-clamp-3 min-h-[60px] leading-relaxed">
            {item.description}
          </p>
        </div>
        {/* Tags and Actions */}
        <div className="flex justify-between items-center mt-auto">
          <div className="flex flex-wrap gap-1 max-w-[70%]">
            {item.tags.slice(0, 2).map((tag, index) => <TagChip key={index} text={tag} variant={index === 0 ? 'primary' : 'secondary'} />)}
          </div>
          {onToggleBookmark && <button onClick={handleToggleBookmark} className={`p-1.5 rounded-full transition-colors ${item.isBookmarked ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`} aria-label={item.isBookmarked ? 'Remove bookmark' : 'Add bookmark'}>
              <Bookmark size={16} className={item.isBookmarked ? 'fill-yellow-600' : ''} />
            </button>}
        </div>
      </CardHeader>
      <CardFooter primaryCTA={{
      text: 'Apply',
      onClick: handleApply
    }} secondaryCTA={onLearnMore ? {
      text: 'Learn More',
      onClick: handleLearnMore
    } : undefined} />
    </BaseCard>;
};