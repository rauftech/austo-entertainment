import Lenis from 'lenis';
import { initDirectionalButtonHover } from './components/button.js';
import { initScalingHamburgerNavigation } from './components/mobileMenu.js';
import { initLogoRevealLoader } from './components/loader.js';
// import { animateAppear } from './components/animateAppear.js';

console.log('→ Global JS initialized');

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

initLogoRevealLoader(lenis, false);
// animateAppear();
