# Copilot Instructions - Mongolian Passport Travel Map

## Project Overview

This is an interactive world map showing visa-free travel destinations for Mongolian passport holders. The app displays countries color-coded by passport type requirements.

## Tech Stack

- **Framework**: Next.js 16+ with App Router and Turbopack
- **React**: Version 19
- **Styling**: Tailwind CSS 4 with glassmorphism design
- **Map**: d3-geo (geoMercator projection) + topojson-client
- **Data Source**: World Atlas TopoJSON from CDN + local JSON files

## Project Structure

```
src/
├── app/              # Next.js App Router pages
│   ├── page.tsx      # Main page with map layout
│   ├── layout.tsx    # Root layout
│   └── globals.css   # Global styles with CSS variables
├── components/       # React components
│   ├── WorldMapSVG.tsx    # Main map component with d3-geo
│   ├── Header.tsx         # App header with controls
│   ├── Footer.tsx         # App footer
│   ├── SearchBar.tsx      # Country search autocomplete
│   ├── Legend.tsx         # Map legend
│   └── CountrySidebar.tsx # Country details sidebar
├── data/             # Visa data JSON files
│   ├── passport.json      # Visa-free for ordinary passports (green)
│   ├── diplomat.json      # Visa-free for diplomatic passports (blue)
│   └── special.json       # Special arrangements (yellow)
├── lib/              # Utility functions
│   └── visaData.ts        # Data loading and processing
└── types/            # TypeScript type definitions
    └── index.ts
```

## Color Coding

- 🔵 **Blue** (`#2563eb`): Diplomatic/Official passport visa-free
- 🟢 **Green** (`#16a34a`): Ordinary passport visa-free
- 🟡 **Yellow** (`#eab308`): Special arrangements (visa on arrival, eTA, etc.)
- ⚪ **Grey** (`#475569`): Visa required / No data
- 🔴 **Red** (`#c4272f`): Mongolia (Home country)

## Key Implementation Details

### Map Component (WorldMapSVG.tsx)

- Uses `geoMercator()` projection from d3-geo
- Fetches TopoJSON from `https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json`
- Country IDs are ISO numeric codes (with leading zeros like "032" for Argentina)
- `getIso2()` function normalizes IDs by removing leading zeros before lookup
- Supports pan, zoom (scroll wheel), and click-to-zoom on countries
- Click on empty area resets map and closes sidebar

### Data Loading (visaData.ts)

- Data stored by ISO3 code in Map
- Priority: Normal passport > Diplomat > Special (first match wins)
- `iso2ToData` map created for quick lookups in map component

### Bilingual Support

- Two languages: English (`en`) and Mongolian (`mn`)
- Default language is Mongolian
- All labels have both `name_en` and `name_mn` variants

### Dark/Light Mode

- Toggle in header
- CSS variables in globals.css for theming
- `html.dark` class controls theme

## Common Tasks

### Adding a New Country

1. Add entry to appropriate JSON file in `src/data/`
2. Include: `country_code` (ISO2), `country_name_en`, `country_name_mn`, `visa_free_duration`, `effective_date`, `passport_type`

### Modifying Map Colors

- Category colors defined in `src/lib/visaData.ts` (`categoryColors` object)
- Mongolia color set directly in WorldMapSVG.tsx

### Fixing Country Mapping Issues

- Check `isoNumericToIso2` mapping in WorldMapSVG.tsx
- Verify country numeric ID in world-atlas TopoJSON data
- Remember: IDs may have leading zeros (e.g., "032" not "32")

## Code Style

- Use TypeScript with strict types
- Prefer `useCallback` and `useMemo` for performance
- Use Tailwind CSS classes, avoid inline styles except for dynamic values
- Keep components focused and single-responsibility
- Use CSS variables for theme-dependent values

## Testing Locally

```bash
npm install
npm run dev
# Open http://localhost:3000
```

## Notes

- World Atlas TopoJSON is fetched from CDN at runtime
- Map uses passive: false for wheel events to enable zoom
- Sidebar closes when clicking outside or pressing close button
