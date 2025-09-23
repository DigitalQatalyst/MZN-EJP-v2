import React from 'react';
import { designTokens } from './designTokens';
export interface ResponsiveCardGridProps {
  children: React.ReactNode;
  className?: string;
  'data-id'?: string;
}
export const ResponsiveCardGrid: React.FC<ResponsiveCardGridProps> = ({
  children,
  className = '',
  'data-id': dataId
}) => {
  return <div className={`grid ${designTokens.responsive.grid.mobile} ${designTokens.responsive.grid.tablet} ${designTokens.responsive.grid.desktop} ${designTokens.responsive.gap} ${className}`} data-id={dataId}>
      {children}
    </div>;
};