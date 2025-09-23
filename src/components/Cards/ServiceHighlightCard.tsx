import React from 'react';
import { UnifiedCard, CardContent, CardVariantConfig } from './UnifiedCard';
import { Clock, Lock, ChevronRight } from 'lucide-react';
export interface ServiceHighlightItem {
  id: string;
  title: string;
  description: string;
  icon: React.ReactElement;
  gradientFrom?: string;
  gradientTo?: string;
  isComingSoon?: boolean;
}
export interface ServiceHighlightCardProps {
  item: ServiceHighlightItem;
  onClick: () => void;
  onQuickView?: () => void;
  'data-id'?: string;
}
export const ServiceHighlightCard: React.FC<ServiceHighlightCardProps> = ({
  item,
  onClick,
  onQuickView,
  'data-id': dataId
}) => {
  const handleClick = (e: React.MouseEvent) => {
    if (!item.isComingSoon) {
      e.stopPropagation();
      onClick();
    }
  };
  const content: CardContent = {
    title: item.title,
    description: item.description,
    media: {
      type: 'icon',
      icon: item.icon
    },
    pill: item.isComingSoon ? {
      text: 'Coming Soon',
      icon: <Clock size={12} />,
      variant: 'warning',
      animate: true
    } : undefined,
    primaryCTA: {
      text: item.isComingSoon ? 'Coming Soon' : 'Explore Now',
      onClick: handleClick,
      icon: item.isComingSoon ? <Lock size={14} /> : <ChevronRight size={16} />,
      disabled: item.isComingSoon
    }
  };
  const variant: CardVariantConfig = {
    type: 'service-highlight',
    layout: 'gradient',
    gradient: item.gradientFrom && item.gradientTo ? {
      from: item.gradientFrom,
      to: item.gradientTo
    } : {
      from: 'from-blue-600',
      to: 'to-purple-600'
    }
  };
  return <UnifiedCard content={content} variant={variant} isComingSoon={item.isComingSoon} onQuickView={onQuickView} data-id={dataId} />;
};