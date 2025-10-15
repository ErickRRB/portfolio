/**
 * Main entry point - initializes all modules
 */

import { initScrollEffects } from './modules/scroll-effects.js';
import { initCatGuide } from './modules/cat-guide.js';
import { initStarfield } from './modules/starfield.js';
import { initPlanet } from './modules/planet.js';
import { initCustomCursor } from './modules/custom-cursor.js';

// Initialize footer year
const yearTag = document.getElementById('year');
if (yearTag) {
  yearTag.textContent = new Date().getFullYear();
}

// Initialize all modules
document.addEventListener('DOMContentLoaded', () => {
  initScrollEffects();
  initCatGuide();
  initStarfield();
  initPlanet();
  initCustomCursor();
});
