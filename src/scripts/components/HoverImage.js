import gsap from "gsap";

export default class HoverImage {
  constructor(element) {
    this.element = element;
    this.init();
  }

  init() {
    const hoverTexts = this.element.querySelectorAll('.hover-text');

    hoverTexts.forEach((textEl) => {
      const key = textEl.dataset.hover;
      const imageContainer = document.querySelector(`.hover-image[data-hover="${key}"]`);

      if (!imageContainer) {
        console.warn(`Aucune .hover-image trouvée pour data-hover="${key}"`);
        return;
      }

        gsap.set(imageContainer, {
            yPercent: -50,
            xPercent: -50,
            opacity: 0,
            position: 'fixed',
            top: 0,
            left: 0,
            visibility: 'hidden',
            clipPath: 'circle(0% at 50% 50%)',
        });

        this.setupHover(textEl, imageContainer);
    });
  }

  setupHover(textEl, imageContainer) {
  const setX = gsap.quickSetter(imageContainer, "x", "px");
  const setY = gsap.quickSetter(imageContainer, "y", "px");
  const align = (e) => { setX(e.clientX); setY(e.clientY); };
  const startFollow = () => document.addEventListener("mousemove", align);
  const stopFollow = () => document.removeEventListener("mousemove", align);

  const fade = gsap.to(imageContainer, {
    autoAlpha: 1,
    clipPath: 'circle(100% at 50% 50%)',
    duration: 0.5, 
    paused: true,
    onReverseComplete: stopFollow
  });

  textEl.addEventListener('mouseenter', (e) => {
    fade.play();
    startFollow();
    align(e);
    this.element.querySelectorAll('.intro-text span').forEach(span => {
      if (span !== textEl) span.style.opacity = '1';
    });
    textEl.style.opacity = '1';
  });

  textEl.addEventListener('mouseleave', () => {
    fade.reverse();

  });
}
}