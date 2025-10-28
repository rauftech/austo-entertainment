/**
 * Global JavaScript - Runs on all pages
 * Add site-wide functionality here
 */
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initDirectionalButtonHover } from './components/button.js';
import { initScalingHamburgerNavigation } from './components/mobileMenu.js';
import { initLogoRevealLoader } from './components/loader.js';

console.log('→ Global JS initialized');

// Lenis (with GSAP Scroltrigger)
let lenis;

function initSmoothScroll() {
  lenis = new Lenis();
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);
}

initSmoothScroll();
initDirectionalButtonHover();
initScalingHamburgerNavigation();
initLogoRevealLoader(lenis);
