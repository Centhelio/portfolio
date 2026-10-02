import { gsap } from 'gsap';
import { ScrollSmoother } from 'gsap/ScrollSmoother.js';
import { ScrollTrigger } from 'gsap/ScrollTrigger.js';

// Besion de 2 classe html
//<div id="smooth-wrapper">
//<div id="smooth-content">

export default class Scroller {
  constructor(element) {
    gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
    this.options = {
      hasSkew: false,
      hasPinItems: false,
    };

    this.element = element;

    this.setOptions();
  }

  setOptions() {
    if (this.element.querySelector('.js-horiz')) {
      this.initHero();
    }
  }

  initHero() {
    const hero = this.element.querySelector('.js-horiz');
    const content = hero.querySelector('.hero__content');
    const media = hero.querySelector('.hero__media');

    const mm = gsap.matchMedia();

    mm.add('(min-width: 769px)', () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: hero,
          start: 'top top',
          end: '+=100%',
          pin: true,
          scrub: 1,
        },
      });

      tl.to(content, { xPercent: -30, opacity: 1, ease: 'none' }, 0)
        .to(media, { width: '100%', ease: 'none' }, 0);
    });
  }
}
