import React, { useState } from 'react';
import { designTokens, tagVariants } from './designTokens';
// Unified Content Schema
export interface CardMedia {
  type: 'image' | 'icon' | 'avatar';
  src?: string;
  alt?: string;
  icon?: React.ReactNode;
  fallbackIcon?: React.ReactNode;
}
export interface CardTag {
  text: string;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'info';
}
export interface CardMetadata {
  date?: string;
  author?: string;
  rating?: number;
  location?: string;
  fileSize?: string;
  downloadCount?: number;
  attendeeCount?: number;
  [key: string]: any;
}
export interface CardCTA {
  text: string;
  onClick: (e: React.MouseEvent) => void;
  variant?: 'primary' | 'secondary';
  icon?: React.ReactNode;
  disabled?: boolean;
}
export interface CardPill {
  text: string;
  icon?: React.ReactNode;
  variant?: 'warning' | 'success' | 'info' | 'secondary';
  animate?: boolean;
}
export interface CardContent {
  title: string;
  subtitle?: string;
  description?: string;
  tags?: CardTag[];
  media?: CardMedia;
  metadata?: CardMetadata;
  primaryCTA?: CardCTA;
  secondaryCTA?: CardCTA;
  pill?: CardPill;
  actions?: React.ReactNode;
}
export interface CardVariantConfig {
  type: 'news' | 'event' | 'service' | 'report' | 'promo' | 'feature' | 'service-highlight' | 'marketplace';
  gradient?: {
    from: string;
    to: string;
  };
  layout?: 'standard' | 'gradient' | 'feature';
  maxTags?: number;
}
export interface UnifiedCardProps {
  content: CardContent;
  variant: CardVariantConfig;
  isActive?: boolean;
  isBookmarked?: boolean;
  isComingSoon?: boolean;
  onQuickView?: () => void;
  onToggleBookmark?: () => void;
  className?: string;
  'data-id'?: string;
}
export const UnifiedCard: React.FC<UnifiedCardProps> = ({
  content,
  variant,
  isActive = false,
  isBookmarked = false,
  isComingSoon = false,
  onQuickView,
  onToggleBookmark,
  className = '',
  'data-id': dataId
}) => {
  const [isHovered, setIsHovered] = useState(false);
  // Generate card classes based on variant
  const getCardClasses = () => {
    const baseClasses = ['flex flex-col', designTokens.visual.minHeight, designTokens.visual.borderRadius, designTokens.visual.shadow.default, designTokens.visual.shadow.hover, designTokens.transitions.hover, 'overflow-hidden', onQuickView ? 'cursor-pointer' : ''];
    // Layout-specific classes
    switch (variant.layout) {
      case 'gradient':
        if (variant.gradient) {
          baseClasses.push(`bg-gradient-to-br ${variant.gradient.from} ${variant.gradient.to}`);
          baseClasses.push('text-white border-none shadow-lg hover:shadow-xl');
        }
        if (isComingSoon) {
          // Enhanced grey gradient for coming soon cards
          baseClasses.push('bg-gradient-to-br from-gray-300 to-gray-500 opacity-60 hover:opacity-70', 'cursor-not-allowed');
        }
        break;
      case 'feature':
        baseClasses.push('bg-white', designTokens.visual.border);
        if (isActive) {
          baseClasses.push('ring-2 ring-blue-500 ring-opacity-50');
        }
        if (isComingSoon) {
          // Grey out feature cards when coming soon
          baseClasses.push('bg-gradient-to-br from-gray-100 to-gray-200 opacity-70', 'cursor-not-allowed');
        }
        break;
      default:
        baseClasses.push('bg-white', designTokens.visual.border);
        if (isComingSoon) {
          // Grey out standard cards when coming soon
          baseClasses.push('bg-gradient-to-br from-gray-50 to-gray-100 opacity-70', 'cursor-not-allowed');
        }
    }
    return baseClasses.join(' ');
  };
  // Render media section
  const renderMedia = () => {
    if (!content.media) return null;
    const mediaClasses = 'h-12 w-12 flex-shrink-0 mr-3 flex items-center justify-center';
    switch (content.media.type) {
      case 'image':
      case 'avatar':
        return <div className={mediaClasses}>
            <img src={content.media.src} alt={content.media.alt || ''} className="h-12 w-12 object-contain rounded-md" />
          </div>;
      case 'icon':
        return <div className={`${mediaClasses} ${variant.layout === 'gradient' ? 'bg-white bg-opacity-20 rounded-full' : 'bg-gray-100 rounded-md text-gray-500'}`}>
            {content.media.icon || content.media.fallbackIcon}
          </div>;
      default:
        return null;
    }
  };
  // Render pill
  const renderPill = () => {
    if (!content.pill) return null;
    const pillVariants = {
      warning: 'bg-yellow-400 text-gray-800',
      success: 'bg-green-400 text-white',
      info: 'bg-blue-400 text-white',
      secondary: 'bg-gray-400 text-white'
    };
    return <div className={`absolute ${designTokens.spacing.pill.position.top} ${designTokens.spacing.pill.position.right} ${designTokens.spacing.pill.padding} rounded-full text-xs font-bold flex items-center z-10 ${pillVariants[content.pill.variant || 'warning']} ${content.pill.animate ? 'animate-pulse' : ''}`}>
        {content.pill.icon && <span className="mr-1">{content.pill.icon}</span>}
        {content.pill.text}
      </div>;
  };
  // Render tags
  const renderTags = () => {
    if (!content.tags || content.tags.length === 0) return null;
    const maxTags = variant.maxTags || 2;
    const displayTags = content.tags.slice(0, maxTags);
    return <div className="flex flex-wrap gap-1">
        {displayTags.map((tag, index) => <span key={index} className={`inline-flex items-center ${designTokens.spacing.pill.padding} rounded-full text-xs font-medium truncate ${tagVariants[tag.variant || 'primary']}`}>
            {tag.text}
          </span>)}
      </div>;
  };
  // Render metadata
  const renderMetadata = () => {
    if (!content.metadata) return null;
    const metadataItems = [];
    if (content.metadata.date) {
      metadataItems.push(content.metadata.date);
    }
    if (content.metadata.author) {
      metadataItems.push(content.metadata.author);
    }
    if (content.metadata.location) {
      metadataItems.push(content.metadata.location);
    }
    if (content.metadata.fileSize) {
      metadataItems.push(content.metadata.fileSize);
    }
    if (content.metadata.attendeeCount) {
      metadataItems.push(`${content.metadata.attendeeCount} attendees`);
    }
    if (metadataItems.length === 0) return null;
    return <div className={`${designTokens.typography.metadata.size} ${variant.layout === 'gradient' ? 'text-white text-opacity-75' : designTokens.typography.metadata.color} ${designTokens.spacing.content.marginBottom}`}>
        {metadataItems.join(' • ')}
      </div>;
  };
  // Render CTAs
  const renderCTAs = () => {
    if (!content.primaryCTA && !content.secondaryCTA) return null;
    return <div className="mt-auto border-t border-gray-100 p-4 pt-5">
        {content.actions && <div className="mb-4">{content.actions}</div>}
        <div className="flex justify-between gap-2">
          {content.secondaryCTA && <button onClick={content.secondaryCTA.onClick} disabled={content.secondaryCTA.disabled} className="px-4 py-2 text-sm font-medium text-blue-600 bg-white border border-blue-600 rounded-md hover:bg-blue-50 transition-colors whitespace-nowrap min-w-[120px] flex-1 disabled:opacity-50 disabled:cursor-not-allowed" aria-label={`${content.secondaryCTA.text} for ${content.title}`}>
              {content.secondaryCTA.text}
            </button>}
          {content.primaryCTA && <button onClick={content.primaryCTA.onClick} disabled={content.primaryCTA.disabled} className={`px-4 py-2 text-sm font-bold rounded-md transition-colors whitespace-nowrap flex-1 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed ${content.primaryCTA.variant === 'secondary' ? 'text-blue-600 bg-white border border-blue-600 hover:bg-blue-50' : 'text-white bg-blue-600 hover:bg-blue-700'}`} aria-label={`${content.primaryCTA.text} for ${content.title}`}>
              {content.primaryCTA.text}
              {content.primaryCTA.icon && <span className="ml-2">{content.primaryCTA.icon}</span>}
            </button>}
        </div>
      </div>;
  };
  return <div className={`${getCardClasses()} ${className}`} onClick={onQuickView} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} data-id={dataId} role={onQuickView ? 'button' : undefined} tabIndex={onQuickView ? 0 : undefined} onKeyDown={onQuickView ? e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onQuickView();
    }
  } : undefined} aria-label={onQuickView ? `View details for ${content.title}` : undefined}>
      {/* Pill */}
      {renderPill()}
      {/* Card Content */}
      <div className={`${designTokens.spacing.card.padding} flex flex-col h-full relative`}>
        {/* Header Section */}
        <div className="flex items-start mb-5">
          {renderMedia()}
          <div className="flex-grow min-h-[72px] flex flex-col justify-center">
            <h3 className={`${designTokens.typography.title.size} ${designTokens.typography.title.weight} ${variant.layout === 'gradient' ? 'text-white' : designTokens.typography.title.color} ${designTokens.typography.title.lineHeight} line-clamp-2 min-h-[48px]`}>
              {content.title}
            </h3>
            {content.subtitle && <p className={`${designTokens.typography.subtitle.size} ${variant.layout === 'gradient' ? 'text-white text-opacity-75' : designTokens.typography.subtitle.color} min-h-[20px] mt-1`}>
                {content.subtitle}
              </p>}
          </div>
        </div>
        {/* Description */}
        {content.description && <div className={designTokens.spacing.content.marginBottom}>
            <p className={`${designTokens.typography.description.size} ${variant.layout === 'gradient' ? 'text-white text-opacity-90' : designTokens.typography.description.color} ${designTokens.typography.description.lineHeight} line-clamp-3 min-h-[60px]`}>
              {content.description}
            </p>
          </div>}
        {/* Metadata */}
        {renderMetadata()}
        {/* Tags */}
        <div className="flex justify-between items-center mt-auto">
          {renderTags()}
          {/* Additional actions can go here */}
        </div>
      </div>
      {/* CTAs */}
      {variant.layout !== 'gradient' && renderCTAs()}
      {/* Gradient layout CTA */}
      {variant.layout === 'gradient' && content.primaryCTA && <div className="p-6 pt-0">
          <button onClick={content.primaryCTA.onClick} disabled={content.primaryCTA.disabled || isComingSoon} className={`w-full px-4 py-2 rounded-md font-medium transition-all duration-300 flex items-center justify-center ${isComingSoon ? 'bg-white text-gray-500 cursor-not-allowed' : 'bg-white text-blue-700 hover:bg-blue-50 border border-white/20'} ${isHovered && !isComingSoon ? 'opacity-100' : 'opacity-80'}`} aria-label={`${content.primaryCTA.text} for ${content.title}`}>
            {content.primaryCTA.text}
            {content.primaryCTA.icon && <span className="ml-2">{content.primaryCTA.icon}</span>}
          </button>
        </div>}
      {/* Hover overlay for gradient cards */}
      {variant.layout === 'gradient' && !isComingSoon && <div className="absolute inset-0 bg-white/5 opacity-0 transition-opacity duration-500 rounded-lg" style={{
      opacity: isHovered ? 1 : 0
    }} />}
    </div>;
};