/**
 * Global JavaScript - Runs on all pages
 * Add site-wide functionality here
 */
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import barba from '@barba/core';
import { restartWebflow } from './utils/restartWebflow.js';
import { initDirectionalButtonHover } from './components/button.js';
import { initScalingHamburgerNavigation } from './components/mobileMenu.js';

console.log('→ Global JS initialized');

// Barba
function initBarba() {
  barba.init({
    transitions: [
      {
        name: 'opacity-transition',
        sync: true,
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

  barba.hooks.after(async () => {
    await restartWebflow();
  });
}

// Lenis (with GSAP Scroltrigger)
function initSmoothScroll() {
  const lenis = new Lenis();
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);
}

initSmoothScroll();
initDirectionalButtonHover();
initScalingHamburgerNavigation();
// initBarba();
