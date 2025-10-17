// src/js/home.js
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

function initStoriesGrid() {
  const grid = document.querySelector('.stories-grid');
  if (!grid) return;

  const items = grid.querySelectorAll('.story-item');
  let activeItem = grid.querySelector('.story-item.is--active');

  items.forEach((item) => {
    item.addEventListener('mouseenter', () => {
      if (item === activeItem) return;
      activeItem?.classList.remove('is--active');
      item.classList.add('is--active');
      activeItem = item;
    });
  });
}

function initDynamicCustomTextCursor() {
  let cursorItem = document.querySelector('.cursor');
  let cursorParagraph = cursorItem.querySelector('p');
  let targets = document.querySelectorAll('[data-cursor]');
  let xOffset = 0;
  let yOffset = 0;
  let cursorIsOnRight = false;
  let currentTarget = null;
  let lastText = '';

  // Position cursor relative to actual cursor position on page load
  gsap.set(cursorItem, { xPercent: xOffset, yPercent: yOffset });

  // Use GSAP quick.to for a more performative tween on the cursor
  let xTo = gsap.quickTo(cursorItem, 'x', { ease: 'power3' });
  let yTo = gsap.quickTo(cursorItem, 'y', { ease: 'power3' });

  // Function to get the width of the cursor element including a buffer
  const getCursorEdgeThreshold = () => {
    return cursorItem.offsetWidth + 16; // Cursor width + 16px margin
  };

  // On mousemove, call the quickTo functions to the actual cursor position
  window.addEventListener('mousemove', (e) => {
    let windowWidth = window.innerWidth;
    let windowHeight = window.innerHeight;
    let scrollY = window.scrollY;
    let cursorX = e.clientX;
    let cursorY = e.clientY + scrollY; // Adjust cursorY to account for scroll

    // Default offsets
    let xPercent = xOffset;
    let yPercent = yOffset;

    // Adjust X offset dynamically based on cursor width
    let cursorEdgeThreshold = getCursorEdgeThreshold();
    if (cursorX > windowWidth - cursorEdgeThreshold) {
      cursorIsOnRight = true;
      xPercent = -100;
    } else {
      cursorIsOnRight = false;
    }

    // Adjust Y offset if in the bottom 10% of the current viewport
    if (cursorY > scrollY + windowHeight * 0.9) {
      yPercent = -120;
    }

    if (currentTarget) {
      let newText = currentTarget.getAttribute('data-cursor');
      if (newText !== lastText) {
        // Only update if the text is different
        cursorParagraph.innerHTML = newText;
        lastText = newText;

        // Recalculate edge awareness whenever the text changes
        cursorEdgeThreshold = getCursorEdgeThreshold();
      }
    }

    gsap.to(cursorItem, {
      xPercent: xPercent,
      yPercent: yPercent,
      duration: 0.9,
      ease: 'power3',
    });
    xTo(cursorX);
    yTo(cursorY - scrollY);
  });

  // Add a mouse enter listener for each link that has a data-cursor attribute
  targets.forEach((target) => {
    target.addEventListener('mouseenter', () => {
      currentTarget = target; // Set the current target

      let newText = target.getAttribute('data-cursor');

      // Update only if the text changes
      if (newText !== lastText) {
        cursorParagraph.innerHTML = newText;
        lastText = newText;

        // Recalculate edge awareness whenever the text changes
        let cursorEdgeThreshold = getCursorEdgeThreshold();
      }
    });
  });
}

function initImageTrail(config = {}) {
  // config + defaults
  const options = {
    minWidth: config.minWidth ?? 992,
    moveDistance: config.moveDistance ?? 15,
    stopDuration: config.stopDuration ?? 300,
    trailLength: config.trailLength ?? 5,
  };

  const wrapper = document.querySelector('[data-trail="wrapper"]');

  if (!wrapper || window.innerWidth < options.minWidth) {
    return;
  }

  // State management
  const state = {
    trailInterval: null,
    globalIndex: 0,
    last: { x: 0, y: 0 },
    trailImageTimestamps: new Map(),
    trailImages: Array.from(document.querySelectorAll('[data-trail="item"]')),
    isActive: false,
  };

  // Utility functions
  const MathUtils = {
    lerp: (a, b, n) => (1 - n) * a + n * b,
    distance: (x1, y1, x2, y2) => Math.hypot(x2 - x1, y2 - y1),
  };

  function getRelativeCoordinates(e, rect) {
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }

  function activate(trailImage, x, y) {
    if (!trailImage) return;

    const rect = trailImage.getBoundingClientRect();
    const styles = {
      left: `${x - rect.width / 2}px`,
      top: `${y - rect.height / 2}px`,
      zIndex: state.globalIndex,
      display: 'block',
    };

    Object.assign(trailImage.style, styles);
    state.trailImageTimestamps.set(trailImage, Date.now());

    // Here, animate how the images will appear!
    gsap.fromTo(
      trailImage,
      { autoAlpha: 0, scale: 0.8 },
      {
        scale: 1,
        autoAlpha: 1,
        duration: 0.2,
        overwrite: true,
      },
    );

    state.last = { x, y };
  }

  function fadeOutTrailImage(trailImage) {
    if (!trailImage) return;

    // Here, animate how the images will disappear!
    gsap.to(trailImage, {
      opacity: 0,
      scale: 0.2,
      duration: 0.8,
      ease: 'expo.out',
      onComplete: () => {
        gsap.set(trailImage, { autoAlpha: 0 });
      },
    });
  }

  function handleOnMove(e) {
    if (!state.isActive) return;

    const rectWrapper = wrapper.getBoundingClientRect();
    const { x: relativeX, y: relativeY } = getRelativeCoordinates(
      e,
      rectWrapper,
    );

    const distanceFromLast = MathUtils.distance(
      relativeX,
      relativeY,
      state.last.x,
      state.last.y,
    );

    if (distanceFromLast > window.innerWidth / options.moveDistance) {
      const lead =
        state.trailImages[state.globalIndex % state.trailImages.length];
      const tail =
        state.trailImages[
          (state.globalIndex - options.trailLength) % state.trailImages.length
        ];

      activate(lead, relativeX, relativeY);
      fadeOutTrailImage(tail);
      state.globalIndex++;
    }
  }

  function cleanupTrailImages() {
    const currentTime = Date.now();
    for (const [
      trailImage,
      timestamp,
    ] of state.trailImageTimestamps.entries()) {
      if (currentTime - timestamp > options.stopDuration) {
        fadeOutTrailImage(trailImage);
        state.trailImageTimestamps.delete(trailImage);
      }
    }
  }

  function startTrail() {
    if (state.isActive) return;

    state.isActive = true;
    wrapper.addEventListener('mousemove', handleOnMove);
    state.trailInterval = setInterval(cleanupTrailImages, 100);
  }

  function stopTrail() {
    if (!state.isActive) return;

    state.isActive = false;
    wrapper.removeEventListener('mousemove', handleOnMove);
    clearInterval(state.trailInterval);
    state.trailInterval = null;

    // Clean up remaining trail images
    state.trailImages.forEach(fadeOutTrailImage);
    state.trailImageTimestamps.clear();
  }

  // Initialize ScrollTrigger
  ScrollTrigger.create({
    trigger: wrapper,
    start: 'top bottom',
    end: 'bottom top',
    onEnter: startTrail,
    onEnterBack: startTrail,
    onLeave: stopTrail,
    onLeaveBack: stopTrail,
  });

  // Clean up on window resize
  const handleResize = () => {
    if (window.innerWidth < options.minWidth && state.isActive) {
      stopTrail();
    } else if (window.innerWidth >= options.minWidth && !state.isActive) {
      startTrail();
    }
  };

  window.addEventListener('resize', handleResize);

  return () => {
    stopTrail();
    window.removeEventListener('resize', handleResize);
  };
}

initStoriesGrid();
initDynamicCustomTextCursor();
const imageTrail = initImageTrail({
  minWidth: 992,
  moveDistance: 15,
  stopDuration: 350,
  trailLength: 8,
});
