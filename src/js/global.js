/**
 * Global JavaScript - Runs on all pages
 * Add site-wide functionality here
 */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Draggable } from 'gsap/Draggable';
import { InertiaPlugin } from 'gsap/InertiaPlugin';

import Lenis from 'lenis';
// import { gsap } from 'gsap';
// import { ScrollTrigger } from 'gsap/ScrollTrigger';
import barba from '@barba/core';
import { restartWebflow } from './utils/restartWebflow.js';
import { initDirectionalButtonHover } from './components/button.js';
import { initScalingHamburgerNavigation } from './components/mobileMenu.js';
import { cleanGSAP } from './utils/cleanupGSAP.js';

gsap.registerPlugin(ScrollTrigger, Draggable, InertiaPlugin);

console.log('→ Global JS initialized');

// Lenis (with GSAP Scroltrigger)
function initSmoothScroll() {
  const lenis = new Lenis();
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);
}

// Initialize page-specific code
function initPage(namespace) {
  // Run page-specific initialization
  if (namespace === 'home') {
    import('./home.js');
  }

  if (namespace === 'work') {
    import('./work.js');
  }

  if (namespace === 'about') {
    import('./about.js');
  }

  if (namespace === 'services') {
    import('./services.js');
  }

  // if (namespace == 'booking') {
  //   import('./booking.js');
  // }
}

// Barba
function initBarba() {
  barba.init({
    transitions: [
      {
        name: 'opacity-transition',
        // sync: true,
        async leave(data) {
          await gsap.to(data.current.container, {
            opacity: 0,
          });
        },
        async enter(data) {
          await gsap.from(data.next.container, {
            opacity: 0,
          });
        },
      },
    ],
  });

  // barba.hooks.once((data) => {
  //   const namespace = data.next.namespace;
  //   initPage(namespace);
  // });

  barba.hooks.after(async (data) => {
    // cleanGSAP();
    await restartWebflow();
    // cleanGSAP();

    const namespace = data.next.namespace;
    initPage(namespace);
  });
}

// initSmoothScroll();
// initDirectionalButtonHover();
// initScalingHamburgerNavigation();
initBarba();

// Initialize first page
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', fn);
} else {
  const namespace = document.querySelector('[data-barba="container"]').dataset
    .barbaNamespace;
  initPage(namespace);
}
