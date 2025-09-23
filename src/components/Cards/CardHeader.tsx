import React from 'react';
export interface CardHeaderProps {
  title: string;
  subtitle?: string;
  imageUrl?: string;
  imageAlt?: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}
export const CardHeader: React.FC<CardHeaderProps> = ({
  title,
  subtitle,
  imageUrl,
  imageAlt = '',
  icon,
  children
}) => {
  return <div className="px-4 py-5 flex-grow flex flex-col">
      <div className="flex items-start mb-5">
        {(imageUrl || icon) && <div className="h-12 w-12 flex-shrink-0 mr-3 flex items-center justify-center">
            {imageUrl ? <img src={imageUrl} alt={imageAlt} className="h-12 w-12 object-contain rounded-md" /> : <div className="h-12 w-12 bg-gray-100 rounded-md flex items-center justify-center text-gray-500">
                {icon}
              </div>}
          </div>}
        <div className="flex-grow min-h-[72px] flex flex-col justify-center">
          <h3 className="font-bold text-gray-900 line-clamp-2 min-h-[48px] leading-snug">
            {title}
          </h3>
          {subtitle && <p className="text-sm text-gray-500 min-h-[20px] mt-1">
              {subtitle}
            </p>}
        </div>
      </div>
      {children}
    </div>;
};