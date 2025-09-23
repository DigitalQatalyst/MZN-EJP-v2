import React from 'react';
import { BaseCard } from './BaseCard';
import { CardHeader } from './CardHeader';
import { CardFooter } from './CardFooter';
import { TagChip } from './TagChip';
import { Calendar, MapPin, Users } from 'lucide-react';
export interface EventItem {
  id: string;
  title: string;
  organizer: string;
  dateTime: string;
  location: string;
  description: string;
  tags: string[];
  organizerLogoUrl?: string;
  attendeeCount?: number;
}
export interface EventCardProps {
  item: EventItem;
  onRegister: () => void;
  onViewDetails?: () => void;
  onQuickView?: () => void;
  'data-id'?: string;
}
export const EventCard: React.FC<EventCardProps> = ({
  item,
  onRegister,
  onViewDetails,
  onQuickView,
  'data-id': dataId
}) => {
  const handleRegister = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRegister();
  };
  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    onViewDetails?.();
  };
  return <BaseCard onClick={onQuickView} data-id={dataId}>
      <CardHeader title={item.title} subtitle={item.organizer} imageUrl={item.organizerLogoUrl} imageAlt={`${item.organizer} logo`} icon={!item.organizerLogoUrl ? <Users size={24} /> : undefined}>
        {/* Description */}
        <div className="mb-5">
          <p className="text-sm text-gray-600 line-clamp-3 min-h-[60px] leading-relaxed">
            {item.description}
          </p>
        </div>
        {/* Event Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-500">
            <Calendar size={14} className="mr-2" />
            {item.dateTime}
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <MapPin size={14} className="mr-2" />
            {item.location}
          </div>
          {item.attendeeCount && <div className="flex items-center text-sm text-gray-500">
              <Users size={14} className="mr-2" />
              {item.attendeeCount} attendees
            </div>}
        </div>
        {/* Tags */}
        <div className="flex flex-wrap gap-1 mt-auto">
          {item.tags.slice(0, 2).map((tag, index) => <TagChip key={index} text={tag} variant={index === 0 ? 'success' : 'primary'} />)}
        </div>
      </CardHeader>
      <CardFooter primaryCTA={{
      text: 'Register',
      onClick: handleRegister
    }} secondaryCTA={onViewDetails ? {
      text: 'View Details',
      onClick: handleViewDetails
    } : undefined} />
    </BaseCard>;
};