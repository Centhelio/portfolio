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
    this.mm = null;

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

    this.mm = gsap.matchMedia();

    this.mm.add('(min-width: 769px)', () => {
      gsap.to(content, {
        xPercent: -100,
        ease: 'none',
        scrollTrigger: {
          trigger: hero,
          start: 'top top',
          end: '+=100%',
          pin: true,
          scrub: 1,
          // évite le petit saut quand le pin s'enclenche
          anticipatePin: 1,
          // recalcule start/end à chaque resize / refresh
          invalidateOnRefresh: true,
        },
      });
    });

    // Recalcule les positions une fois la page, les images et les polices chargées,
    // pour que le point de départ du pin soit celui de la mise en page finale.
    const refresh = () => ScrollTrigger.refresh();

    if (document.readyState === 'complete') {
      refresh();
    } else {
      window.addEventListener('load', refresh, { once: true });
    }
    document.fonts?.ready.then(refresh);
  }

  destroy() {
    this.mm?.revert();
  }
}