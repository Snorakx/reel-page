# MVP Development Pages Design Documentation

## Overview
Design inspired by **JetBrains WebStorm landing page** with organic gradient shapes, dark theme, and modern typography. Maintains Coderno's green branding while achieving premium, contemporary aesthetic.

## Color Palette

### Primary Colors
- **Background**: `bg-black` (pure black, not gray)
- **Text Primary**: `text-white` 
- **Text Secondary**: `text-gray-400`
- **Accent Primary**: `text-emerald-400` (Coderno green)
- **Accent Secondary**: `text-emerald-600` (buttons)

### Gradient Colors
- **Main Blob**: `from-blue-500 via-cyan-400 to-yellow-400` (WebStorm style)
- **Secondary Blob**: `from-green-400 via-emerald-400 to-teal-400` (Coderno branding)
- **Accent Blob**: `from-purple-400 to-pink-400`

## Layout Structure

### Container System
- Max width: `max-w-7xl`
- Padding: `px-8 md:px-16`
- Full-screen hero: `min-h-screen flex items-center`

### Grid System
- Hero: Single column, left-aligned content, `max-w-2xl`
- Stats: `grid-cols-2 md:grid-cols-4`
- Services: `grid md:grid-cols-3`
- FAQ: Single column, `max-w-4xl`

## Typography

### Headings
- **H1 Hero**: `text-5xl md:text-7xl lg:text-8xl font-light`
- **H2 Sections**: `text-4xl md:text-5xl font-light`
- **H3 Cards**: `text-2xl font-light`
- **Body**: `text-xl md:text-2xl font-light`

### Font Weights
- Primary: `font-light`
- Accents: `font-normal` or `font-medium`
- Emphasis: `font-medium`

## Background Elements

### Organic Gradient Shapes
```css
<!-- Main container positioned on right side -->
<div class="absolute top-0 right-0 w-[60%] h-full">
  <!-- Large blue-yellow blob (WebStorm style) -->
  <div class="absolute top-1/4 right-0 w-[500px] h-[400px] bg-gradient-to-br from-blue-500 via-cyan-400 to-yellow-400 rounded-full blur-3xl opacity-60 animate-pulse"></div>
  
  <!-- Secondary green blob (Coderno) -->
  <div class="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-gradient-to-br from-green-400 via-emerald-400 to-teal-400 rounded-full blur-3xl opacity-40 animate-pulse animation-delay-2s"></div>
  
  <!-- Small accent blob -->
  <div class="absolute top-1/2 right-1/3 w-[200px] h-[200px] bg-gradient-to-br from-purple-400 to-pink-400 rounded-full blur-2xl opacity-30 animate-pulse animation-delay-4s"></div>
</div>

<!-- Small accent dots -->
<div class="absolute top-1/3 right-20 w-2 h-2 bg-white rounded-full opacity-60"></div>
<div class="absolute bottom-1/3 right-32 w-1 h-1 bg-cyan-400 rounded-full opacity-80"></div>
```

### Key Properties
- `blur-3xl` for main shapes
- `blur-2xl` for smaller shapes
- `opacity-60`, `opacity-40`, `opacity-30` for layering
- `animate-pulse` with staggered delays
- `rounded-full` for organic shapes

## Components

### Pill Badge (WebStorm-style)
```css
<div class="inline-flex items-center gap-2 bg-gray-800 border border-gray-700 rounded-full px-4 py-2 mb-8">
  <span class="text-emerald-400 text-sm font-medium">Coderno</span>
  <span class="text-gray-400 text-sm">MVP w 7 dni</span>
</div>
```

### Service Cards
```css
<div class="bg-gray-900/50 border border-gray-800 rounded-lg p-8 hover:border-emerald-500/50 transition-all duration-300">
  <h3 class="text-2xl font-light text-white mb-4">[Title]</h3>
  <div class="text-3xl font-light text-emerald-400 mb-4">[Price]</div>
  <p class="text-gray-400 mb-6">[Description]</p>
  <ul class="text-gray-400 space-y-2 text-sm">
    <li>• [Feature]</li>
  </ul>
</div>
```

### FAQ Items
```css
<div class="bg-gray-900/30 border border-gray-800 rounded-lg p-6">
  <h3 class="text-xl font-medium text-white mb-3">[Question]</h3>
  <p class="text-gray-400">[Answer]</p>
</div>
```

### CTA Button
```css
<a class="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-lg font-medium transition-all duration-300 text-lg inline-block">
  [Button Text]
</a>
```

## Section Structure

### 1. Hero Section
- Full-screen height with vertical centering
- Left-aligned content, max-width constraint
- Pill badge → Large heading → Subtitle → CTA
- No icons, no complex graphics

### 2. Stats Section
- Horizontal border separator: `border-t border-gray-800`
- 4-column grid on desktop, 2-column on mobile
- Large emerald numbers with gray labels

### 3. Services Section
- 3-column card grid
- Hover effects with emerald border
- Price prominently displayed
- Bullet points with simple text

### 4. FAQ Section
- Static cards (no dropdowns/accordions)
- Simple question-answer format
- Consistent spacing and typography

### 5. Contact CTA
- Centered layout
- Minimal text
- Single email button

## Responsive Design

### Breakpoints
- Mobile: Base styles
- Medium: `md:` prefix (768px+)
- Large: `lg:` prefix (1024px+)

### Key Responsive Changes
- Typography scales: `text-5xl md:text-7xl lg:text-8xl`
- Grid layouts: `grid-cols-2 md:grid-cols-4`
- Padding adjustments: `px-8 md:px-16`

## Animations

### CSS Keyframes
```css
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

.animation-delay-2s {
  animation-delay: 2s;
}

.animation-delay-4s {
  animation-delay: 4s;
}
```

### Animation Usage
- `animate-pulse` for gradient blobs
- Staggered delays for layered effect
- Subtle hover transitions on cards

## SEO & Structured Data

### Meta Structure
- Enhanced titles with "7 days" messaging
- Rich descriptions with emojis and benefits
- Comprehensive keywords including multilingual terms

### Schema Markup
- Service schema with pricing
- FAQ schema for better SERP features
- Organization and rating data
- Polish: 8k-15k PLN pricing
- English: $2k-3.75k USD pricing

## Content Strategy

### Headlines
- Polish: "Buduj swoje MVP" 
- English: "Build your MVP"
- Emphasizes speed: "w 7 dni" / "in 7 days"

### Value Props
- 24-hour quotes
- 7-day delivery
- Start tomorrow messaging
- Clear pricing transparency

## Technical Implementation

### Framework
- Astro.js with TypeScript
- Tailwind CSS for styling
- React components for interactivity

### File Structure
- Polish: `/mvp-development.astro`
- English: `/[lang]/mvp-development.astro`
- Shared components and layouts

### Performance
- Minimal JavaScript
- CSS-only animations
- Optimized gradient rendering with blur effects

## Brand Consistency

### Coderno Elements
- Emerald/green color scheme throughout
- Professional B2B messaging
- Technical expertise emphasis
- Premium positioning

### WebStorm Inspiration
- Organic gradient shapes
- Dark theme aesthetic
- Clean typography hierarchy
- Minimal, focused design
- Pill-style badges

## Maintenance Notes

### Easy Updates
- Pricing changes in structured data
- FAQ content modifications
- CTA button text updates
- Color scheme adjustments

### Design System
- Consistent spacing with Tailwind
- Reusable component patterns
- Scalable typography system
- Modular section structure

This design achieves the sophisticated, premium feel of JetBrains products while maintaining Coderno's brand identity and business requirements. 