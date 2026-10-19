---
name: EventSphere AI
colors:
  surface: '#fbf9f5'
  surface-dim: '#dbdad6'
  surface-bright: '#fbf9f5'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f3ef'
  surface-container: '#efeeea'
  surface-container-high: '#eae8e4'
  surface-container-highest: '#e4e2de'
  on-surface: '#1b1c1a'
  on-surface-variant: '#56423c'
  inverse-surface: '#30312e'
  inverse-on-surface: '#f2f0ed'
  outline: '#8a726a'
  outline-variant: '#ddc0b7'
  surface-tint: '#a0401c'
  primary: '#9d3e1a'
  on-primary: '#ffffff'
  primary-container: '#bd5630'
  on-primary-container: '#fffbff'
  inverse-primary: '#ffb59c'
  secondary: '#695c4e'
  on-secondary: '#ffffff'
  secondary-container: '#f1e0cd'
  on-secondary-container: '#6f6254'
  tertiary: '#5e5b5a'
  on-tertiary: '#ffffff'
  tertiary-container: '#777472'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdbcf'
  primary-fixed-dim: '#ffb59c'
  on-primary-fixed: '#390c00'
  on-primary-fixed-variant: '#802a05'
  secondary-fixed: '#f1e0cd'
  secondary-fixed-dim: '#d4c4b2'
  on-secondary-fixed: '#231a0f'
  on-secondary-fixed-variant: '#504538'
  tertiary-fixed: '#e7e1df'
  tertiary-fixed-dim: '#cac5c4'
  on-tertiary-fixed: '#1d1b1a'
  on-tertiary-fixed-variant: '#494645'
  background: '#fbf9f5'
  on-background: '#1b1c1a'
  surface-variant: '#e4e2de'
typography:
  display-lg:
    fontFamily: Playfair Display
    fontSize: 48px
    fontWeight: '600'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 36px
    fontWeight: '600'
    lineHeight: 44px
    letterSpacing: -0.01em
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-xl-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 26px
    fontWeight: '600'
    lineHeight: 32px
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '500'
    lineHeight: 28px
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '500'
    lineHeight: 24px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.03em
  tabular-data:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  margin: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system establishes a sophisticated equilibrium between warm editorial elegance and rigorous high-productivity SaaS performance. The atmosphere evokes tactile luxury—combining a warm linen canvas, pure white card surfaces, and artisanal terracotta accents with the crisp precision required for complex event logistics. 

### Brand Personality
- **Editorial & Refined:** Embraces generous proportions, asymmetric typographic contrast, and intentional white space to reduce cognitive fatigue.
- **Warm & Approachable:** Displaces cold enterprise tooling with inviting organic tones, tactile surfaces, and humanist typography.
- **Productivity-First:** Maintains uncompromised functional clarity, instant feedback loops, and robust density controls for power users managing high-stakes schedules.

### Visual Style
A refined hybrid of **Minimalism** and **Tactile Elevation**, characterized by restrained color applications, delicate multi-layer ambient shadows, and strict typographic hierarchy.

## Colors

The palette is anchored by a warm linen background (`#FDFBF7`), establishing an organic, paper-like canvas that softens prolonged screen time. Pure white (`#FFFFFF`) is reserved exclusively for floating card surfaces and interactive containers to create subtle tonal separation.

### Palette Architecture
- **Primary (Terracotta `#D96B43`):** Drives primary actions, active states, and critical focal points, lending a grounded, earthy warmth.
- **Secondary (Soft Champagne `#E6D5C3`):** Used for subtle borders, active selection states, and delicate tonal fills.
- **Tertiary (Charcoal `#2C2A29`):** Provides deep, high-contrast anchors for primary text and structural UI elements.
- **Neutral Surface (`#FDFBF7`):** The foundational canvas color for all application views.

## Typography

Typography bridges editorial storytelling and high-density productivity. **Plus Jakarta Sans** provides welcoming, contemporary structure for interface headers, while **Playfair Display** introduces expressive serif moments for high-impact editorial accents and hero titles. 

**Inter** powers all body copy and tabular data. To support the demanding scheduling needs of event management, all numerical data views, timestamps, and financial figures must enforce strict tabular figures (`tnum`) to guarantee vertical alignment across lists, tables, and calendars.

## Layout & Spacing

The layout relies on a **Fluid grid** model engineered for information density without feeling cramped. It utilizes a 12-column structure with 24px gutters and generous outer canvas margins that scale gracefully down to 16px on mobile viewports.

### Rhythm & Scale
Spacing follows a predictable 4px/8px baseline rhythm. Components utilize `space-sm` (8px) and `space-md` (16px) for internal padding, allowing dense data tables and timeline viewports to coexist harmoniously with spacious editorial headers (`space-xl`).

## Elevation & Depth

Depth is conveyed through **delicate multi-layer shadows** combined with crisp, low-contrast surface differentiation. Rather than relying on stark borders, cards float above the warm linen canvas using diffuse, warm-tinted ambient shadows.

### Shadow Character
- **Resting state:** A subtle two-tier shadow combining a tight 1px occlusion blur with a soft 12px ambient drop shadow tinted with warm champagne undertones (`rgba(44, 42, 41, 0.04)` and `rgba(44, 42, 41, 0.06)`).
- **Interactive state:** Elevation scales smoothly on hover, increasing the ambient blur radius while subtly shifting upward to invite action.

## Shapes

A **Rounded** shape language (`rounded` token level, featuring 0.5rem base radius and 1rem to 1.5rem radii for larger containers) softens the interface. This curvature pairs with the organic warmth of the linen background, ensuring that even dense analytical dashboards feel approachable and curated rather than clinical.

## Components

All components must inherit the warm editorial personality while maintaining strict ergonomic utility for high-productivity workflows.

### Buttons
- **Primary:** Terracotta solid fill (`#D96B43`) with white text, medium weight, and soft rounded corners. Hover states introduce a subtle darkening of the terracotta hue and a lifted ambient shadow.
- **Secondary:** Transparent fill with a soft champagne border and charcoal text.
- **Ghost:** Minimalist text buttons with generous hit targets for subtle navigational actions.

### Cards
- Pure white (`#FFFFFF`) surfaces resting on the linen background. Features multi-layer ambient shadows, generous internal padding (`space-lg`), and subtle internal dividers using the soft champagne tone.

### Input Fields & Controls
- Clean white inputs set against the linen canvas, anchored by a delicate champagne border that transitions to terracotta upon focus. Checkboxes and radio buttons feature precise alignment with explicit tabular label pairings.

### Chips & Tags
- Pill-shaped status indicators utilizing soft tonal fills derived from the secondary and tertiary palettes, optimized for scanning event categories, attendee statuses, and timeline tags.

### Additional Recommendations
- **Timeline & Calendar Grid:** High-density views featuring sticky headers, strict tabular figures for time markers, and drag-and-drop affordances.
- **AI Assistant Drawer:** A floating slide-over panel utilizing glassmorphism and warm tones to deliver contextual event recommendations and automated scheduling summaries.