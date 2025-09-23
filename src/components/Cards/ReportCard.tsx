import React from 'react';
import { BaseCard } from './BaseCard';
import { CardHeader } from './CardHeader';
import { CardFooter } from './CardFooter';
import { TagChip } from './TagChip';
import { FileText, Download, Eye } from 'lucide-react';
export interface ReportItem {
  id: string;
  title: string;
  category: string;
  summary: string;
  tags: string[];
  publishDate: string;
  fileSize?: string;
  downloadCount?: number;
  thumbnailUrl?: string;
}
export interface ReportCardProps {
  item: ReportItem;
  onViewReport: () => void;
  onDownload?: () => void;
  onQuickView?: () => void;
  'data-id'?: string;
}
export const ReportCard: React.FC<ReportCardProps> = ({
  item,
  onViewReport,
  onDownload,
  onQuickView,
  'data-id': dataId
}) => {
  const handleViewReport = (e: React.MouseEvent) => {
    e.stopPropagation();
    onViewReport();
  };
  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDownload?.();
  };
  return <BaseCard onClick={onQuickView} data-id={dataId}>
      <CardHeader title={item.title} subtitle={item.category} imageUrl={item.thumbnailUrl} imageAlt={`${item.title} thumbnail`} icon={!item.thumbnailUrl ? <FileText size={24} /> : undefined}>
        {/* Summary */}
        <div className="mb-5">
          <p className="text-sm text-gray-600 line-clamp-3 min-h-[60px] leading-relaxed">
            {item.summary}
          </p>
        </div>
        {/* Report Details */}
        <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
          <span>{item.publishDate}</span>
          <div className="flex items-center gap-3">
            {item.fileSize && <span>{item.fileSize}</span>}
            {item.downloadCount && <div className="flex items-center">
                <Download size={12} className="mr-1" />
                {item.downloadCount}
              </div>}
          </div>
        </div>
        {/* Tags */}
        <div className="flex flex-wrap gap-1 mt-auto">
          {item.tags.slice(0, 2).map((tag, index) => <TagChip key={index} text={tag} variant={index === 0 ? 'warning' : 'info'} />)}
        </div>
      </CardHeader>
      <CardFooter primaryCTA={{
      text: 'View Report',
      onClick: handleViewReport
    }} secondaryCTA={onDownload ? {
      text: 'Download',
      onClick: handleDownload
    } : undefined} actions={onDownload ? <div className="flex justify-end">
              <button onClick={handleDownload} className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors" aria-label="Download report">
                <Download size={16} />
              </button>
            </div> : undefined} />
    </BaseCard>;
};