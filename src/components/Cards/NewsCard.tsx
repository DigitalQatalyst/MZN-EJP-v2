import React from 'react';
import { UnifiedCard, CardContent, CardVariantConfig } from './UnifiedCard';
import { Calendar, ExternalLink } from 'lucide-react';
export interface NewsItem {
  id: string;
  title: string;
  source: string;
  excerpt: string;
  date: string;
  tags: string[];
  imageUrl?: string;
  sourceLogoUrl?: string;
}
export interface NewsCardProps {
  item: NewsItem;
  onReadMore: () => void;
  onQuickView?: () => void;
  'data-id'?: string;
}
export const NewsCard: React.FC<NewsCardProps> = ({
  item,
  onReadMore,
  onQuickView,
  'data-id': dataId
}) => {
  const handleReadMore = (e: React.MouseEvent) => {
    e.stopPropagation();
    onReadMore();
  };
  const content: CardContent = {
    title: item.title,
    subtitle: item.source,
    description: item.excerpt,
    media: {
      type: item.sourceLogoUrl ? 'image' : 'icon',
      src: item.sourceLogoUrl,
      alt: `${item.source} logo`,
      fallbackIcon: <ExternalLink size={24} />
    },
    tags: item.tags.slice(0, 2).map((tag, index) => ({
      text: tag,
      variant: index === 0 ? 'primary' : 'info' as const
    })),
    metadata: {
      date: item.date
    },
    primaryCTA: {
      text: 'Read More',
      onClick: handleReadMore
    }
  };
  const variant: CardVariantConfig = {
    type: 'news',
    layout: 'standard',
    maxTags: 2
  };
  return <UnifiedCard content={content} variant={variant} onQuickView={onQuickView} data-id={dataId} />;
};