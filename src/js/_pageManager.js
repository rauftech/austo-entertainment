/**
 * Page Manager - Handles all page-specific script initialization
 */

// Import all page modules
import { initHome } from './home.js';
import { initWork } from './work.js';
import { initAbout } from './about.js';
import { initServices } from './services.js';

/**
 * Get current page identifier from URL
 */
function getCurrentPage() {
  const paths = window.location.pathname.split('/').filter((p) => p);
  return paths[paths.length - 1] || 'home';
}

/**
 * Initialize scripts for current page
 */
export function initPageScripts() {
  const page = getCurrentPage();

  console.log(`→ Initializing page: ${page}`);

  // Map pages to their init functions
  const pageMap = {
    '': initHome,
    home: initHome,
    work: initWork,
    about: initAbout,
    services: initServices,
  };

  // Call the appropriate init function
  const initFn = pageMap[page];
  if (initFn) {
    initFn();
  } else {
    console.log(`No specific scripts for page: ${page}`);
  }
}

/**
 * Cleanup page-specific resources
 */
export function cleanupPageScripts() {
  // Kill all ScrollTrigger instances
  const triggers = ScrollTrigger.getAll();
  triggers.forEach((trigger) => trigger.kill());

  // Kill all GSAP tweens/timelines
  gsap.globalTimeline.clear();

  console.log(`→ Cleaned up ${triggers.length} ScrollTriggers`);
}
