import { gsap } from 'gsap';
import { CustomEase } from 'gsap/CustomEase';

export function initLogoRevealLoader(lenis) {
  CustomEase.create('loader', '0.65, 0.01, 0.05, 0.99');

  const wrap = document.querySelector('[data-load-wrap]');
  if (!wrap) return;

  const container = wrap.querySelector('[data-load-container]');
  const bg = wrap.querySelector('[data-load-bg]');
  const progressBar = wrap.querySelector('[data-load-progress]');
  const logo = wrap.querySelector('[data-load-logo]');

  // Main loader timeline
  const loadTimeline = gsap
    .timeline({
      defaults: {
        ease: 'loader',
        duration: 1.2,
      },
    })
    .add(() => lenis.stop())
    .set(wrap, { display: 'block' })
    .to(progressBar, { scaleX: 1 })
    .to(logo, { clipPath: 'inset(0% 0% 0% 0%)' }, '<')
    .to(container, { autoAlpha: 0, duration: 0.5 })
    .to(
      progressBar,
      { scaleX: 0, transformOrigin: 'right center', duration: 0.5 },
      '<',
    )
    .add('hideContent', '<')
    .to(bg, { yPercent: -101, duration: 1 }, 'hideContent')
    .set(wrap, { display: 'none' })
    .add(() => lenis.start());

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

      loadTimeline
        .add(() => lenis.stop())
        .set(wrap, { display: 'block' })
        .set(logo, { clipPath: 'inset(100% 0% 0% 0%)' })
        .fromTo(
          bg,
          {
            yPercent: 101,
          },
          {
            yPercent: 0,
            duration: 0.6,
          },
        )
        .to(
          container,
          {
            autoAlpha: 1,
            duration: 0.5,
            onComplete: () => {
              window.location.href = destination;
            },
          },
          '<0.5',
        )
        .add(() => lenis.start());
    });
  });

  window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
      window.location.reload();
    }
  });
}
