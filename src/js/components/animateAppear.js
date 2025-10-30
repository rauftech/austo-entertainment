function animateAppearText() {
  const target = document.querySelector('.animate-text');

  if (!target) return;

  gsap.set(target, { opacity: 1 });

  document.fonts.ready.then(() => {
    let split;
    SplitText.create(target, {
      type: 'lines',
      linesClass: 'line',
      autoSplit: true,
      // mask: 'lines',
      onSplit: (self) => {
        split = gsap.from(self.lines, {
          duration: 0.8,
          yPercent: 50,
          opacity: 0,
          stagger: 0.12,
          ease: 'expo.out',
          delay: 1.8,
        });
        return split;
      },
    });
  });
}

function animateAppearHeading() {
  const target = document.querySelector('.animate-heading');

  if (!target) return;

  gsap.set(target, { opacity: 1 });

  document.fonts.ready.then(() => {
    let split;
    SplitText.create(target, {
      type: 'lines',
      linesClass: 'line',
      autoSplit: true,
      // mask: 'lines',
      onSplit: (self) => {
        split = gsap.from(self.lines, {
          duration: 0.8,
          yPercent: 50,
          rotation: 3,
          opacity: 0,
          stagger: 0.12,
          ease: 'expo.out',
          delay: 1.8,
        });
        return split;
      },
    });
  });
}

export function animateAppear() {
  animateAppearHeading();
  animateAppearText();
}
