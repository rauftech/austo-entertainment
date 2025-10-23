// src/js/home.js
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Draggable } from 'gsap/Draggable';

// Featured Work
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

// Services
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

// Testimonials
function initStackedCardsSlider() {
  document
    .querySelectorAll('[data-stacked-cards]')
    .forEach(function (container) {
      // animation presets
      let easeBeforeRelease = { duration: 0.2, ease: 'power2.out' };
      let easeAfterRelease = { duration: 1, ease: 'expo.out' };

      let activeDeg = 4;
      let inactiveDeg = -4;

      const list = container.querySelector('[data-stacked-cards-list]');
      if (!list) return;

      // check minimum cards
      const initialItems = Array.from(
        list.querySelectorAll(':scope > [data-stacked-cards-item]'),
      );
      if (initialItems.length < 3) {
        console.error(
          '[StackedCards] Minimum of 3 cards required. Found:',
          initialItems.length,
          list,
        );
        return;
      }

      // Draggable instances & cached elements
      let dragFirst, dragSecond;
      let firstItem, secondItem, firstEl, secondEl;
      let full, t;

      function restack() {
        const items = Array.from(
          list.querySelectorAll('[data-stacked-cards-item]'),
        );
        items.forEach(function (item) {
          item.classList.remove('is--active', 'is--second');
        });
        items[0].style.zIndex = 3;
        items[0].style.transform = `rotate(${activeDeg}deg)`;
        items[0].style.pointerEvents = 'auto';
        items[0].classList.add('is--active');

        items[1].style.zIndex = 2;
        items[1].style.transform = `rotate(${inactiveDeg}deg)`;
        items[1].style.pointerEvents = 'none';
        items[1].classList.add('is--second');

        items[2].style.zIndex = 1;
        items[2].style.transform = `rotate(${activeDeg}deg)`;

        items.slice(3).forEach(function (item) {
          item.style.zIndex = 0;
          item.style.transform = `rotate(${inactiveDeg}deg)`;
        });
      }

      function setupDraggables() {
        restack();

        // cache top two cards
        const items = Array.from(
          list.querySelectorAll(':scope > [data-stacked-cards-item]'),
        );
        firstItem = items[0];
        secondItem = items[1];
        firstEl = firstItem.querySelector('[data-stacked-cards-card]');
        secondEl = secondItem.querySelector('[data-stacked-cards-card]');

        // compute thresholds
        const width = firstEl.getBoundingClientRect().width;
        full = width * 1.15;
        t = width * 0.1;

        // kill old Draggables
        dragFirst?.kill();
        dragSecond?.kill();

        // --- First card draggable ---
        dragFirst = Draggable.create(firstEl, {
          type: 'x',
          onPress() {
            firstEl.classList.add('is--dragging');
          },
          onRelease() {
            firstEl.classList.remove('is--dragging');
          },
          onDrag() {
            let raw = this.x;
            if (Math.abs(raw) > full) {
              const over = Math.abs(raw) - full;
              raw = (raw > 0 ? 1 : -1) * (full + over * 0.1);
            }
            gsap.set(firstEl, { x: raw, rotation: 0 });
          },
          onDragEnd() {
            const x = this.x;
            const dir = x > 0 ? 'right' : 'left';

            // hand control to second card
            this.disable?.();
            dragSecond?.enable?.();
            firstItem.style.pointerEvents = 'none';
            secondItem.style.pointerEvents = 'auto';

            if (Math.abs(x) <= t) {
              // small drag: just snap back
              gsap.to(firstEl, {
                x: 0,
                rotation: 0,
                ...easeBeforeRelease,
                onComplete: resetCycle,
              });
            } else if (Math.abs(x) <= full) {
              flick(dir, false, x);
            } else {
              flick(dir, true);
            }
          },
        })[0];

        // --- Second card draggable ---
        dragSecond = Draggable.create(secondEl, {
          type: 'x',
          onPress() {
            secondEl.classList.add('is--dragging');
          },
          onRelease() {
            secondEl.classList.remove('is--dragging');
          },
          onDrag() {
            let raw = this.x;
            if (Math.abs(raw) > full) {
              const over = Math.abs(raw) - full;
              raw = (raw > 0 ? 1 : -1) * (full + over * 0.2);
            }
            gsap.set(secondEl, { x: raw, rotation: 0 });
          },
          onDragEnd() {
            gsap.to(secondEl, {
              x: 0,
              rotation: 0,
              ...easeBeforeRelease,
            });
          },
        })[0];

        // start with first card active
        dragFirst?.enable?.();
        dragSecond?.disable?.();
        firstItem.style.pointerEvents = 'auto';
        secondItem.style.pointerEvents = 'none';
      }

      function flick(dir, skipHome = false, releaseX = 0) {
        if (!(dir === 'left' || dir === 'right')) {
          dir = activeDeg > 0 ? 'right' : 'left';
        }
        dragFirst?.disable?.();

        const item = list.querySelector('[data-stacked-cards-item]');
        const card = item.querySelector('[data-stacked-cards-card]');
        const exitX = dir === 'right' ? full : -full;

        if (skipHome) {
          const visualX = gsap.getProperty(card, 'x');
          list.appendChild(item);
          [activeDeg, inactiveDeg] = [inactiveDeg, activeDeg];
          restack();
          gsap.fromTo(
            card,
            { x: visualX, rotation: 0 },
            { x: 0, rotation: 0, ...easeAfterRelease, onComplete: resetCycle },
          );
        } else {
          gsap.fromTo(
            card,
            { x: releaseX, rotation: 0 },
            {
              x: exitX,
              ...easeBeforeRelease,
              onComplete() {
                gsap.set(card, { x: 0, rotation: 0 });
                list.appendChild(item);
                [activeDeg, inactiveDeg] = [inactiveDeg, activeDeg];
                resetCycle();
                const newCard = item.querySelector('[data-stacked-cards-card]');
                gsap.fromTo(
                  newCard,
                  { x: exitX },
                  { x: 0, ...easeAfterRelease, onComplete: resetCycle },
                );
              },
            },
          );
        }
      }

      function resetCycle() {
        list
          .querySelectorAll('[data-stacked-cards-card].is--dragging')
          .forEach(function (el) {
            el.classList.remove('is--dragging');
          });
        setupDraggables();
      }

      setupDraggables();

      // “Next” button support
      container
        .querySelectorAll('[data-stacked-cards-control="next"]')
        .forEach(function (btn) {
          btn.onclick = function () {
            flick();
          };
        });
    });
}

initStoriesGrid();
initDynamicCustomTextCursor();
initImageTrail({
  minWidth: 992,
  moveDistance: 15,
  stopDuration: 350,
  trailLength: 8,
});
initStackedCardsSlider();
