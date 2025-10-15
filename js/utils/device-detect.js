/**
 * Device and motion preference detection utilities
 */

export const DeviceDetect = {
  /**
   * Check if user prefers reduced motion
   */
  prefersReducedMotion() {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    return mediaQuery.matches;
  },

  /**
   * Check if device is mobile (width-based)
   */
  isMobile() {
    return window.innerWidth <= 900;
  },

  /**
   * Check if device is iOS/Safari
   */
  isIOS() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) ||
           (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  },

  /**
   * Check if browser is Safari
   */
  isSafari() {
    return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  },

  /**
   * Check if animations should be reduced
   * Returns true for: reduced motion preference OR mobile Safari/iOS
   */
  shouldReduceAnimations() {
    return this.prefersReducedMotion() || (this.isMobile() && (this.isIOS() || this.isSafari()));
  },

  /**
   * Listen for reduced motion preference changes
   */
  onReducedMotionChange(callback) {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    mediaQuery.addEventListener?.('change', (e) => callback(e.matches));
  }
};
