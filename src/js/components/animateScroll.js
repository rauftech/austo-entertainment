export function animateTextOnScroll() {
  // const DURATION = 0.8;
  // const STAGGER = 0.12;
  const EASE = 'expo.out';

  const groups = [
    {
      selector: '.animate-text-scroll',
      fromVars: { yPercent: 100, opacity: 1, duration: 0.6, stagger: 0.1 },
    },
    {
      selector: '.animate-heading-scroll',
      fromVars: {
        yPercent: 50,
        rotation: 3,
        opacity: 0,
        duration: 0.8,
        stagger: 0.12,
      },
    },
  ];

  const fontsReady = document.fonts?.ready ?? Promise.resolve();

  fontsReady.then(() => {
    groups.forEach(({ selector, fromVars }) => {
      const targets = document.querySelectorAll(selector);
      if (!targets.length) return;

      gsap.set(targets, { opacity: 1 });

      targets.forEach((target) => {
        SplitText.create(target, {
          type: 'lines',
          linesClass: 'line',
          autoSplit: true,
          mask: selector === '.animate-text-scroll' ? 'lines' : '',
          onSplit: (self) =>
            gsap.from(self.lines, {
              ...fromVars,
              // duration: DURATION,
              // stagger: STAGGER,
              ease: EASE,
              scrollTrigger: {
                trigger: target,
                start: 'top 75%',
              },
            }),
        });
      });
    });
  });
}

export function animateScroll() {
  animateTextOnScroll();
}
