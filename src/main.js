import { animateScroll } from './js/components/animateScroll.js';

/**
 * Webflow Custom Code - Main Entry Point
 * This file loads global and page-specific JavaScript
 */
gsap.registerPlugin(
  ScrollTrigger,
  Draggable,
  InertiaPlugin,
  CustomEase,
  SplitText,
);
// console.log(window.gsap);
// Parse URL paths for conditional loading

let paths = window.location.pathname.split('/');

/**
 * Check if current page matches any of the provided page slugs
 * Supports: regular pages, collection detail pages, and nested routes
 */
function isCurrentPage(pageList) {
  const path = paths[paths.length - 1];
  const itemPath = paths[paths.length - 2];
  return (
    pageList.includes(path) ||
    pageList.includes('detail_' + itemPath) ||
    pageList.includes(itemPath + '/item')
  );
}

/**
 * Ensure function runs after DOM is ready
 */
function ready(fn) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fn);
  } else {
    fn();
  }
}

/**
 * Initialize application (Async)
 */

ready(async () => {
  try {
    // Load global JavaScript first (always runs on every page)
    import('./js/global.js');

    // Load page-specific JavaScript conditionally
    if (isCurrentPage([''])) {
      await import('./js/home.js');
    }

    if (isCurrentPage(['work'])) {
      await import('./js/work.js');
    }

    if (isCurrentPage(['about'])) {
      await import('./js/about.js');
    }

    if (isCurrentPage(['services'])) {
      await import('./js/services.js');
    }

    if (isCurrentPage(['booking'])) {
      await import('./js/booking.js');
    }

    animateScroll();

    console.log('✓ Custom code loaded successfully');
  } catch (error) {
    console.error('✗ Error loading custom code:', error);
  }
});
