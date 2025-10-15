# JavaScript Module Structure

This directory contains the modularized JavaScript code for the portfolio website.

## Directory Structure

```
js/
├── main.js                    # Entry point - initializes all modules
├── utils/
│   └── device-detect.js      # Device detection and motion preference utilities
└── modules/
    ├── scroll-effects.js     # Scroll progress bar and navbar glassmorphism
    ├── cat-guide.js          # Cat companion guide with section messages
    ├── starfield.js          # Canvas starfield animation with parallax
    ├── planet.js             # 3D planet and satellite animations
    └── custom-cursor.js      # Custom cursor loader
```

## Module Descriptions

### `main.js`
Entry point that imports and initializes all modules. Also handles footer year update.

### `utils/device-detect.js`
Utility functions for detecting:
- User motion preferences (`prefers-reduced-motion`)
- Mobile devices
- iOS/Safari browsers
- Whether animations should be reduced (combines all factors)

### `modules/scroll-effects.js`
Handles scroll-based UI effects:
- Scroll progress indicator bar
- Navbar glassmorphism on scroll

### `modules/cat-guide.js`
Cat companion functionality:
- Loads cat image with iOS Safari optimizations
- Shows contextual messages based on section
- Floating scroll animation
- Different messages for mobile/desktop

### `modules/starfield.js`
Canvas-based starfield background:
- Animated stars with parallax effect
- Constellation lines connecting nearby stars
- Shooting stars (meteors)
- Cat asteroids
- Automatically optimized for mobile and reduced motion

### `modules/planet.js`
3D planet and satellite animations using GSAP:
- Orbital rotation
- Mouse parallax lighting (desktop only)
- Automatically reduces/disables on mobile for performance

### `modules/custom-cursor.js`
Custom mouse cursor loader with fallback.

## Performance Optimizations

All modules automatically detect and optimize for:
- **Mobile devices**: Reduced animation complexity, lower DPR
- **iOS Safari**: Specific fixes for compatibility and performance
- **Reduced motion preference**: Respects user accessibility settings
- **Low-end devices**: Automatically reduces particle count, animation speed

## Usage

The modules are loaded as ES6 modules:

```html
<script type="module" src="js/main.js"></script>
```

No build step required - runs natively in modern browsers.
