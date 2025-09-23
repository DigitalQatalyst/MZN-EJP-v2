import React from 'react';
export interface CardFooterProps {
  primaryCTA?: {
    text: string;
    onClick: (e: React.MouseEvent) => void;
    variant?: 'primary' | 'secondary';
  };
  secondaryCTA?: {
    text: string;
    onClick: (e: React.MouseEvent) => void;
  };
  actions?: React.ReactNode;
}
export const CardFooter: React.FC<CardFooterProps> = ({
  primaryCTA,
  secondaryCTA,
  actions
}) => {
  if (!primaryCTA && !secondaryCTA && !actions) {
    return null;
  }
  return <div className="mt-auto border-t border-gray-100 p-4 pt-5">
      {actions && <div className="mb-4">{actions}</div>}
      {(primaryCTA || secondaryCTA) && <div className="flex justify-between gap-2">
          {secondaryCTA && <button onClick={secondaryCTA.onClick} className="px-4 py-2 text-sm font-medium text-blue-600 bg-white border border-blue-600 rounded-md hover:bg-blue-50 transition-colors whitespace-nowrap min-w-[120px] flex-1">
              {secondaryCTA.text}
            </button>}
          {primaryCTA && <button onClick={primaryCTA.onClick} className={`px-4 py-2 text-sm font-bold rounded-md transition-colors whitespace-nowrap flex-1 ${primaryCTA.variant === 'secondary' ? 'text-blue-600 bg-white border border-blue-600 hover:bg-blue-50' : 'text-white bg-blue-600 hover:bg-blue-700'}`}>
              {primaryCTA.text}
            </button>}
        </div>}
    </div>;
};