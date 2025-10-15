# CSS Module Structure

This directory contains modularized CSS files for the portfolio website.

## Import Order

The files are imported in `styles.css` in this specific order:

1. **variables.css** - CSS custom properties (colors, fonts, etc.)
2. **base.css** - Base styles, resets, typography
3. **background.css** - Animated background effects (aurora, stars)
4. **hero.css** - Hero section, navigation, buttons
5. **planet.css** - 3D planet and satellite animations
6. **sections.css** - Main content sections layout
7. **cards.css** - Skill cards, project cards, contact card
8. **cat-guide.css** - Cat companion guide styles
9. **footer.css** - Footer styles
10. **responsive.css** - Mobile/tablet responsive overrides

## Performance Optimizations

### Mobile Optimizations (`@media (max-width: 900px)`)
- Reduced blur filters
- Slower or disabled animations
- Simplified effects

### Reduced Motion Support
All animation-heavy files include:
```css
@media (prefers-reduced-motion: reduce) {
  /* Disable or reduce animations */
}
```

Files with reduced motion support:
- `planet.css` - Disables atmosphere pulse, ring shimmer, cat spin
- `background.css` - Disables aurora drift
- `cards.css` - Disables card entrance animations

## File Descriptions

### `variables.css`
CSS custom properties for theming:
- Colors (primary, accent, backgrounds)
- Fonts (Poppins, Fira Code)
- Spacing and sizing variables

### `base.css`
Foundation styles:
- CSS reset
- HTML/body defaults
- Typography
- Scroll behavior
- Custom cursor setup

### `background.css`
Animated background layers:
- Starfield canvas container
- Aurora gradient animation
- Performance optimizations for mobile

### `hero.css`
Hero section and navigation:
- Fixed navbar with scroll glassmorphism
- Scroll progress indicator
- Hero content layout
- CTA buttons with ripple effects

### `planet.css`
3D planet visualization:
- Planet with atmosphere and lighting
- Orbital rings with shimmer effect
- Satellite orbit animation
- Cat astronaut spin animation
- Extensive mobile performance optimizations

### `sections.css`
Main content section layouts:
- Section titles and numbering
- Section visibility animations
- Background glow effects

### `cards.css`
Card components:
- Skill cards with stagger animations
- Project cards with hover effects
- Contact card
- Badge pulse animation

### `cat-guide.css`
Cat companion guide:
- Fixed positioning
- Dialog bubble
- Speaking animation
- iOS Safari compatibility (webkit prefixes)

### `footer.css`
Simple footer styles.

### `responsive.css`
Mobile and tablet responsive overrides:
- Navigation adjustments
- Cat guide repositioning
- Planet sizing
- Card simplification
- Section overflow fixes

## Maintenance Tips

1. **Adding new animations**: Always include `@media (prefers-reduced-motion: reduce)` override
2. **Mobile optimization**: Test with reduced blur and animation on actual devices
3. **Import order**: Maintain the order in `styles.css` - later files override earlier ones
4. **Performance**: Use `will-change` sparingly and only on actively animating elements
