import gsap from "gsap";

export default class PageTransition {
  constructor(element) {
    this.overlay = element;
    this.rects = element.querySelectorAll('.page-transition__rect');
    this.init();
  }

  init() {
    this.playEnter();

    const links = document.querySelectorAll('a[href$=".html"], a[href="/"]');
    links.forEach((link) => {
      link.addEventListener('click', (e) => this.handleClick(e, link));
    });
  }

  playEnter() {
    // Les rectangles se rétractent vers le haut (origin: top), révélant le contenu
    gsap.set(this.rects, { transformOrigin: 'top' });
    gsap.to(this.rects, {
      scaleY: 0,
      duration: 0.6,
      stagger: 0.08,
      ease: 'power2.inOut',
    });
  }

  handleClick(e, link) {
    const href = link.getAttribute('href');

    if (link.target === '_blank' || href.startsWith('#')) return;

    e.preventDefault();

    // Les rectangles descendent (grandissent depuis le haut) pour couvrir l'écran
    gsap.set(this.rects, { transformOrigin: 'top' });
    gsap.to(this.rects, {
      scaleY: 1,
      duration: 0.6,
      stagger: 0.08,
      ease: 'power2.inOut',
      onComplete: () => {
        window.location.href = href;
      }
    });
  }
}