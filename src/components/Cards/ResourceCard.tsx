import React from 'react';
import { BaseCard } from './BaseCard';
import { CardHeader } from './CardHeader';
import { CardFooter } from './CardFooter';
import { TagChip } from './TagChip';
import { FileText, Download, Eye, ExternalLink, Book } from 'lucide-react';
export interface ResourceItem {
  id: string;
  title: string;
  category: string;
  description: string;
  tags: string[];
  resourceType: 'guide' | 'template' | 'tool' | 'documentation' | 'video' | 'article';
  fileSize?: string;
  downloadCount?: number;
  accessCount?: number;
  thumbnailUrl?: string;
  isExternal?: boolean;
  lastUpdated?: string;
}
export interface ResourceCardProps {
  item: ResourceItem;
  onAccessResource: () => void;
  onDownload?: () => void;
  onQuickView?: () => void;
  'data-id'?: string;
}
const getResourceIcon = (resourceType: ResourceItem['resourceType']) => {
  switch (resourceType) {
    case 'guide':
      return <Book size={24} />;
    case 'template':
      return <FileText size={24} />;
    case 'tool':
      return <ExternalLink size={24} />;
    case 'documentation':
      return <FileText size={24} />;
    case 'video':
      return <Eye size={24} />;
    case 'article':
      return <FileText size={24} />;
    default:
      return <FileText size={24} />;
  }
};
export const ResourceCard: React.FC<ResourceCardProps> = ({
  item,
  onAccessResource,
  onDownload,
  onQuickView,
  'data-id': dataId
}) => {
  const handleAccessResource = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAccessResource();
  };
  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDownload?.();
  };
  return <BaseCard onClick={onQuickView} data-id={dataId}>
      <CardHeader title={item.title} subtitle={item.category} imageUrl={item.thumbnailUrl} imageAlt={`${item.title} thumbnail`} icon={!item.thumbnailUrl ? getResourceIcon(item.resourceType) : undefined}>
        {/* Description */}
        <div className="mb-5">
          <p className="text-sm text-gray-600 line-clamp-3 min-h-[60px] leading-relaxed">
            {item.description}
          </p>
        </div>
        {/* Resource Details */}
        <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
          <div className="flex items-center gap-3">
            <span className="capitalize">{item.resourceType}</span>
            {item.fileSize && <span>{item.fileSize}</span>}
            {item.isExternal && <span>External</span>}
          </div>
          <div className="flex items-center gap-3">
            {item.downloadCount && <div className="flex items-center">
                <Download size={12} className="mr-1" />
                {item.downloadCount}
              </div>}
            {item.accessCount && <div className="flex items-center">
                <Eye size={12} className="mr-1" />
                {item.accessCount}
              </div>}
          </div>
        </div>
        {/* Last Updated */}
        {item.lastUpdated && <div className="text-xs text-gray-500 mb-4">
            Updated: {item.lastUpdated}
          </div>}
        {/* Tags */}
        <div className="flex flex-wrap gap-1 mt-auto">
          {item.tags.slice(0, 2).map((tag, index) => <TagChip key={index} text={tag} variant={index === 0 ? 'info' : 'secondary'} />)}
        </div>
      </CardHeader>
      <CardFooter primaryCTA={{
      text: item.isExternal ? 'Visit Resource' : 'Access Resource',
      onClick: handleAccessResource
    }} secondaryCTA={onDownload && !item.isExternal ? {
      text: 'Download',
      onClick: handleDownload
    } : undefined} actions={onDownload && !item.isExternal ? <div className="flex justify-end">
              <button onClick={handleDownload} className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors" aria-label="Download resource">
                <Download size={16} />
              </button>
            </div> : undefined} />
    </BaseCard>;
};