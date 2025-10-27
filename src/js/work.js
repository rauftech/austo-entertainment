/**
 * Work page specific JavaScript
 */
import { gsap } from 'gsap';
import { Howl } from 'howler';
import { initBunnyPlayer } from './components/bunnyPlayer';

function initStackingCardsParallax() {
  const cards = document.querySelectorAll('[data-stacking-cards-item]');

  if (cards.length < 2) return;

  cards.forEach((card, i) => {
    // Skip over the first section
    if (i === 0) return;

    // When current section is in view, target the PREVIOUS one
    const previousCard = cards[i - 1];
    if (!previousCard) return;

    // Find any element inside the previous card
    // const previousCardImage = previousCard.querySelector(
    //   '[data-stacking-cards-img]',
    // );

    let tl = gsap.timeline({
      defaults: {
        ease: 'none',
        duration: 1,
      },
      scrollTrigger: {
        trigger: card,
        start: 'top bottom',
        end: 'top top',
        scrub: true,
        invalidateOnRefresh: true,
      },
    });

    tl.fromTo(
      previousCard,
      {
        yPercent: 0,
        filter: 'brightness(100%)',
      },
      {
        yPercent: 50,
        filter: 'brightness(30%)',
      },
    );
    // .from(
    //   card,
    //   {
    //     clipPath: 'inset(30px 60px 0)',
    //   },
    //   '<',
    // );
    // .fromTo(
    //   previousCardImage,
    //   { rotate: 0, yPercent: 0 },
    //   { rotate: -5, yPercent: -25 },
    //   '<',
    // );
  });
}

// Howler music player
function initHowlerJSAudioPlayer() {
  const howlerElements = document.querySelectorAll('[data-howler]');
  const soundInstances = {};

  howlerElements.forEach((element, index) => {
    const uniqueId = `howler-${index}`;
    element.id = uniqueId;
    element.setAttribute('data-howler-status', 'not-playing');

    const audioSrc = element.getAttribute('data-howler-src');
    const durationElement = element.querySelector(
      '[data-howler-info="duration"]',
    );
    const progressTextElement = element.querySelector(
      '[data-howler-info="progress"]',
    );
    const timelineContainer = element.querySelector(
      '[data-howler-control="timeline"]',
    );
    const timelineBar = element.querySelector(
      '[data-howler-control="progress"]',
    );
    const toggleButton = element.querySelector(
      '[data-howler-control="toggle-play"]',
    );

    const sound = new Howl({
      src: [audioSrc],
      html5: true,
      onload: () => {
        if (durationElement)
          durationElement.textContent = formatTime(sound.duration());
        const audioNode = sound._sounds?.[0]?._node;
        if (audioNode) {
          audioNode.addEventListener('pause', () => {
            if (sound.playing()) {
              sound.pause();
            }
          });
          audioNode.addEventListener('play', () => {
            if (!sound.playing()) {
              sound.play();
            }
          });
        }
      },
      onplay: () => {
        pauseAllExcept(uniqueId);
        element.setAttribute('data-howler-status', 'playing');
        requestAnimationFrame(updateProgress);
      },
      onpause: () => element.setAttribute('data-howler-status', 'not-playing'),
      onstop: () => element.setAttribute('data-howler-status', 'not-playing'),
      onend: resetUI,
    });

    soundInstances[uniqueId] = sound;

    function updateProgress() {
      if (!sound.playing()) return;
      updateUI();
      requestAnimationFrame(updateProgress);
    }

    function updateUI() {
      const currentTime = sound.seek() || 0;
      const duration = sound.duration() || 1;
      if (progressTextElement)
        progressTextElement.textContent = formatTime(currentTime);
      if (timelineBar)
        timelineBar.style.width = `${(currentTime / duration) * 100}%`;
      timelineContainer?.setAttribute(
        'aria-valuenow',
        Math.round((currentTime / duration) * 100),
      );
    }

    function resetUI() {
      if (timelineBar) timelineBar.style.width = '100%';
      element.setAttribute('data-howler-status', 'not-playing');
    }

    function seekToPosition(event) {
      const rect = timelineContainer.getBoundingClientRect();
      const percentage = (event.clientX - rect.left) / rect.width;
      sound.seek(sound.duration() * percentage);
      if (!sound.playing()) {
        pauseAllExcept(uniqueId);
        sound.play();
        element.setAttribute('data-howler-status', 'playing');
      }
      updateUI();
    }

    function togglePlay() {
      const isPlaying = sound.playing();
      sound.playing()
        ? sound.pause()
        : (pauseAllExcept(uniqueId), sound.play());
      toggleButton?.setAttribute('aria-pressed', !isPlaying);
    }

    function pauseAllExcept(id) {
      Object.keys(soundInstances).forEach((otherId) => {
        if (otherId !== id && soundInstances[otherId].playing()) {
          soundInstances[otherId].pause();
          document
            .getElementById(otherId)
            ?.setAttribute('data-howler-status', 'not-playing');
        }
      });
    }

    function formatTime(seconds) {
      const minutes = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${minutes}:${secs.toString().padStart(2, '0')}`;
    }

    toggleButton?.addEventListener('click', togglePlay);
    timelineContainer?.addEventListener('click', seekToPosition);
    sound.on('seek', updateUI);
    sound.on('play', updateUI);
  });

  return soundInstances;
}

initStackingCardsParallax();
initHowlerJSAudioPlayer();
initBunnyPlayer();
