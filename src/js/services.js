import { animateHeroServices } from './components/animateHero';
import { initSliderComponent } from './components/slider';

// Events
function initPreviewFollower() {
  // Find every follower wrap
  const wrappers = document.querySelectorAll('[data-follower-wrap]');

  wrappers.forEach((wrap) => {
    const collection = wrap.querySelector('[data-follower-collection]');
    const items = wrap.querySelectorAll('[data-follower-item]');
    const follower = wrap.querySelector('[data-follower-cursor]');
    const followerInner = wrap.querySelector('[data-follower-cursor-inner]');

    let prevIndex = null;
    let firstEntry = true;

    const offset = 100; // The animation distance in %
    const duration = 0.5; // The animation duration of all visual transforms
    const ease = 'power2.inOut';

    // Initialize follower position
    gsap.set(follower, { xPercent: -50, yPercent: -50 });

    // Quick setters for x/y
    const xTo = gsap.quickTo(follower, 'x', { duration: 0.6, ease: 'power3' });
    const yTo = gsap.quickTo(follower, 'y', { duration: 0.6, ease: 'power3' });

    // Move all followers on mousemove
    window.addEventListener('mousemove', (e) => {
      xTo(e.clientX);
      yTo(e.clientY);
    });

    // Enter/leave per item within this wrap
    items.forEach((item, index) => {
      item.addEventListener('mouseenter', () => {
        const forward = prevIndex === null || index > prevIndex;
        prevIndex = index;

        // animate out existing visuals
        follower.querySelectorAll('[data-follower-visual]').forEach((el) => {
          gsap.killTweensOf(el);
          gsap.to(el, {
            yPercent: forward ? -offset : offset,
            duration,
            ease,
            overwrite: 'auto',
            onComplete: () => el.remove(),
          });
        });

        // clone & insert new visual
        const visual = item.querySelector('[data-follower-visual]');
        if (!visual) return;
        const clone = visual.cloneNode(true);
        followerInner.appendChild(clone);

        // animate it in (unless it's the very first entry)
        if (!firstEntry) {
          gsap.fromTo(
            clone,
            { yPercent: forward ? offset : -offset },
            { yPercent: 0, duration, ease, overwrite: 'auto' },
          );
        } else {
          firstEntry = false;
        }
      });

      item.addEventListener('mouseleave', () => {
        const el = follower.querySelector('[data-follower-visual]');
        if (!el) return;
        gsap.killTweensOf(el);
        gsap.to(el, {
          yPercent: -offset,
          duration,
          ease,
          overwrite: 'auto',
          onComplete: () => el.remove(),
        });
      });
    });

    // If pointer leaves the collection, clear any visuals
    collection.addEventListener('mouseleave', () => {
      follower.querySelectorAll('[data-follower-visual]').forEach((el) => {
        gsap.killTweensOf(el);
        gsap.delayedCall(duration, () => el.remove());
      });
      firstEntry = true;
      prevIndex = null;
    });
  });
}

// Production
function initStickyFeatures(root) {
  const wraps = Array.from(
    (root || document).querySelectorAll('[data-sticky-feature-wrap]'),
  );
  if (!wraps.length) return;

  wraps.forEach((w) => {
    const visualWraps = Array.from(
      w.querySelectorAll('[data-sticky-feature-visual-wrap]'),
    );
    const items = Array.from(w.querySelectorAll('[data-sticky-feature-item]'));
    const progressBar = w.querySelector('[data-sticky-feature-progress]');

    if (visualWraps.length !== items.length) {
      console.warn(
        '[initStickyFeatures] visualWraps and items count do not match:',
        {
          visualWraps: visualWraps.length,
          items: items.length,
          wrap: w,
        },
      );
    }

    const count = Math.min(visualWraps.length, items.length);
    if (count < 1) return;

    const rm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const DURATION = rm ? 0.01 : 0.75; // If user prefers reduced motion, reduce duration
    const EASE = 'power4.inOut';
    const SCROLL_AMOUNT = 0.7; // % of scroll used for step transitions

    const getTexts = (el) =>
      Array.from(el.querySelectorAll('[data-sticky-feature-text]'));

    if (visualWraps[0])
      gsap.set(visualWraps[0], { clipPath: 'inset(0% round 0px)' });
    gsap.set(items[0], { autoAlpha: 1 });

    let currentIndex = 0;

    // Transition Function
    function transition(fromIndex, toIndex) {
      if (fromIndex === toIndex) return;
      const tl = gsap.timeline({ defaults: { overwrite: 'auto' } });

      if (fromIndex < toIndex) {
        tl.to(
          visualWraps[toIndex],
          {
            clipPath: 'inset(0% round 0px)',
            duration: DURATION,
            ease: EASE,
          },
          0,
        );
      } else {
        tl.to(
          visualWraps[fromIndex],
          {
            clipPath: 'inset(50% round 0px)',
            duration: DURATION,
            ease: EASE,
          },
          0,
        );
      }
      animateOut(items[fromIndex]);
      animateIn(items[toIndex]);
    }

    // Fade out text content items
    function animateOut(itemEl) {
      const texts = getTexts(itemEl);
      gsap.to(texts, {
        autoAlpha: 0,
        y: -30,
        ease: 'power4.out',
        duration: 0.4,
        onComplete: () => gsap.set(itemEl, { autoAlpha: 0 }),
      });
    }

    // Reveal incoming text content items
    function animateIn(itemEl) {
      const texts = getTexts(itemEl);
      gsap.set(itemEl, { autoAlpha: 1 });
      gsap.fromTo(
        texts,
        {
          autoAlpha: 0,
          y: 30,
        },
        {
          autoAlpha: 1,
          y: 0,
          ease: 'power4.out',
          duration: DURATION,
          stagger: 0.1,
        },
      );
    }

    const steps = Math.max(1, count - 1);

    ScrollTrigger.create({
      trigger: w,
      start: 'center center',
      end: () => `+=${steps * 100}%`,
      pin: true,
      scrub: true,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const p = Math.min(self.progress, SCROLL_AMOUNT) / SCROLL_AMOUNT;
        let idx = Math.floor(p * steps + 1e-6);
        idx = Math.max(0, Math.min(steps, idx));

        gsap.to(progressBar, {
          scaleX: p,
          ease: 'none',
        });

        if (idx !== currentIndex) {
          transition(currentIndex, idx);
          currentIndex = idx;
        }
      },
    });
  });
}

// Faqs
function initAccordionCSS() {
  document
    .querySelectorAll('[data-accordion-css-init]')
    .forEach((accordion) => {
      const closeSiblings =
        accordion.getAttribute('data-accordion-close-siblings') === 'true';

      accordion.addEventListener('click', (event) => {
        const toggle = event.target.closest('[data-accordion-toggle]');
        if (!toggle) return; // Exit if the clicked element is not a toggle

        const singleAccordion = toggle.closest('[data-accordion-status]');
        if (!singleAccordion) return; // Exit if no accordion container is found

        const isActive =
          singleAccordion.getAttribute('data-accordion-status') === 'active';
        singleAccordion.setAttribute(
          'data-accordion-status',
          isActive ? 'not-active' : 'active',
        );

        // When [data-accordion-close-siblings="true"]
        if (closeSiblings && !isActive) {
          accordion
            .querySelectorAll('[data-accordion-status="active"]')
            .forEach((sibling) => {
              if (sibling !== singleAccordion)
                sibling.setAttribute('data-accordion-status', 'not-active');
            });
        }
      });
    });
}

initPreviewFollower();
initStickyFeatures();
initAccordionCSS();
initSliderComponent();
animateHeroServices();
