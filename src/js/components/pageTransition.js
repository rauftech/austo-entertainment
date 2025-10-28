import { gsap } from 'gsap';

export function initPageTransition() {
  // adjustGrid().then(() => {
  let pageLoadTimeline = gsap.timeline({
    // onStart: () => {
    //   gsap.set('.transition', { background: 'transparent' });
    // },
    onComplete: () => {
      gsap.set('.transition', { display: 'none' });
    },
    defaults: {
      ease: 'linear',
    },
  });

  pageLoadTimeline.to('.transition', {
    yPercent: -100,
    duration: 0.5,
  });

  // Pre-process all valid links
  const validLinks = Array.from(document.querySelectorAll('a')).filter(
    (link) => {
      const href = link.getAttribute('href') || '';
      const hostname = new URL(link.href, window.location.origin).hostname;

      return (
        hostname === window.location.hostname && // Same domain
        !href.startsWith('#') && // Not an anchor link
        link.getAttribute('target') !== '_blank' && // Not opening in a new tab
        !link.hasAttribute('data-transition-prevent') // No 'data-transition-prevent' attribute
      );
    },
  );

  // Add event listeners to pre-processed valid links
  validLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const destination = link.href;

      // Show loading grid with animation
      gsap.set('.transition', { display: 'grid' });
      gsap.to('.transition', {
        yPercent: 0,
        duration: 0.5,
        onComplete: () => {
          window.location.href = destination;
        },
      });
    });
  });

  window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
      window.location.reload();
    }
  });

  // window.addEventListener('resize', adjustGrid);
}
