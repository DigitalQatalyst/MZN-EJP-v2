import React from 'react';
// Centralized design tokens for the card system
export const designTokens = {
  typography: {
    title: {
      size: 'text-lg',
      weight: 'font-bold',
      color: 'text-gray-900',
      lineHeight: 'leading-snug'
    },
    subtitle: {
      size: 'text-sm',
      weight: 'font-medium',
      color: 'text-gray-500',
      lineHeight: 'leading-tight'
    },
    description: {
      size: 'text-sm',
      weight: 'font-normal',
      color: 'text-gray-600',
      lineHeight: 'leading-relaxed'
    },
    metadata: {
      size: 'text-xs',
      weight: 'font-medium',
      color: 'text-gray-500',
      lineHeight: 'leading-tight'
    }
  },
  spacing: {
    card: {
      padding: 'p-6',
      gap: 'gap-4'
    },
    content: {
      marginBottom: 'mb-4',
      gap: 'gap-2'
    },
    pill: {
      padding: 'px-2 py-1',
      position: {
        top: 'top-3',
        right: 'right-3'
      }
    }
  },
  visual: {
    borderRadius: 'rounded-lg',
    shadow: {
      default: 'shadow-md',
      hover: 'hover:shadow-lg'
    },
    border: 'border border-gray-200',
    minHeight: 'min-h-[340px]'
  },
  colors: {
    primary: {
      bg: 'bg-blue-600',
      text: 'text-blue-600',
      hover: 'hover:bg-blue-700'
    },
    secondary: {
      bg: 'bg-gray-100',
      text: 'text-gray-600',
      hover: 'hover:bg-gray-200'
    },
    success: {
      bg: 'bg-green-50',
      text: 'text-green-700',
      border: 'border-green-100'
    },
    warning: {
      bg: 'bg-yellow-50',
      text: 'text-yellow-700',
      border: 'border-yellow-100'
    },
    info: {
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      border: 'border-blue-100'
    }
  },
  responsive: {
    grid: {
      mobile: 'grid-cols-1',
      tablet: 'sm:grid-cols-2',
      desktop: 'lg:grid-cols-3 xl:grid-cols-4'
    },
    gap: 'gap-6'
  },
  transitions: {
    default: 'transition-all duration-200',
    hover: 'transition-shadow duration-200'
  }
};
export const tagVariants = {
  primary: `${designTokens.colors.info.bg} ${designTokens.colors.info.text} ${designTokens.colors.info.border}`,
  secondary: `${designTokens.colors.secondary.bg} ${designTokens.colors.secondary.text} border border-gray-100`,
  success: `${designTokens.colors.success.bg} ${designTokens.colors.success.text} ${designTokens.colors.success.border}`,
  warning: `${designTokens.colors.warning.bg} ${designTokens.colors.warning.text} ${designTokens.colors.warning.border}`,
  info: `bg-purple-50 text-purple-700 border border-purple-100`
};