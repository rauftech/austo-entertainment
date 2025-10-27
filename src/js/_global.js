/**
 * Global JavaScript - Barba + Global Features
 */
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import barba from '@barba/core';
import { restartWebflow } from './utils/restartWebflow.js';
import { initPageScripts, cleanupPageScripts } from './_pageManager.js';
import { initDirectionalButtonHover } from './components/button.js';
import { initScalingHamburgerNavigation } from './components/mobileMenu.js';

console.log('→ Global JS initialized');

let lenis;

// ======================
// Lenis Smooth Scroll
// ======================
function initSmoothScroll() {
  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  });

  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);
}

// ======================
// Barba Page Transitions
// ======================
function initBarba() {
  barba.init({
    prevent: ({ el }) => el.classList && el.classList.contains('no-barba'),
    transitions: [
      {
        name: 'opacity-transition',

        async leave(data) {
          console.log('→ Barba: Leaving page');

          // Cleanup before leaving
          cleanupPageScripts();

          // Fade out animation
          await gsap.to(data.current.container, {
            opacity: 0,
            duration: 0.3,
          });
        },

        async enter(data) {
          console.log('→ Barba: Entering page');

          // Scroll to top
          window.scrollTo(0, 0);
          if (lenis) lenis.scrollTo(0, { immediate: true });

          // Fade in animation
          await gsap.from(data.next.container, {
            opacity: 0,
            duration: 0.3,
          });
        },
      },
    ],
  });

  // IMPORTANT: Use beforeEnter instead of after
  barba.hooks.beforeEnter(() => {
    console.log('→ Barba: beforeEnter hook');

    // Restart Webflow interactions (synchronous)
    restartWebflow();
  });

  // After transition completes
  barba.hooks.afterEnter(() => {
    console.log('→ Barba: afterEnter hook');

    // Reinitialize global features for new DOM
    initScalingHamburgerNavigation();
    initDirectionalButtonHover();

    // Initialize page-specific scripts
    initPageScripts();

    // Small delay before refreshing ScrollTrigger to ensure DOM is ready
    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
      console.log('→ ScrollTrigger refreshed');
    });
  });
}

// ======================
// Initialize Everything
// ======================
initSmoothScroll();
initScalingHamburgerNavigation();
initDirectionalButtonHover();
// initBarba();

// Initialize page scripts on first load
console.log('→ Initial page load');
initPageScripts();
