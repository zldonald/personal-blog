# VC Pitch Website - Design System

## Project Overview

A Notion-style directory website to showcase ideas to VC investors. Clean, minimal, professional aesthetic with warm pastel colors and excellent typography.

## Design Tokens

### Color Palette

```
Background:
- primary:     #FAF8F5  (warm cream)
- secondary:   #F5F2ED  (slightly darker cream for cards)
- tertiary:    #EDEAE4  (borders, dividers)

Text:
- heading:     #5B8A72  (pastel sage green - h1 only)
- body:        #3D3D3D  (warm charcoal)
- muted:       #7A7A7A  (secondary text)
- link:        #5B8A72  (matches heading green)
- link-hover:  #4A7360  (darker green on hover)

Accents:
- accent-warm:   #E8C4A0  (warm peach for highlights)
- accent-sage:   #A8C5B5  (light sage for tags/pills)
- accent-rose:   #E5C1C1  (dusty rose for secondary accents)

Graph/Visualization:
- node-primary:   #5B8A72  (sage green)
- node-secondary: #A8C5B5  (light sage)
- edge:           #D4CFC7  (warm gray)
- edge-active:    #5B8A72  (sage green)
```

### Typography

```
Headings (h1):
- Font: 'Source Serif 4', Georgia, serif
- Weight: 600
- Color: #5B8A72 (pastel sage green)
- Letter-spacing: -0.02em

Headings (h2-h6):
- Font: 'Source Serif 4', Georgia, serif
- Weight: 500
- Color: #3D3D3D (warm charcoal)

Body:
- Font: 'JetBrains Mono', 'SF Mono', monospace
- Weight: 400
- Size: 15px / 0.9375rem
- Line-height: 1.7
- Color: #3D3D3D

Code/Inline Code:
- Font: 'JetBrains Mono', monospace
- Background: #F5F2ED
- Border: 1px solid #EDEAE4
```

### Spacing Scale

```
--space-xs:  0.25rem   (4px)
--space-sm:  0.5rem    (8px)
--space-md:  1rem      (16px)
--space-lg:  1.5rem    (24px)
--space-xl:  2rem      (32px)
--space-2xl: 3rem      (48px)
--space-3xl: 4rem      (64px)
```

### Layout

```
Max content width: 680px (readable line length)
Page max width: 1200px
Card padding: 1.5rem
Border radius: 8px (cards), 4px (buttons/pills)
```

## Component Guidelines

### Page Cards (Home)
- Light shadow on hover
- Icon + title layout
- Subtle border
- Cream background (#F5F2ED)

### MDX Page Layout
- Centered content, max-width 680px
- Generous vertical spacing between sections
- Breadcrumb navigation back to home

### Backlinks (Obsidian-style)
- Inline links styled as subtle underlined text
- Color: sage green (#5B8A72)
- On hover: darker green with subtle background highlight
- Format: `[[Page Name]]` in MDX, rendered as internal links

### Graph Visualization
- Clean node-edge style
- Nodes: filled circles with sage green
- Edges: thin warm gray lines
- Hover states highlight connected nodes
- Use `react-force-graph-2d` for implementation

## File Structure

```
app/
├── layout.tsx          # Root layout with fonts
├── page.tsx            # Home page with page cards
├── globals.css         # Global styles + CSS variables
├── [slug]/
│   └── page.tsx        # Dynamic MDX page renderer
├── components/
│   ├── PageCard.tsx    # Home page link cards
│   ├── MDXComponents.tsx # Custom MDX component overrides
│   ├── Backlink.tsx    # Internal link component
│   ├── PageHeader.tsx  # Page title + back nav
│   └── GraphView.tsx   # Optional graph visualization
├── lib/
│   ├── mdx.ts          # MDX utilities
│   └── pages.ts        # Page metadata/registry
└── content/
    ├── manifesto.mdx
    ├── funding-views.mdx
    ├── us-plan.mdx
    ├── company-plan.mdx
    ├── work-to-date.mdx
    └── market-competition.mdx
```

## Page Registry

Each page needs:
- `slug`: URL path
- `title`: Display name
- `icon`: Emoji or icon
- `description`: Brief summary (for cards)

```typescript
const pages = [
  { slug: 'manifesto', title: 'Manifesto', icon: '📜', description: 'Why taste and human writing matter' },
  { slug: 'funding-views', title: 'Funding Views', icon: '💰', description: 'The route to US funding' },
  { slug: 'us-plan', title: 'US Plan', icon: '🇺🇸', description: 'Market entry strategy' },
  { slug: 'company-plan', title: 'Company Plan', icon: '🏢', description: 'Building the organization' },
  { slug: 'work-to-date', title: 'Work to Date', icon: '⚡', description: 'Progress and milestones' },
  { slug: 'market-competition', title: 'Market & Competition', icon: '📊', description: 'Landscape analysis' },
];
```

## MDX Conventions

### Backlinks
Use double-bracket syntax in MDX content:
```mdx
As discussed in [[Manifesto]], our approach differs from...
```

### Callouts/Highlights
```mdx
<Callout type="insight">
Key insight text here
</Callout>
```

### Section Dividers
Use `---` for thematic breaks between major sections.

## Implementation Notes

1. **Fonts**: Load from Google Fonts (Source Serif 4 + JetBrains Mono)
2. **MDX**: Use `next-mdx-remote` for content loading
3. **Graphs**: Optional - implement with `react-force-graph-2d`
4. **No dark mode**: Keep it simple, warm light theme only
5. **Mobile**: Responsive, same aesthetic scales down cleanly
