# Founder Archetype Frame

A Farcaster Frame that analyzes a user's Farcaster activity to determine their founder archetype using AI. The app provides personalized insights and recommendations based on their communication patterns and engagement style.

## Overview

This app uses the Gemini API to analyze Farcaster users' posts and determine which of five founder archetypes best matches their style:

- **The Visionary Builder**: Ambitious thinkers focused on big ideas and future impact
- **The Strategic Operator**: Execution-driven leaders focused on efficiency and scaling
- **The Community Catalyst**: People-focused builders thriving on engagement and connection
- **The Contrarian Thinker**: Unique perspectives challenging industry assumptions
- **The Relentless Problem-Solver**: Pragmatic innovators focused on solving real challenges

## Setup

### Environment Variables

Create a `.env` file with the following variables:

```env
# Required for Farcaster API access
NEYNAR_API_KEY=your_neynar_api_key

# Required for AI analysis
GEMINI_API_KEY=your_gemini_api_key

# Your app's base URL (used for sharing)
NEXT_PUBLIC_BASE_URL=https://your-app-domain.com
```

### Image Assets

The following placeholder images need to be replaced with your own 3:2 aspect ratio (1200x800) images:

1. Update the image URLs in `src/lib/generate-page-metadata.js`:
```javascript
const IMAGE_LOOKUP = {
  'visionary': 'https://placehold.co/1200x800/png',  // Visionary type preview image
  'strategic': 'https://placehold.co/1200x800/png',  // Strategic type preview image
  'community': 'https://placehold.co/1200x800/png',  // Community type preview image
  'contrarian': 'https://placehold.co/1200x800/png', // Contrarian type preview image
  'relentless': 'https://placehold.co/1200x800/png', // Relentless type preview image
}
```

2. Replace the splash image URL:
```javascript
splashImageUrl: 'https://placehold.co/200x200/png' // Frame splash screen (200x200)
```

Requirements for images:
- Type preview images: 1200x800px, should visually represent each founder type
- Splash image: 200x200px, app logo or branded image shown while frame loads

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Frame Integration

The app is built as a Farcaster Frame and includes:
- Automatic user FID detection
- Share functionality for results
- Responsive design for both web and frame contexts

## API Usage

The app uses two main APIs:
1. **Neynar API** (v2): Fetches user profiles and casts
2. **Gemini API**: Analyzes user content and determines founder type

## Customization

The founder type descriptions, recommendations, and analysis parameters can be customized in:
- `src/components/HomeComponent.js`: Type descriptions and recommendations
- `src/lib/gemini.js`: Analysis prompts and parameters

## License

MIT
