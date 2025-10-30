const DELAY = 1.8;

export function animateHeroHome() {
  const heading = document.querySelector('.hero .page-heading');
  const text = document.querySelector('.hero .hero-content__text');
  const imageList = document.querySelector('.hero .curtain__img-list');

  if (!(heading && text && imageList)) return;

  gsap.set([heading, text], {
    opacity: 1,
    willChange: 'transform, opacity',
  });
  gsap.set(imageList, { clipPath: 'inset(100% 0% 0% 0%)' });

  const tl = gsap.timeline({
    defaults: { ease: 'expo.out', overwrite: 'auto' },
    delay: DELAY,
  });

  document.fonts.ready.then(() => {
    [heading, text].forEach((target, i) => {
      SplitText.create(target, {
        type: 'lines',
        linesClass: 'line',
        mask: i == 0 ? '' : 'lines',
        onSplit: (self) => {
          const t = gsap.from(self.lines, {
            duration: i == 0 ? 0.8 : 0.4,
            yPercent: i == 0 ? 50 : 100,
            rotation: i == 0 ? 3 : 0,
            opacity: i == 0 ? 0 : 1,
            stagger: i == 0 ? 0.12 : 0.08,
          });
          tl.add(t, i * 0.3); // stagger each text group on the main timeline
        },
      });
    });

    tl.to(
      imageList,
      {
        clipPath: 'inset(0% 0% 0% 0%)',
        duration: 0.7,
        ease: 'power2.inOut',
      },
      '<',
    );
  });
}

export function animateHeroAbout() {
  const sliderItems = document.querySelectorAll('.about-ticker__item');
  const missionSection = document.querySelector('.mission');

  if (!(sliderItems.length && missionSection)) return;

  gsap.set(sliderItems, { clipPath: 'inset(100% 0% 0% 0%)' });
  gsap.set(missionSection, { opacity: 1 });

  const tl = gsap.timeline({
    delay: DELAY,
    defaults: {
      duration: 0.5,
    },
  });

  tl.to(sliderItems, {
    clipPath: 'inset(0% 0% 0% 0%)',
    stagger: 0.1,
    ease: 'power2.inOut',
  }).from(missionSection, { opacity: 0, y: 50 }, '<0.25');
}

export function animateHeroServices() {
  const servicesText = document.querySelector('.services-banner__text');
  if (!servicesText) return;

  document.fonts.ready.then(() => {
    SplitText.create(servicesText, {
      type: 'lines',
      linesClass: 'line',
      mask: 'lines',
      onSplit: (self) => {
        return gsap.from(self.lines, {
          duration: 0.6,
          yPercent: 100,
          // opacity: 0,
          stagger: 0.1,
          ease: 'expo.out',
          delay: DELAY,
        });
      },
    });
  });
}

export function animateHeroBooking() {
  const heading = document.querySelector('.booking-main .page-heading');
  const text = document.querySelector('.booking-main__text');
  const button = document.querySelector('.booking-main__button-wrapper');
  const infoText = document.querySelector('.booking-call__info');

  if (!(heading && text && button && infoText)) return;

  gsap.set([heading, text, button, infoText], {
    opacity: 1,
    willChange: 'transform, opacity',
  });

  const tl = gsap.timeline({
    defaults: { ease: 'expo.out', overwrite: 'auto' },
    delay: DELAY,
  });

  document.fonts.ready.then(() => {
    [heading, text].forEach((target, i) => {
      SplitText.create(target, {
        type: 'lines',
        linesClass: 'line',
        mask: i == 0 ? '' : 'lines',
        onSplit: (self) => {
          const t = gsap.from(self.lines, {
            duration: i == 0 ? 0.8 : 0.4,
            yPercent: i == 0 ? 50 : 100,
            rotation: i == 0 ? 3 : 0,
            opacity: i == 0 ? 0 : 1,
            stagger: i == 0 ? 0.12 : 0.08,
          });
          tl.add(t, i * 0.3); // stagger each text group on the main timeline
        },
      });
    });

    tl.from(
      button,
      {
        opacity: 0,
        y: 20,
        duration: 0.8,
      },
      '<0.2',
    ).from(
      infoText,
      {
        opacity: 0,
        duration: 0.8,
      },
      '<0.2',
    );
  });
}
