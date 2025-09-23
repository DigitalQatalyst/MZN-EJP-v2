import React from 'react';
// Define design tokens inline to avoid import issues
const BASE_DESIGN_TOKENS = {
  visual: {
    minHeight: 'min-h-[340px]',
    borderRadius: 'rounded-lg',
    shadow: {
      default: 'shadow-md',
      hover: 'hover:shadow-lg'
    }
  },
  transitions: {
    hover: 'transition-shadow duration-200'
  }
};
export interface BaseCardProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  'data-id'?: string;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}
export const BaseCard: React.FC<BaseCardProps> = ({
  children,
  onClick,
  className = '',
  'data-id': dataId,
  onMouseEnter,
  onMouseLeave
}) => {
  return <div className={`flex flex-col ${BASE_DESIGN_TOKENS.visual.minHeight} bg-white ${BASE_DESIGN_TOKENS.visual.borderRadius} ${BASE_DESIGN_TOKENS.visual.shadow.default} overflow-hidden ${BASE_DESIGN_TOKENS.visual.shadow.hover} ${BASE_DESIGN_TOKENS.transitions.hover} ${onClick ? 'cursor-pointer' : ''} ${className}`} onClick={onClick} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} data-id={dataId} role={onClick ? 'button' : undefined} tabIndex={onClick ? 0 : undefined} onKeyDown={onClick ? e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
    }
  } : undefined}>
      {children}
    </div>;
};