import React from 'react';
export interface TagChipProps {
  text: string;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'info';
  size?: 'sm' | 'md';
}
const tagVariants = {
  primary: 'bg-blue-50 text-blue-700 border border-blue-100',
  secondary: 'bg-gray-50 text-gray-700 border border-gray-100',
  success: 'bg-green-50 text-green-700 border border-green-100',
  warning: 'bg-yellow-50 text-yellow-700 border border-yellow-100',
  info: 'bg-purple-50 text-purple-700 border border-purple-100'
};
const tagSizes = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-sm'
};
export const TagChip: React.FC<TagChipProps> = ({
  text,
  variant = 'primary',
  size = 'sm'
}) => {
  return <span className={`inline-flex items-center rounded-full font-medium truncate ${tagVariants[variant]} ${tagSizes[size]}`}>
      {text}
    </span>;
};