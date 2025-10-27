/**
 * Global JavaScript - Runs on all pages
 * Add site-wide functionality here
 */
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import barba from '@barba/core';
import { restartWebflow } from './utils/restartWebflow';

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
    ScrollTrigger.refresh();
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

// Mobile Menu
function initScalingHamburgerNavigation() {
  // Toggle Navigation
  document
    .querySelectorAll('[data-navigation-toggle="toggle"]')
    .forEach((toggleBtn) => {
      toggleBtn.addEventListener('click', () => {
        const navStatusEl = document.querySelector('[data-navigation-status]');
        if (!navStatusEl) return;
        if (
          navStatusEl.getAttribute('data-navigation-status') === 'not-active'
        ) {
          navStatusEl.setAttribute('data-navigation-status', 'active');
          // If you use Lenis you can 'stop' Lenis here: Example Lenis.stop();
        } else {
          navStatusEl.setAttribute('data-navigation-status', 'not-active');
          // If you use Lenis you can 'start' Lenis here: Example Lenis.start();
        }
      });
    });

  // Close Navigation
  document
    .querySelectorAll('[data-navigation-toggle="close"]')
    .forEach((closeBtn) => {
      closeBtn.addEventListener('click', () => {
        const navStatusEl = document.querySelector('[data-navigation-status]');
        if (!navStatusEl) return;
        navStatusEl.setAttribute('data-navigation-status', 'not-active');
        // If you use Lenis you can 'start' Lenis here: Example Lenis.start();
      });
    });

  // Key ESC - Close Navigation
  document.addEventListener('keydown', (e) => {
    if (e.keyCode === 27) {
      const navStatusEl = document.querySelector('[data-navigation-status]');
      if (!navStatusEl) return;
      if (navStatusEl.getAttribute('data-navigation-status') === 'active') {
        navStatusEl.setAttribute('data-navigation-status', 'not-active');
        // If you use Lenis you can 'start' Lenis here: Example Lenis.start();
      }
    }
  });
}

// Button
function initDirectionalButtonHover() {
  // Button hover animation
  document.querySelectorAll('[data-btn-hover]').forEach((button) => {
    button.addEventListener('mouseenter', handleHover);
    button.addEventListener('mouseleave', handleHover);
  });

  function handleHover(event) {
    const button = event.currentTarget;
    const buttonRect = button.getBoundingClientRect();

    // Get the button's dimensions and center
    const buttonWidth = buttonRect.width;
    const buttonHeight = buttonRect.height;
    const buttonCenterX = buttonRect.left + buttonWidth / 2;
    const buttonCenterY = buttonRect.top + buttonHeight / 2;

    // Calculate mouse position
    const mouseX = event.clientX;
    const mouseY = event.clientY;

    // Offset from the top-left corner in percentage
    const offsetXFromLeft = ((mouseX - buttonRect.left) / buttonWidth) * 100;
    const offsetYFromTop = ((mouseY - buttonRect.top) / buttonHeight) * 100;

    // Offset from the center in percentage
    let offsetXFromCenter = ((mouseX - buttonCenterX) / (buttonWidth / 2)) * 50;

    // Convert to absolute values
    offsetXFromCenter = Math.abs(offsetXFromCenter);

    // Update position and size of .btn__circle
    const circle = button.querySelector('.btn__circle');
    if (circle) {
      circle.style.left = `${offsetXFromLeft.toFixed(1)}%`;
      circle.style.top = `${offsetYFromTop.toFixed(1)}%`;
      circle.style.width = `${115 + offsetXFromCenter.toFixed(1) * 2}%`;
    }
  }
}

// initBarba();
initSmoothScroll();
initDirectionalButtonHover();
initScalingHamburgerNavigation();
