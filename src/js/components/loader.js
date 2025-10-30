export function initLogoRevealLoader(lenis, off) {
  CustomEase.create('loader', '0.65, 0.01, 0.05, 0.99');

  const wrap = document.querySelector('[data-load-wrap]');
  if (!wrap) return;

  const container = wrap.querySelector('[data-load-container]');
  // const bg = wrap.querySelector('[data-load-bg]');
  const progressBar = wrap.querySelector('[data-load-progress]');
  const logo = wrap.querySelector('[data-load-logo]');

  const wave = wrap.querySelector('[data-load-wave] path');

  const waveShape = {
    full: 'M469.539032,263.986786H-0.000001L0,0c226.11113,0,182.887283-0.414484,469.539032,0V263.986786z',
    wave: 'M469.539032,263.986786H-0.000001L0,229.890961c310.649475,58.156982,255.61113-98.5,469.539032-65.062302V263.986786z',
    empty:
      'M469.539032,263.986786H-0.000001L0,263.557617c66.11113,0.429169,351.088104,0.429169,469.539032,0.208344V263.986786z',
  };

  if (off) {
    gsap.set(wrap, { display: 'none' });
    return;
  }

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
    .to(progressBar, { opacity: 0, duration: 0.5 }, '<')
    .add('hideContent', '<')
    .to(
      wave,
      {
        duration: 0.5,
        attr: { d: waveShape.wave },
        ease: 'sine.in',
      },
      'hideContent',
    )
    .to(
      wave,
      {
        duration: 0.25,
        attr: { d: waveShape.empty },
        ease: 'sine.out',
      },
      'hideContent>',
    )
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
        .set(wrap, { display: 'block' })
        .set(logo, { clipPath: 'inset(100% 0% 0% 0%)' })
        .set(wave.parentElement, { rotateZ: 180, rotateY: -180 })
        .set(wave, {
          attr: { d: waveShape.empty },
        })
        .to(wave, {
          duration: 0.15,
          attr: { d: waveShape.wave },
          ease: 'sine.in',
        })
        .to(wave, {
          duration: 0.3,
          attr: { d: waveShape.full },
          ease: 'sine.out',
        })
        .to(
          container,
          {
            autoAlpha: 1,
            duration: 0.3,
            onComplete: () => {
              window.location.href = destination;
            },
          },
          '<',
        );
    });
  });

  window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
      window.location.reload();
    }
  });
}
