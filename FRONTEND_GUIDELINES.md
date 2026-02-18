# Frontend Design System Documentation
## Agentic AI-Powered Pharmacy Assistant

**Version**: 1.0  
**Last Updated**: February 15, 2026  
**Design System Name**: Pharmacy Assistant Design System (PADS)  
**Target Audience**: Patients (30-70 years), Pharmacy Staff  
**Style**: Professional, Trustworthy, Accessible, Healthcare-Friendly

---

## 1. Design Principles

### Core Principles

#### 1. Trust & Safety First
- Healthcare demands trustworthy design
- Clear communication of medication information
- Visual cues for critical actions (prescription required, dosage warnings)
- Professional color palette that conveys medical reliability

#### 2. Clarity Over Cleverness
- Every element has a clear, singular purpose
- Plain language over medical jargon (unless necessary)
- Obvious interactive elements (no hidden gestures)
- Predictable navigation patterns

#### 3. Accessibility as Standard
- WCAG 2.1 Level AA compliance minimum
- High color contrast (4.5:1 for text)
- Large touch targets (48x48px minimum for primary actions)
- Screen reader friendly
- Keyboard navigation for all features

#### 4. Efficiency & Speed
- Minimize clicks to complete common tasks (order, refill)
- Autofill and smart defaults (last order quantities)
- Quick actions for power users (keyboard shortcuts)
- Fast load times (<3 seconds on 3G)

#### 5. Consistency Across Contexts
- Design patterns repeat throughout the app
- Same interaction for same outcome
- Visual consistency (colors, spacing, typography)
- Predictable behavior (modals, forms, navigation)

---

## 2. Design Tokens

### Color Palette

#### Primary Colors (Medical Blue - Trust & Reliability)
```css
--color-primary-50: #eff6ff;   /* Lightest tint - backgrounds */
--color-primary-100: #dbeafe;  /* Very light - hover states */
--color-primary-200: #bfdbfe;  /* Light - borders */
--color-primary-300: #93c5fd;  /* Medium light - disabled states */
--color-primary-400: #60a5fa;  /* Medium - secondary actions */
--color-primary-500: #3b82f6;  /* MAIN BRAND COLOR - primary CTAs */
--color-primary-600: #2563eb;  /* Medium dark - hover on primary */
--color-primary-700: #1d4ed8;  /* Dark - pressed states */
--color-primary-800: #1e40af;  /* Darker - text on light backgrounds */
--color-primary-900: #1e3a8a;  /* Darkest - headers, emphasis */
```

**Usage Rules:**
- Use primary-500 for main CTAs ("Order Now", "Confirm Refill")
- Use primary-600 for hover states on CTAs
- Use primary-50/100 for subtle backgrounds (info cards)
- Use primary-700/800 for important text or icons
- Never use primary colors for error states

#### Neutral Colors (Grays - UI Foundation)
```css
--color-neutral-50: #f9fafb;   /* Page backgrounds */
--color-neutral-100: #f3f4f6;  /* Card backgrounds, disabled fields */
--color-neutral-200: #e5e7eb;  /* Borders, dividers */
--color-neutral-300: #d1d5db;  /* Input borders */
--color-neutral-400: #9ca3af;  /* Placeholder text, icons */
--color-neutral-500: #6b7280;  /* Secondary text */
--color-neutral-600: #4b5563;  /* Primary text (body) */
--color-neutral-700: #374151;  /* Headings */
--color-neutral-800: #1f2937;  /* Emphasis text */
--color-neutral-900: #111827;  /* Highest contrast text */
```

**Usage Rules:**
- Body text: neutral-600 on neutral-50 background (6.3:1 contrast)
- Headings: neutral-800 or neutral-900
- Secondary text (timestamps, helper text): neutral-500
- Placeholder text: neutral-400
- Borders: neutral-200 (default), neutral-300 (focus)

#### Success Colors (Green - Confirmations, Health)
```css
--color-success-50: #f0fdf4;
--color-success-100: #dcfce7;
--color-success-500: #10b981;  /* Main success color */
--color-success-600: #059669;  /* Hover state */
--color-success-700: #047857;  /* Pressed state */
```

**Usage Rules:**
- Order confirmations ("Order placed successfully!")
- Prescription approved status
- Medication in stock indicators
- Success toasts and alerts

#### Warning Colors (Amber - Cautions, Low Stock)
```css
--color-warning-50: #fffbeb;
--color-warning-100: #fef3c7;
--color-warning-500: #f59e0b;  /* Main warning color */
--color-warning-600: #d97706;  /* Hover state */
--color-warning-700: #b45309;  /* Pressed state */
```

**Usage Rules:**
- Low stock warnings (inventory <10 units)
- Prescription expiring soon (within 30 days)
- Non-critical validation errors (weak password)
- Reminders (refill due soon)

#### Error Colors (Red - Errors, Critical Actions)
```css
--color-error-50: #fef2f2;
--color-error-100: #fee2e2;
--color-error-500: #ef4444;    /* Main error color */
--color-error-600: #dc2626;    /* Hover state */
--color-error-700: #b91c1c;    /* Pressed state */
```

**Usage Rules:**
- Form validation errors
- Prescription rejected status
- Out of stock indicators
- Destructive actions (cancel order, delete account)
- Critical alerts (payment failed)

#### Info Colors (Blue - Helpful Information)
```css
--color-info-50: #eff6ff;
--color-info-100: #dbeafe;
--color-info-500: #3b82f6;     /* Same as primary-500 */
--color-info-600: #2563eb;
--color-info-700: #1d4ed8;
```

**Usage Rules:**
- Informational alerts (prescription upload tips)
- Help text
- Tooltips
- New feature announcements

### Typography

#### Font Families
```css
--font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 
             'Helvetica Neue', Arial, sans-serif;
--font-mono: 'Fira Code', 'SF Mono', Monaco, 'Cascadia Code', 'Courier New', monospace;
```

**Rationale:**
- Inter: Excellent readability at all sizes, neutral, professional
- High x-height for legibility (important for older users)
- Optimized for screens
- Variable font support for performance

**Implementation:**
```typescript
// tailwind.config.ts
fontFamily: {
  sans: ['Inter var', ...defaultTheme.fontFamily.sans],
  mono: ['Fira Code', ...defaultTheme.fontFamily.mono],
}
```

#### Font Sizes (Type Scale)
```css
--text-xs: 0.75rem;     /* 12px - Fine print, timestamps */
--text-sm: 0.875rem;    /* 14px - Secondary text, labels */
--text-base: 1rem;      /* 16px - Body text (DEFAULT) */
--text-lg: 1.125rem;    /* 18px - Emphasized body, small headings */
--text-xl: 1.25rem;     /* 20px - Card titles, section headings */
--text-2xl: 1.5rem;     /* 24px - Page headings */
--text-3xl: 1.875rem;   /* 30px - Modal headings, hero */
--text-4xl: 2.25rem;    /* 36px - Hero headings, landing page */
```

**Usage Guidelines:**
- **Body text**: Always `text-base` (16px) - never smaller for readability
- **Headings**: 
  - H1 (page title): `text-3xl` or `text-4xl`
  - H2 (section): `text-2xl`
  - H3 (card title): `text-xl`
- **UI labels**: `text-sm` (form labels, table headers)
- **Fine print**: `text-xs` (only for non-critical text like timestamps)
- **Medication names**: `text-lg font-semibold` (easy to read, stands out)

#### Font Weights
```css
--font-light: 300;       /* Rarely used */
--font-normal: 400;      /* Body text */
--font-medium: 500;      /* UI labels, emphasized text */
--font-semibold: 600;    /* Headings, buttons */
--font-bold: 700;        /* Strong emphasis, alerts */
```

**Usage Guidelines:**
- **Body text**: `font-normal` (400)
- **Headings**: `font-semibold` (600) or `font-bold` (700)
- **Buttons**: `font-medium` (500)
- **Form labels**: `font-medium` (500)
- **Medication names**: `font-semibold` (600)
- **Alerts**: `font-bold` (700) for title, `font-medium` (500) for body

#### Line Heights
```css
--leading-none: 1;        /* Tight headings */
--leading-tight: 1.25;    /* Headings */
--leading-snug: 1.375;    /* Dense text */
--leading-normal: 1.5;    /* Body text (DEFAULT) */
--leading-relaxed: 1.75;  /* Comfortable reading */
--leading-loose: 2;       /* Spacious text */
```

**Usage Guidelines:**
- **Body text**: `leading-normal` (1.5) - optimal readability
- **Headings**: `leading-tight` (1.25) - visually compact
- **Buttons**: `leading-none` (1) - vertically centered text
- **Chat messages**: `leading-relaxed` (1.75) - easy reading

#### Letter Spacing
```css
--tracking-tighter: -0.05em;
--tracking-tight: -0.025em;
--tracking-normal: 0;
--tracking-wide: 0.025em;
--tracking-wider: 0.05em;
```

**Usage:**
- **Default**: `tracking-normal` (0)
- **Headings**: `tracking-tight` (-0.025em) for large sizes
- **All caps text**: `tracking-wide` (0.025em) for readability
- **Buttons**: `tracking-normal` (0)

### Spacing Scale
```css
--spacing-0: 0;           /* 0px - No spacing */
--spacing-px: 1px;        /* 1px - Hairline dividers */
--spacing-0.5: 0.125rem;  /* 2px - Tight spacing */
--spacing-1: 0.25rem;     /* 4px - Minimal spacing */
--spacing-1.5: 0.375rem;  /* 6px - Between icons and text */
--spacing-2: 0.5rem;      /* 8px - Small padding */
--spacing-3: 0.75rem;     /* 12px - Compact padding */
--spacing-4: 1rem;        /* 16px - DEFAULT component padding */
--spacing-5: 1.25rem;     /* 20px - Medium padding */
--spacing-6: 1.5rem;      /* 24px - Large padding, section gaps */
--spacing-8: 2rem;        /* 32px - Section spacing */
--spacing-10: 2.5rem;     /* 40px - Large section spacing */
--spacing-12: 3rem;       /* 48px - Extra large spacing */
--spacing-16: 4rem;       /* 64px - Hero section padding */
--spacing-20: 5rem;       /* 80px - Maximum spacing */
```

**Usage Rules:**

**Component Internal Padding:**
- Buttons: `px-4 py-2` (medium), `px-3 py-1.5` (small), `px-6 py-3` (large)
- Cards: `p-6` (24px padding)
- Modals: `p-6` or `p-8` (24-32px padding)
- Input fields: `px-3 py-2` (12px horizontal, 8px vertical)

**Stack Spacing (Vertical):**
- Form field groups: `space-y-4` (16px between fields)
- Card content: `space-y-3` (12px between elements)
- Sections: `space-y-8` or `space-y-12` (32-48px)

**Inline Spacing (Horizontal):**
- Icon + text: `gap-2` (8px)
- Button groups: `gap-3` (12px)
- Navigation items: `gap-6` (24px)

**Layout Margins:**
- Page wrapper: `px-4 sm:px-6 lg:px-8` (responsive horizontal padding)
- Section top/bottom: `py-8` or `py-12` (32-48px)
- Container max-width: `max-w-7xl mx-auto` (1280px centered)

### Border Radius
```css
--radius-none: 0;           /* 0px - Sharp corners */
--radius-sm: 0.125rem;      /* 2px - Subtle rounding */
--radius-base: 0.25rem;     /* 4px - Default buttons, inputs */
--radius-md: 0.375rem;      /* 6px - Cards (small) */
--radius-lg: 0.5rem;        /* 8px - Cards (default), modals */
--radius-xl: 0.75rem;       /* 12px - Large cards */
--radius-2xl: 1rem;         /* 16px - Hero cards */
--radius-3xl: 1.5rem;       /* 24px - Feature cards */
--radius-full: 9999px;      /* Fully rounded - pills, avatars */
```

**Usage Rules:**
- **Buttons**: `rounded-lg` (8px)
- **Input fields**: `rounded-md` (6px)
- **Cards**: `rounded-lg` (8px default), `rounded-xl` (12px for emphasis)
- **Modals**: `rounded-lg` (8px)
- **Badges/Pills**: `rounded-full` (fully rounded)
- **Avatars**: `rounded-full` (circles)
- **Chat bubbles**: `rounded-2xl` (16px for soft, friendly feel)

### Shadows (Elevation)
```css
/* Subtle shadow - Hover states, slight elevation */
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);

/* Default shadow - Cards, dropdowns */
--shadow-base: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 
               0 1px 2px 0 rgba(0, 0, 0, 0.06);

/* Medium shadow - Hover on cards, tooltips */
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 
             0 2px 4px -1px rgba(0, 0, 0, 0.06);

/* Large shadow - Modals, popovers */
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 
             0 4px 6px -2px rgba(0, 0, 0, 0.05);

/* Extra large shadow - Floating action buttons, critical modals */
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 
             0 10px 10px -5px rgba(0, 0, 0, 0.04);

/* Inner shadow - Inset inputs, pressed buttons */
--shadow-inner: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06);
```

**Usage Rules:**
- **Resting cards**: `shadow-sm`
- **Hover cards**: `shadow-md`
- **Modals/Dialogs**: `shadow-xl`
- **Dropdowns**: `shadow-lg`
- **Pressed buttons**: `shadow-inner` or no shadow
- **Floating elements**: `shadow-lg` or `shadow-xl`

**Transition:**
```css
/* Smooth shadow transitions on hover */
.card {
  @apply shadow-sm transition-shadow duration-200;
}
.card:hover {
  @apply shadow-md;
}
```

### Z-Index Scale
```css
--z-base: 0;           /* Default layer */
--z-dropdown: 10;      /* Dropdowns */
--z-sticky: 20;        /* Sticky headers */
--z-fixed: 30;         /* Fixed elements */
--z-modal-backdrop: 40; /* Modal overlays */
--z-modal: 50;         /* Modal content */
--z-popover: 60;       /* Popovers, tooltips */
--z-toast: 70;         /* Toast notifications */
--z-tooltip: 80;       /* Tooltips (highest) */
```

---

## 3. Layout System

### Grid System

#### Container
```tsx
<div className="container mx-auto px-4 sm:px-6 lg:px-8">
  {/* Content */}
</div>
```

**Specifications:**
- Max width: `1280px` (default), `1536px` (2xl)
- Horizontal padding: 
  - Mobile: `16px` (px-4)
  - Tablet: `24px` (sm:px-6)
  - Desktop: `32px` (lg:px-8)
- Centered: `mx-auto`

#### Grid Columns
```tsx
{/* 12-column responsive grid */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <div>{/* Column 1 */}</div>
  <div>{/* Column 2 */}</div>
  <div>{/* Column 3 */}</div>
</div>
```

**Specifications:**
- Base: 12 columns
- Gutter: `24px` (gap-6) default
- Responsive: 1 col (mobile) → 2 col (tablet) → 3-4 col (desktop)

### Responsive Breakpoints
```css
--breakpoint-sm: 640px;    /* Mobile landscape */
--breakpoint-md: 768px;    /* Tablet portrait */
--breakpoint-lg: 1024px;   /* Desktop */
--breakpoint-xl: 1280px;   /* Wide desktop */
--breakpoint-2xl: 1536px;  /* Ultra wide */
```

**Tailwind Usage:**
```tsx
<div className="
  text-base     /* Mobile: 16px */
  sm:text-lg    /* Tablet: 18px */
  lg:text-xl    /* Desktop: 20px */
">
  Responsive text
</div>
```

### Common Layout Patterns

#### 1. Centered Content Container
```tsx
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
  {/* Page content */}
</div>
```

#### 2. Two-Column Layout (Sidebar + Main)
```tsx
<div className="flex flex-col lg:flex-row gap-6">
  {/* Sidebar */}
  <aside className="w-full lg:w-64 flex-shrink-0">
    {/* Navigation */}
  </aside>
  
  {/* Main content */}
  <main className="flex-1 min-w-0">
    {/* Content */}
  </main>
</div>
```

#### 3. Three-Column Grid (Cards)
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <div className="bg-white rounded-lg shadow-sm p-6">
    {/* Card 1 */}
  </div>
  <div className="bg-white rounded-lg shadow-sm p-6">
    {/* Card 2 */}
  </div>
  <div className="bg-white rounded-lg shadow-sm p-6">
    {/* Card 3 */}
  </div>
</div>
```

#### 4. Chat Interface Layout
```tsx
<div className="flex flex-col h-screen">
  {/* Header */}
  <header className="flex-shrink-0 h-16 border-b border-neutral-200 bg-white">
    {/* Header content */}
  </header>
  
  {/* Messages (scrollable) */}
  <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-neutral-50">
    {/* Chat messages */}
  </div>
  
  {/* Input (fixed bottom) */}
  <div className="flex-shrink-0 border-t border-neutral-200 bg-white p-4">
    {/* Message input */}
  </div>
</div>
```

#### 5. Admin Dashboard Layout
```tsx
<div className="flex h-screen bg-neutral-50">
  {/* Sidebar */}
  <aside className="w-64 bg-white border-r border-neutral-200 overflow-y-auto">
    {/* Navigation */}
  </aside>
  
  {/* Main area */}
  <div className="flex-1 flex flex-col overflow-hidden">
    {/* Top bar */}
    <header className="h-16 bg-white border-b border-neutral-200 px-6 flex items-center">
      {/* Search, notifications, profile */}
    </header>
    
    {/* Content */}
    <main className="flex-1 overflow-y-auto p-6">
      {/* Dashboard content */}
    </main>
  </div>
</div>
```

---

## 4. Component Library

### Buttons

#### Primary Button (Main Actions)
```tsx
<button className="
  px-4 py-2
  bg-primary-500 hover:bg-primary-600 active:bg-primary-700
  text-white font-medium
  rounded-lg
  shadow-sm hover:shadow-md
  transition-all duration-200
  focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
  disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none
">
  Place Order
</button>
```

**Usage:**
- One primary button per screen/section
- Use for main actions: "Place Order", "Confirm", "Save"
- Always visible and accessible

#### Secondary Button (Supporting Actions)
```tsx
<button className="
  px-4 py-2
  bg-neutral-100 hover:bg-neutral-200 active:bg-neutral-300
  text-neutral-900 font-medium
  rounded-lg
  border border-neutral-300
  transition-all duration-200
  focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2
  disabled:opacity-50 disabled:cursor-not-allowed
">
  Cancel
</button>
```

**Usage:**
- Supporting actions: "Cancel", "Go Back", "Skip"
- Can have multiple per screen
- Always paired with primary button in dialogs

#### Outline Button (Tertiary Actions)
```tsx
<button className="
  px-4 py-2
  bg-transparent hover:bg-primary-50
  text-primary-600 hover:text-primary-700 font-medium
  rounded-lg
  border border-primary-500
  transition-all duration-200
  focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
">
  View Details
</button>
```

**Usage:**
- Less important actions: "View Details", "Learn More"
- Links that look like buttons
- Secondary CTAs on cards

#### Ghost Button (Minimal Actions)
```tsx
<button className="
  px-4 py-2
  bg-transparent hover:bg-neutral-100
  text-neutral-700 hover:text-neutral-900 font-medium
  rounded-lg
  transition-all duration-200
  focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2
">
  Edit
</button>
```

**Usage:**
- Inline actions: "Edit", "Delete", "Share"
- Table row actions
- Toolbar buttons

#### Danger Button (Destructive Actions)
```tsx
<button className="
  px-4 py-2
  bg-error-500 hover:bg-error-600 active:bg-error-700
  text-white font-medium
  rounded-lg
  shadow-sm hover:shadow-md
  transition-all duration-200
  focus:outline-none focus:ring-2 focus:ring-error-500 focus:ring-offset-2
  disabled:opacity-50 disabled:cursor-not-allowed
">
  Delete Order
</button>
```

**Usage:**
- Destructive actions: "Delete", "Cancel Order", "Remove"
- ALWAYS show confirmation modal before executing
- Use sparingly

#### Button Sizes
```tsx
{/* Small */}
<button className="px-3 py-1.5 text-sm rounded-md">
  Small Button
</button>

{/* Medium (Default) */}
<button className="px-4 py-2 text-base rounded-lg">
  Medium Button
</button>

{/* Large */}
<button className="px-6 py-3 text-lg rounded-lg">
  Large Button
</button>
```

#### Button with Icon
```tsx
import { Send } from 'lucide-react';

<button className="px-4 py-2 bg-primary-500 text-white rounded-lg flex items-center gap-2">
  <Send className="w-4 h-4" />
  Send Message
</button>
```

#### Icon-Only Button
```tsx
import { X } from 'lucide-react';

<button 
  className="
    p-2 
    rounded-lg 
    hover:bg-neutral-100 
    transition-colors
    focus:outline-none focus:ring-2 focus:ring-neutral-400
  "
  aria-label="Close"
>
  <X className="w-5 h-5 text-neutral-600" />
</button>
```

#### Loading State Button
```tsx
<button 
  className="px-4 py-2 bg-primary-500 text-white rounded-lg flex items-center gap-2"
  disabled
>
  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
    <circle 
      className="opacity-25" 
      cx="12" cy="12" r="10" 
      stroke="currentColor" 
      strokeWidth="4"
      fill="none"
    />
    <path 
      className="opacity-75" 
      fill="currentColor" 
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
  Processing...
</button>
```

---

### Input Fields

#### Text Input (Standard)
```tsx
<div className="space-y-1">
  <label 
    htmlFor="medication-name" 
    className="block text-sm font-medium text-neutral-700"
  >
    Medication Name
  </label>
  <input
    type="text"
    id="medication-name"
    name="medication-name"
    className="
      block w-full
      px-3 py-2
      bg-white
      border border-neutral-300 rounded-md
      text-neutral-900 placeholder:text-neutral-400
      focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
      disabled:bg-neutral-50 disabled:text-neutral-500 disabled:cursor-not-allowed
      transition-colors duration-200
    "
    placeholder="e.g., Metformin 500mg"
  />
  <p className="text-xs text-neutral-500">
    Enter the name exactly as it appears on your prescription
  </p>
</div>
```

#### Email Input
```tsx
<div className="space-y-1">
  <label htmlFor="email" className="block text-sm font-medium text-neutral-700">
    Email Address <span className="text-error-500">*</span>
  </label>
  <input
    type="email"
    id="email"
    required
    className="
      block w-full px-3 py-2
      border border-neutral-300 rounded-md
      focus:ring-2 focus:ring-primary-500 focus:border-transparent
    "
    placeholder="you@example.com"
  />
</div>
```

#### Password Input (with Toggle)
```tsx
import { Eye, EyeOff } from 'lucide-react';

<div className="space-y-1">
  <label htmlFor="password" className="block text-sm font-medium text-neutral-700">
    Password
  </label>
  <div className="relative">
    <input
      type={showPassword ? 'text' : 'password'}
      id="password"
      className="
        block w-full px-3 py-2 pr-10
        border border-neutral-300 rounded-md
        focus:ring-2 focus:ring-primary-500 focus:border-transparent
      "
    />
    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-neutral-600"
      aria-label={showPassword ? 'Hide password' : 'Show password'}
    >
      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
    </button>
  </div>
</div>
```

#### Textarea
```tsx
<div className="space-y-1">
  <label htmlFor="notes" className="block text-sm font-medium text-neutral-700">
    Additional Notes
  </label>
  <textarea
    id="notes"
    rows={4}
    className="
      block w-full px-3 py-2
      border border-neutral-300 rounded-md
      focus:ring-2 focus:ring-primary-500 focus:border-transparent
      resize-none
    "
    placeholder="Any special instructions for the pharmacist..."
  />
</div>
```

#### Input with Error State
```tsx
<div className="space-y-1">
  <label htmlFor="email" className="block text-sm font-medium text-neutral-700">
    Email Address
  </label>
  <input
    type="email"
    id="email"
    className="
      block w-full px-3 py-2
      border-2 border-error-500 rounded-md
      focus:ring-2 focus:ring-error-500 focus:border-error-500
    "
    aria-invalid="true"
    aria-describedby="email-error"
  />
  <p id="email-error" className="text-sm text-error-600 flex items-center gap-1">
    <AlertCircle className="w-4 h-4" />
    Please enter a valid email address
  </p>
</div>
```

#### Input with Success State
```tsx
<div className="space-y-1">
  <label htmlFor="email" className="block text-sm font-medium text-neutral-700">
    Email Address
  </label>
  <input
    type="email"
    id="email"
    value="john@example.com"
    className="
      block w-full px-3 py-2
      border-2 border-success-500 rounded-md
      focus:ring-2 focus:ring-success-500 focus:border-success-500
    "
  />
  <p className="text-sm text-success-600 flex items-center gap-1">
    <CheckCircle className="w-4 h-4" />
    Email is valid
  </p>
</div>
```

#### Search Input
```tsx
import { Search } from 'lucide-react';

<div className="relative">
  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
    <Search className="w-5 h-5 text-neutral-400" />
  </div>
  <input
    type="search"
    placeholder="Search medications..."
    className="
      block w-full pl-10 pr-3 py-2
      border border-neutral-300 rounded-lg
      focus:ring-2 focus:ring-primary-500 focus:border-transparent
    "
  />
</div>
```

#### Select Dropdown
```tsx
<div className="space-y-1">
  <label htmlFor="dosage" className="block text-sm font-medium text-neutral-700">
    Dosage
  </label>
  <select
    id="dosage"
    className="
      block w-full px-3 py-2
      border border-neutral-300 rounded-md
      bg-white
      focus:ring-2 focus:ring-primary-500 focus:border-transparent
      cursor-pointer
    "
  >
    <option value="">Select dosage</option>
    <option value="250mg">250mg</option>
    <option value="500mg">500mg</option>
    <option value="1000mg">1000mg</option>
  </select>
</div>
```

#### Checkbox
```tsx
<div className="flex items-start">
  <div className="flex items-center h-5">
    <input
      id="remember"
      type="checkbox"
      className="
        w-4 h-4
        text-primary-600
        border-neutral-300 rounded
        focus:ring-2 focus:ring-primary-500
      "
    />
  </div>
  <div className="ml-3">
    <label htmlFor="remember" className="text-sm text-neutral-700">
      Remember me for 7 days
    </label>
  </div>
</div>
```

#### Radio Button Group
```tsx
<fieldset className="space-y-3">
  <legend className="text-sm font-medium text-neutral-700 mb-2">
    Delivery Method
  </legend>
  
  <div className="flex items-center">
    <input
      id="delivery"
      type="radio"
      name="method"
      value="delivery"
      className="w-4 h-4 text-primary-600 border-neutral-300 focus:ring-2 focus:ring-primary-500"
    />
    <label htmlFor="delivery" className="ml-3 text-sm text-neutral-700">
      Home Delivery (2-3 days)
    </label>
  </div>
  
  <div className="flex items-center">
    <input
      id="pickup"
      type="radio"
      name="method"
      value="pickup"
      className="w-4 h-4 text-primary-600 border-neutral-300 focus:ring-2 focus:ring-primary-500"
    />
    <label htmlFor="pickup" className="ml-3 text-sm text-neutral-700">
      Pharmacy Pickup (Same day)
    </label>
  </div>
</fieldset>
```

---

### Cards

#### Basic Card
```tsx
<div className="
  bg-white
  border border-neutral-200
  rounded-lg
  shadow-sm
  p-6
  hover:shadow-md
  transition-shadow duration-200
">
  <h3 className="text-lg font-semibold text-neutral-900 mb-2">
    Card Title
  </h3>
  <p className="text-neutral-600 text-sm">
    Card content goes here. This is a basic card component.
  </p>
</div>
```

#### Order Card (with Status Badge)
```tsx
<div className="bg-white border border-neutral-200 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
  <div className="flex items-start justify-between mb-4">
    <div>
      <h3 className="text-lg font-semibold text-neutral-900">
        Order #12345
      </h3>
      <p className="text-sm text-neutral-500 mt-1">
        Placed on Feb 15, 2026
      </p>
    </div>
    <span className="
      px-3 py-1
      bg-success-100 text-success-700
      text-xs font-medium
      rounded-full
    ">
      Delivered
    </span>
  </div>
  
  <div className="space-y-2">
    <div className="flex justify-between text-sm">
      <span className="text-neutral-600">Metformin 500mg</span>
      <span className="font-medium text-neutral-900">90 tablets</span>
    </div>
    <div className="flex justify-between text-sm">
      <span className="text-neutral-600">Total</span>
      <span className="font-semibold text-neutral-900">$13.50</span>
    </div>
  </div>
  
  <div className="mt-4 pt-4 border-t border-neutral-200">
    <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
      Reorder →
    </button>
  </div>
</div>
```

#### Medicine Card (Inventory)
```tsx
<div className="bg-white border border-neutral-200 rounded-lg shadow-sm p-6">
  <div className="flex items-start justify-between mb-3">
    <div>
      <h3 className="text-lg font-semibold text-neutral-900">
        Metformin
      </h3>
      <p className="text-sm text-neutral-500">500mg tablets</p>
    </div>
    <span className="
      px-2 py-1
      bg-success-100 text-success-700
      text-xs font-medium
      rounded
    ">
      In Stock
    </span>
  </div>
  
  <div className="flex items-center justify-between text-sm">
    <span className="text-neutral-600">Stock Level</span>
    <span className="font-semibold text-neutral-900">200 units</span>
  </div>
  
  <div className="flex items-center justify-between text-sm mt-2">
    <span className="text-neutral-600">Price</span>
    <span className="font-semibold text-primary-600">$0.15/tablet</span>
  </div>
</div>
```

#### Interactive Card (Clickable)
```tsx
<button className="
  w-full text-left
  bg-white border border-neutral-200
  rounded-lg shadow-sm
  p-6
  hover:shadow-md hover:border-primary-300
  focus:outline-none focus:ring-2 focus:ring-primary-500
  transition-all duration-200
">
  <h3 className="text-lg font-semibold text-neutral-900 mb-2">
    Refill Reminder
  </h3>
  <p className="text-sm text-neutral-600 mb-3">
    You might be running low on Lisinopril 10mg
  </p>
  <span className="text-sm text-primary-600 font-medium">
    Order now →
  </span>
</button>
```

---

### Modals & Dialogs

#### Basic Modal
```tsx
{isOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    {/* Backdrop */}
    <div 
      className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
      aria-hidden="true"
    />
    
    {/* Modal */}
    <div 
      className="
        relative
        bg-white
        rounded-lg
        shadow-xl
        p-6
        max-w-md w-full
        max-h-[90vh]
        overflow-y-auto
      "
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <h2 id="modal-title" className="text-xl font-semibold text-neutral-900 mb-4">
        Confirm Order
      </h2>
      
      <p className="text-neutral-600 mb-6">
        Are you sure you want to place this order?
      </p>
      
      <div className="flex gap-3 justify-end">
        <button 
          className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 rounded-lg"
          onClick={onClose}
        >
          Cancel
        </button>
        <button 
          className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg"
          onClick={onConfirm}
        >
          Confirm
        </button>
      </div>
    </div>
  </div>
)}
```

#### Modal with Close Button
```tsx
<div className="relative bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
  <button
    onClick={onClose}
    className="
      absolute top-4 right-4
      p-2
      rounded-lg
      text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100
      transition-colors
    "
    aria-label="Close"
  >
    <X className="w-5 h-5" />
  </button>
  
  <h2 className="text-xl font-semibold text-neutral-900 mb-4 pr-8">
    Modal Title
  </h2>
  
  {/* Content */}
</div>
```

#### Prescription Upload Modal
```tsx
<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
  <div className="absolute inset-0 bg-black/50" onClick={onClose} />
  
  <div className="relative bg-white rounded-lg shadow-xl p-6 max-w-lg w-full">
    <h2 className="text-xl font-semibold text-neutral-900 mb-4">
      Upload Prescription
    </h2>
    
    <div className="
      border-2 border-dashed border-neutral-300
      rounded-lg
      p-8
      text-center
      hover:border-primary-400
      transition-colors
      cursor-pointer
    ">
      <Upload className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
      <p className="text-neutral-700 font-medium mb-1">
        Click to upload or drag and drop
      </p>
      <p className="text-sm text-neutral-500">
        PNG, JPG or PDF (max 10MB)
      </p>
    </div>
    
    <div className="mt-6 flex gap-3 justify-end">
      <button className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 rounded-lg">
        Cancel
      </button>
      <button className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg">
        Upload
      </button>
    </div>
  </div>
</div>
```

---

### Alerts & Notifications

#### Success Alert
```tsx
<div className="
  bg-success-50 border-l-4 border-success-500
  rounded-lg p-4
  flex items-start gap-3
">
  <CheckCircle className="w-5 h-5 text-success-600 flex-shrink-0 mt-0.5" />
  <div className="flex-1">
    <h4 className="text-sm font-semibold text-success-900 mb-1">
      Order Placed Successfully
    </h4>
    <p className="text-sm text-success-700">
      Your order #12345 has been confirmed. We'll notify you when it ships.
    </p>
  </div>
</div>
```

#### Warning Alert
```tsx
<div className="
  bg-warning-50 border-l-4 border-warning-500
  rounded-lg p-4
  flex items-start gap-3
">
  <AlertTriangle className="w-5 h-5 text-warning-600 flex-shrink-0 mt-0.5" />
  <div className="flex-1">
    <h4 className="text-sm font-semibold text-warning-900 mb-1">
      Prescription Expiring Soon
    </h4>
    <p className="text-sm text-warning-700">
      Your prescription will expire in 15 days. Please contact your doctor for renewal.
    </p>
  </div>
</div>
```

#### Error Alert
```tsx
<div className="
  bg-error-50 border-l-4 border-error-500
  rounded-lg p-4
  flex items-start gap-3
">
  <XCircle className="w-5 h-5 text-error-600 flex-shrink-0 mt-0.5" />
  <div className="flex-1">
    <h4 className="text-sm font-semibold text-error-900 mb-1">
      Payment Failed
    </h4>
    <p className="text-sm text-error-700">
      Your payment could not be processed. Please update your payment method.
    </p>
  </div>
  <button 
    className="text-error-600 hover:text-error-700 p-1"
    aria-label="Dismiss"
  >
    <X className="w-4 h-4" />
  </button>
</div>
```

#### Info Alert
```tsx
<div className="
  bg-info-50 border-l-4 border-info-500
  rounded-lg p-4
  flex items-start gap-3
">
  <Info className="w-5 h-5 text-info-600 flex-shrink-0 mt-0.5" />
  <div className="flex-1">
    <h4 className="text-sm font-semibold text-info-900 mb-1">
      Prescription Required
    </h4>
    <p className="text-sm text-info-700">
      This medication requires a valid prescription. Please upload it to continue.
    </p>
  </div>
</div>
```

#### Toast Notification (Floating)
```tsx
<div className="
  fixed top-4 right-4 z-50
  bg-white border border-neutral-200
  rounded-lg shadow-lg
  p-4
  flex items-center gap-3
  max-w-sm
  animate-slide-in
">
  <div className="flex-shrink-0 w-10 h-10 bg-success-100 rounded-full flex items-center justify-center">
    <CheckCircle className="w-5 h-5 text-success-600" />
  </div>
  <div className="flex-1 min-w-0">
    <p className="text-sm font-medium text-neutral-900">
      Order confirmed
    </p>
    <p className="text-xs text-neutral-500 mt-0.5">
      Order #12345
    </p>
  </div>
  <button 
    className="flex-shrink-0 text-neutral-400 hover:text-neutral-600"
    aria-label="Close"
  >
    <X className="w-4 h-4" />
  </button>
</div>
```

---

### Badges & Status Indicators

#### Status Badges
```tsx
{/* Success (Delivered, In Stock) */}
<span className="
  inline-flex items-center
  px-2.5 py-0.5
  bg-success-100 text-success-800
  text-xs font-medium
  rounded-full
">
  Delivered
</span>

{/* Warning (Low Stock, Expiring Soon) */}
<span className="
  inline-flex items-center
  px-2.5 py-0.5
  bg-warning-100 text-warning-800
  text-xs font-medium
  rounded-full
">
  Low Stock
</span>

{/* Error (Out of Stock, Rejected) */}
<span className="
  inline-flex items-center
  px-2.5 py-0.5
  bg-error-100 text-error-800
  text-xs font-medium
  rounded-full
">
  Out of Stock
</span>

{/* Info (Pending, Processing) */}
<span className="
  inline-flex items-center
  px-2.5 py-0.5
  bg-info-100 text-info-800
  text-xs font-medium
  rounded-full
">
  Processing
</span>

{/* Neutral (Archived, Inactive) */}
<span className="
  inline-flex items-center
  px-2.5 py-0.5
  bg-neutral-100 text-neutral-800
  text-xs font-medium
  rounded-full
">
  Archived
</span>
```

#### Badge with Dot Indicator
```tsx
<span className="
  inline-flex items-center gap-1.5
  px-2.5 py-0.5
  bg-success-100 text-success-800
  text-xs font-medium
  rounded-full
">
  <span className="w-1.5 h-1.5 bg-success-600 rounded-full" />
  Active
</span>
```

#### Count Badge (Notifications)
```tsx
<button className="relative p-2 rounded-lg hover:bg-neutral-100">
  <Bell className="w-5 h-5 text-neutral-600" />
  <span className="
    absolute -top-1 -right-1
    w-5 h-5
    bg-error-500 text-white
    text-xs font-bold
    rounded-full
    flex items-center justify-center
  ">
    3
  </span>
</button>
```

---

### Loading States

#### Spinner (Inline)
```tsx
<div className="flex items-center justify-center">
  <svg 
    className="animate-spin h-8 w-8 text-primary-500" 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24"
  >
    <circle 
      className="opacity-25" 
      cx="12" 
      cy="12" 
      r="10" 
      stroke="currentColor" 
      strokeWidth="4"
    />
    <path 
      className="opacity-75" 
      fill="currentColor" 
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
</div>
```

#### Skeleton Loader (Card)
```tsx
<div className="bg-white border border-neutral-200 rounded-lg shadow-sm p-6 animate-pulse">
  <div className="h-4 bg-neutral-200 rounded w-3/4 mb-4" />
  <div className="space-y-3">
    <div className="h-3 bg-neutral-200 rounded" />
    <div className="h-3 bg-neutral-200 rounded w-5/6" />
  </div>
  <div className="mt-4 h-8 bg-neutral-200 rounded w-24" />
</div>
```

#### Skeleton Loader (List)
```tsx
<div className="space-y-4">
  {[1, 2, 3].map((i) => (
    <div key={i} className="flex items-center gap-4 animate-pulse">
      <div className="w-12 h-12 bg-neutral-200 rounded-full" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-neutral-200 rounded w-1/2" />
        <div className="h-3 bg-neutral-200 rounded w-3/4" />
      </div>
    </div>
  ))}
</div>
```

#### Progress Bar
```tsx
<div className="w-full bg-neutral-200 rounded-full h-2">
  <div 
    className="bg-primary-500 h-2 rounded-full transition-all duration-300"
    style={{ width: `${progress}%` }}
  />
</div>
```

#### Progress Bar with Label
```tsx
<div className="space-y-2">
  <div className="flex justify-between text-sm text-neutral-600">
    <span>Uploading prescription...</span>
    <span>{progress}%</span>
  </div>
  <div className="w-full bg-neutral-200 rounded-full h-2">
    <div 
      className="bg-primary-500 h-2 rounded-full transition-all duration-300"
      style={{ width: `${progress}%` }}
    />
  </div>
</div>
```

---

### Empty States

#### Generic Empty State
```tsx
<div className="text-center py-12 px-4">
  <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
    <Inbox className="w-8 h-8 text-neutral-400" />
  </div>
  <h3 className="text-lg font-semibold text-neutral-900 mb-2">
    No orders yet
  </h3>
  <p className="text-neutral-600 mb-6 max-w-sm mx-auto">
    When you place an order, it will appear here. Get started by ordering your first medication.
  </p>
  <button className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium">
    Place Your First Order
  </button>
</div>
```

#### Search Results Empty State
```tsx
<div className="text-center py-12 px-4">
  <SearchX className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
  <h3 className="text-lg font-semibold text-neutral-900 mb-2">
    No results found
  </h3>
  <p className="text-neutral-600 mb-4">
    We couldn't find any medications matching "{searchQuery}"
  </p>
  <p className="text-sm text-neutral-500">
    Try searching with a different name or dosage
  </p>
</div>
```

#### Error Empty State
```tsx
<div className="text-center py-12 px-4">
  <div className="w-16 h-16 bg-error-50 rounded-full flex items-center justify-center mx-auto mb-4">
    <AlertCircle className="w-8 h-8 text-error-500" />
  </div>
  <h3 className="text-lg font-semibold text-neutral-900 mb-2">
    Failed to load orders
  </h3>
  <p className="text-neutral-600 mb-6">
    We couldn't load your orders. Please try again.
  </p>
  <button className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 rounded-lg font-medium">
    Try Again
  </button>
</div>
```

---

## 5. Navigation Components

### Header / Navbar

#### Patient Header
```tsx
<header className="bg-white border-b border-neutral-200 sticky top-0 z-40">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex items-center justify-between h-16">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <Pill className="w-6 h-6 text-primary-500" />
        <span className="text-xl font-bold text-neutral-900">
          Pharmacy Assistant
        </span>
      </div>
      
      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center gap-6">
        <a href="/dashboard" className="text-neutral-700 hover:text-primary-600 font-medium">
          Dashboard
        </a>
        <a href="/orders" className="text-neutral-700 hover:text-primary-600 font-medium">
          Orders
        </a>
        <a href="/prescriptions" className="text-neutral-700 hover:text-primary-600 font-medium">
          Prescriptions
        </a>
      </nav>
      
      {/* Actions */}
      <div className="flex items-center gap-3">
        <button className="relative p-2 rounded-lg hover:bg-neutral-100">
          <Bell className="w-5 h-5 text-neutral-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-error-500 rounded-full" />
        </button>
        
        <button className="flex items-center gap-2 p-2 rounded-lg hover:bg-neutral-100">
          <div className="w-8 h-8 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center font-semibold text-sm">
            SJ
          </div>
        </button>
      </div>
    </div>
  </div>
</header>
```

#### Admin Sidebar
```tsx
<aside className="w-64 bg-white border-r border-neutral-200 h-screen overflow-y-auto">
  <div className="p-6">
    <div className="flex items-center gap-2 mb-8">
      <Pill className="w-6 h-6 text-primary-500" />
      <span className="text-xl font-bold text-neutral-900">
        Admin
      </span>
    </div>
    
    <nav className="space-y-1">
      <a href="/staff/dashboard" className="
        flex items-center gap-3 px-3 py-2
        bg-primary-50 text-primary-700
        rounded-lg font-medium
      ">
        <LayoutDashboard className="w-5 h-5" />
        Dashboard
      </a>
      
      <a href="/staff/orders" className="
        flex items-center gap-3 px-3 py-2
        text-neutral-700 hover:bg-neutral-50
        rounded-lg
      ">
        <Package className="w-5 h-5" />
        Orders
        <span className="ml-auto px-2 py-0.5 bg-error-100 text-error-700 text-xs font-medium rounded-full">
          5
        </span>
      </a>
      
      <a href="/staff/inventory" className="
        flex items-center gap-3 px-3 py-2
        text-neutral-700 hover:bg-neutral-50
        rounded-lg
      ">
        <Pill className="w-5 h-5" />
        Inventory
      </a>
      
      <a href="/staff/alerts" className="
        flex items-center gap-3 px-3 py-2
        text-neutral-700 hover:bg-neutral-50
        rounded-lg
      ">
        <Bell className="w-5 h-5" />
        Refill Alerts
      </a>
    </nav>
  </div>
</aside>
```

---

## 6. Chat Components

### Chat Message Bubble (User)
```tsx
<div className="flex justify-end">
  <div className="
    max-w-[80%] lg:max-w-[60%]
    bg-primary-500 text-white
    rounded-2xl rounded-tr-md
    px-4 py-2.5
    shadow-sm
  ">
    <p className="text-sm leading-relaxed">
      I need to refill my Metformin 500mg
    </p>
    <span className="text-xs text-primary-100 mt-1 block">
      2:34 PM
    </span>
  </div>
</div>
```

### Chat Message Bubble (AI)
```tsx
<div className="flex justify-start">
  <div className="
    max-w-[80%] lg:max-w-[60%]
    bg-white border border-neutral-200
    rounded-2xl rounded-tl-md
    px-4 py-2.5
    shadow-sm
  ">
    <p className="text-sm leading-relaxed text-neutral-900">
      Great! I found Metformin 500mg tablets. We have them in stock. How many tablets would you like to order?
    </p>
    <span className="text-xs text-neutral-500 mt-1 block">
      2:34 PM
    </span>
  </div>
</div>
```

### Chat Input
```tsx
<div className="border-t border-neutral-200 bg-white p-4">
  <div className="max-w-4xl mx-auto flex items-end gap-3">
    <div className="flex-1 relative">
      <textarea
        rows={1}
        placeholder="Type your message..."
        className="
          w-full
          resize-none
          px-4 py-3
          border border-neutral-300 rounded-lg
          focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
          max-h-32
        "
      />
    </div>
    
    <button className="
      p-3
      bg-primary-500 hover:bg-primary-600
      text-white
      rounded-lg
      transition-colors
      disabled:opacity-50 disabled:cursor-not-allowed
    ">
      <Send className="w-5 h-5" />
    </button>
  </div>
</div>
```

---

## 7. Accessibility Guidelines

### WCAG 2.1 Level AA Requirements

#### Color Contrast Ratios
- **Normal text** (16px): Minimum 4.5:1
  - ✅ `text-neutral-600` on `bg-neutral-50`: 6.3:1
  - ✅ `text-neutral-900` on `bg-white`: 16.3:1
- **Large text** (18px+ or 14px+ bold): Minimum 3:1
  - ✅ All heading combinations meet this
- **UI components** (buttons, inputs): Minimum 3:1
  - ✅ `border-neutral-300` on `bg-white`: 3.7:1

#### Keyboard Navigation
- **All interactive elements** must be keyboard accessible
- **Tab order** must be logical (left-to-right, top-to-bottom)
- **Focus indicators** must be visible (2px ring, high contrast)
- **Skip to content** link for screen readers

```tsx
/* Focus ring standard */
.focus-visible:focus {
  @apply outline-none ring-2 ring-primary-500 ring-offset-2;
}
```

#### Screen Reader Support
- **Semantic HTML**: Use `<button>`, `<nav>`, `<main>`, `<header>`, not `<div onClick>`
- **Alt text** for all images
- **aria-label** for icon-only buttons
- **aria-describedby** for form errors
- **aria-live** regions for dynamic content (toasts, chat messages)

```tsx
/* Icon button with aria-label */
<button aria-label="Close modal">
  <X className="w-5 h-5" />
</button>

/* Form error with aria-describedby */
<input aria-invalid="true" aria-describedby="email-error" />
<p id="email-error">Invalid email</p>
```

#### Form Accessibility
- **Labels** associated with inputs (`htmlFor` / `id`)
- **Required fields** marked with `*` and `aria-required="true"`
- **Error messages** announced to screen readers
- **Fieldsets** for grouped inputs (radio buttons)

```tsx
<label htmlFor="email" className="block text-sm font-medium">
  Email <span className="text-error-500">*</span>
</label>
<input 
  id="email" 
  type="email" 
  required 
  aria-required="true"
/>
```

#### Touch Targets (Mobile)
- **Minimum size**: 48x48 pixels (WCAG AAA: 44x44 pixels)
- **Spacing**: 8px minimum between touch targets
- **Primary actions**: 56px+ height recommended

```tsx
/* Mobile-friendly button */
<button className="px-6 py-3 min-h-[48px] touch-manipulation">
  Place Order
</button>
```

---

## 8. Animation Guidelines

### Transition Defaults
```css
/* Standard transition for interactive elements */
.transition-standard {
  transition-property: background-color, border-color, color, box-shadow;
  transition-duration: 200ms;
  transition-timing-function: ease-in-out;
}

/* Tailwind shorthand */
<button className="transition-colors duration-200">

/* Transform transitions (for movement) */
<div className="transition-transform duration-300 ease-out">
```

### Animation Rules

#### 1. Performance: Only Animate Transform & Opacity
- ✅ `transform`, `opacity` (GPU-accelerated)
- ❌ `width`, `height`, `left`, `top` (reflow/repaint)

```tsx
/* Good: Transform animation */
<div className="transition-transform hover:scale-105">

/* Bad: Width animation */
<div className="transition-all hover:w-full"> ❌
```

#### 2. Duration Guidelines
- **Micro-interactions**: 100-200ms (hover, focus)
- **UI transitions**: 200-300ms (modals, dropdowns)
- **Page transitions**: 300-400ms (route changes)
- **Never exceed**: 500ms (feels slow)

#### 3. Easing Functions
- **ease-in-out**: Default (smooth start & end)
- **ease-out**: Entering animations (modals sliding in)
- **ease-in**: Exiting animations (modals sliding out)
- **linear**: Progress bars, loading spinners

#### 4. Respect prefers-reduced-motion
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Common Animations

#### Fade In
```tsx
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

<div className="animate-fade-in">
  /* Duration: 200ms */
</div>
```

#### Slide In (from bottom)
```tsx
@keyframes slideInFromBottom {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

<div className="animate-slide-in">
  /* Duration: 300ms */
</div>
```

#### Pulse (for loading states)
```tsx
/* Tailwind built-in */
<div className="animate-pulse">
  <div className="h-4 bg-neutral-200 rounded w-3/4" />
</div>
```

#### Spin (for loading spinners)
```tsx
/* Tailwind built-in */
<svg className="animate-spin h-5 w-5">
  {/* Spinner SVG */}
</svg>
```

---

## 9. Icon System

### Icon Library: Lucide React
- **Version**: 0.323.0
- **Documentation**: https://lucide.dev
- **License**: ISC
- **Total Icons**: 1000+

### Icon Sizes
```tsx
/* Small (16px) - Inline with text */
<Icon className="w-4 h-4" />

/* Base (20px) - Default for UI */
<Icon className="w-5 h-5" />

/* Large (24px) - Headings, emphasis */
<Icon className="w-6 h-6" />

/* Extra Large (32px) - Empty states */
<Icon className="w-8 h-8" />
```

### Stroke Width
```tsx
/* Default: 2px (recommended) */
<Icon className="w-5 h-5" strokeWidth={2} />

/* Thin: 1.5px (delicate) */
<Icon className="w-5 h-5" strokeWidth={1.5} />

/* Bold: 2.5px (emphasis) */
<Icon className="w-5 h-5" strokeWidth={2.5} />
```

### Common Icons
```tsx
import {
  // Actions
  Send, Check, X, Plus, Minus, Edit, Trash2, Download, Upload, Search,
  
  // Navigation
  ChevronLeft, ChevronRight, ChevronDown, Menu, Home, ArrowLeft,
  
  // Pharmacy Specific
  Pill, Package, FileText, Calendar, Clock, Bell, AlertCircle,
  
  // User
  User, Users, Settings, LogOut, Mail, Phone,
  
  // Status
  CheckCircle, XCircle, AlertTriangle, Info, Loader
} from 'lucide-react';
```

### Usage Examples
```tsx
/* Icon in button */
<button className="flex items-center gap-2">
  <Send className="w-4 h-4" />
  Send Message
</button>

/* Icon with color */
<CheckCircle className="w-5 h-5 text-success-600" />

/* Icon-only button (requires aria-label) */
<button aria-label="Close">
  <X className="w-5 h-5" />
</button>

/* Icon in alert */
<div className="flex items-start gap-3">
  <AlertCircle className="w-5 h-5 text-error-600 flex-shrink-0" />
  <p>Error message</p>
</div>
```

---

## 10. Responsive Design

### Mobile-First Approach
```tsx
/* Start with mobile styles, add larger breakpoints */
<div className="
  text-base          /* Mobile: 16px */
  sm:text-lg         /* Tablet: 18px */
  lg:text-xl         /* Desktop: 20px */
  
  p-4                /* Mobile: 16px padding */
  sm:p-6             /* Tablet: 24px padding */
  lg:p-8             /* Desktop: 32px padding */
">
  Responsive content
</div>
```

### Breakpoint Strategy
- **Default (0-639px)**: Mobile portrait
- **sm (640px+)**: Mobile landscape, small tablets
- **md (768px+)**: Tablets
- **lg (1024px+)**: Desktops
- **xl (1280px+)**: Large desktops
- **2xl (1536px+)**: Ultra-wide screens

### Responsive Patterns

#### Hide/Show Elements
```tsx
/* Hide on mobile, show on desktop */
<div className="hidden lg:block">
  Desktop only content
</div>

/* Show on mobile, hide on desktop */
<div className="block lg:hidden">
  Mobile only content
</div>
```

#### Responsive Grid
```tsx
<div className="
  grid
  grid-cols-1        /* Mobile: 1 column */
  sm:grid-cols-2     /* Tablet: 2 columns */
  lg:grid-cols-3     /* Desktop: 3 columns */
  gap-4 sm:gap-6
">
  {items.map(item => <Card key={item.id} />)}
</div>
```

#### Responsive Flexbox
```tsx
/* Stack on mobile, row on desktop */
<div className="flex flex-col lg:flex-row gap-6">
  <div className="lg:w-1/3">Sidebar</div>
  <div className="lg:w-2/3">Main content</div>
</div>
```

#### Responsive Typography
```tsx
<h1 className="
  text-2xl sm:text-3xl lg:text-4xl
  font-bold
  leading-tight
">
  Responsive Heading
</h1>
```

### Touch Targets (Mobile)
```tsx
/* Ensure minimum 48x48px touch target */
<button className="
  px-4 py-3         /* 16px + 12px = 28px height minimum */
  min-h-[48px]      /* Enforce 48px minimum */
  touch-manipulation /* Disable double-tap zoom */
">
  Tap Me
</button>
```

---

## 11. Performance Guidelines

### Image Optimization

#### Use Next.js Image Component
```tsx
import Image from 'next/image';

<Image
  src="/prescription.jpg"
  alt="Prescription for Metformin"
  width={800}
  height={600}
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
  priority={false} // Only true for above-fold images
/>
```

**Benefits:**
- Automatic WebP conversion
- Lazy loading (except `priority={true}`)
- Responsive srcset generation
- No layout shift (width/height provided)

#### Optimize Prescription Images
- **Format**: Upload as JPEG/PNG, serve as WebP
- **Size**: Max 10MB upload, resize to 1200px width server-side
- **Thumbnails**: Generate 300px thumbnails for lists
- **CDN**: Serve via CloudFront for fast delivery

### Code Splitting

#### Lazy Load Heavy Components
```tsx
import dynamic from 'next/dynamic';

// Load admin dashboard only when needed
const AdminDashboard = dynamic(() => import('./AdminDashboard'), {
  loading: () => <SkeletonDashboard />,
  ssr: false, // Disable SSR if not needed
});
```

#### Route-Based Splitting
```tsx
// Next.js automatically code-splits by route
/app
  /dashboard/page.tsx    // Separate bundle
  /orders/page.tsx       // Separate bundle
  /admin/page.tsx        // Separate bundle
```

### Critical CSS
- **Inline critical CSS** for above-fold content
- **Defer non-critical CSS** (fonts, animations)
- **Purge unused CSS** (Tailwind production build)

### Bundle Size Targets
- **Initial JS bundle**: <200KB (gzipped)
- **Total page size**: <1MB (including images)
- **Lighthouse Performance Score**: 90+

---

## 12. Browser Support

### Supported Browsers
- **Chrome**: Last 2 versions (February 2025+)
- **Firefox**: Last 2 versions (February 2025+)
- **Safari**: Last 2 versions (iOS 16+, macOS 13+)
- **Edge**: Last 2 versions (Chromium-based)
- **Mobile**: iOS Safari 16+, Chrome Android 110+

### Progressive Enhancement
- **Core functionality** works without JavaScript (forms submit, links work)
- **Enhanced features** for modern browsers (animations, real-time updates)
- **Graceful degradation** for older browsers (fallback fonts, polyfills)

### Polyfills (if needed)
```json
// package.json
{
  "browserslist": [
    "defaults",
    "not IE 11"
  ]
}
```

---

## 13. Dark Mode (Future Enhancement)

### Design Tokens for Dark Mode
```css
/* Light mode (default) */
:root {
  --color-bg: #ffffff;
  --color-text: #111827;
  --color-border: #e5e7eb;
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
  :root {
    --color-bg: #111827;
    --color-text: #f9fafb;
    --color-border: #374151;
  }
}
```

### Tailwind Dark Mode
```tsx
/* Add dark: prefix for dark mode styles */
<div className="
  bg-white dark:bg-neutral-900
  text-neutral-900 dark:text-neutral-50
  border border-neutral-200 dark:border-neutral-700
">
  Dark mode ready
</div>
```

---

## 14. Design System Maintenance

### Version Control
- **Figma Library**: Single source of truth for design
- **Storybook**: Component documentation and testing
- **Git**: Version control for code components

### Component Updates
1. Design change in Figma
2. Update component in codebase
3. Update Storybook documentation
4. Notify team of breaking changes
5. Update this design system doc

### Design Tokens Updates
- Use CSS variables for easy theme switching
- Document all token changes in CHANGELOG
- Provide migration guide for breaking changes

---

## 15. Accessibility Checklist

### Before Shipping a Feature
- [ ] All interactive elements keyboard accessible
- [ ] Focus indicators visible (2px ring)
- [ ] Color contrast meets WCAG AA (4.5:1)
- [ ] All images have alt text
- [ ] Forms have associated labels
- [ ] Buttons have descriptive text or aria-label
- [ ] Modals trap focus and can be closed with Escape
- [ ] Dynamic content announced to screen readers (aria-live)
- [ ] Tested with keyboard only (no mouse)
- [ ] Tested with screen reader (NVDA or VoiceOver)
- [ ] Tested with browser zoom at 200%
- [ ] Touch targets minimum 48x48px

---

## 16. Component Checklist

### Before Shipping a Component
- [ ] All states implemented (default, hover, focus, active, disabled, loading, error)
- [ ] Responsive (mobile, tablet, desktop)
- [ ] Accessible (keyboard, screen reader, focus)
- [ ] Performance optimized (animations use transform/opacity)
- [ ] TypeScript types defined
- [ ] Props documented
- [ ] Storybook story created
- [ ] Unit tests written
- [ ] Tested in all supported browsers

---

**Design System Version**: 1.0  
**Last Updated**: February 15, 2026  
**Next Review**: May 15, 2026 (quarterly)  
**Maintained By**: Design & Engineering Team  
**Contact**: design@pharmacyassistant.com

---

**End of Frontend Design System Documentation**
