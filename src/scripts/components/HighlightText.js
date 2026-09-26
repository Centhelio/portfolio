import gsap from "gsap";
import { ScrollTrigger } from 'gsap/ScrollTrigger.js';

export default class HighlightText {
  constructor(element) {
    gsap.registerPlugin(ScrollTrigger);
    this.element = element;
    this.init();
  }

  init() {
    const spans = this.element.querySelectorAll('.highlight');

    spans.forEach((span) => {
      const bg = span.querySelector('.highlight-bg');
      if (!bg) return;

      gsap.to(bg, {
        scaleX: 1,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: span,
          start: 'top 85%',
          toggleActions: 'play none none none',
        }
      });
    });
  }
}