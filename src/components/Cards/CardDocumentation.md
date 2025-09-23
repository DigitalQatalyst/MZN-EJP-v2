# Card Design System Documentation
## Overview
The Card Design System provides a unified, scalable, and accessible solution for displaying content across the platform. Built with React/TypeScript and optimized for responsive design.
## Design Tokens
### Typography
- **Title**: `text-lg font-bold text-gray-900 leading-snug`
- **Subtitle**: `text-sm font-medium text-gray-500 leading-tight`
- **Description**: `text-sm font-normal text-gray-600 leading-relaxed`
- **Metadata**: `text-xs font-medium text-gray-500 leading-tight`
### Spacing
- **Card Padding**: `p-6`
- **Content Gap**: `gap-4`
- **Grid Gap**: `gap-6`
- **Pill Position**: `top-3 right-3` (12px from edges)
- **Minimum Height**: `340px`
### Visual Elements
- **Border Radius**: `rounded-lg` (8px)
- **Shadow**: `shadow-md` (default), `hover:shadow-lg` (hover)
- **Border**: `border border-gray-200`
- **Transitions**: `transition-all duration-200`
## Card Variants
### 1. News Card
**When to use**: Articles, blog posts, news updates
**Key features**: Source logo, publication date, excerpt