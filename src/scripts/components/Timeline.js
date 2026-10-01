import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default class Timeline {
  constructor(element) {
    this.element = element;

    gsap.registerPlugin(ScrollTrigger);
    this.points = gsap.utils.toArray('.point', this.element);
    this.photoImg = this.element.querySelector('#photoImg');
    this.fill = this.element.querySelector('#progressFill');
    this.scroller = this.element.querySelector('.scroller');
    this.activeIndex = -1;
    this.trigger = null;

    this.init();
  }

  init() {
    this.bindClicks();

    // bascule automatique selon le breakpoint — aligne cette valeur
    // avec ta variable SCSS $breakpoint-sm
    this.mm = gsap.matchMedia();

    this.mm.add('(min-width: 769px)', () => {
      this.trigger = ScrollTrigger.create({
        trigger: this.scroller,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => {
          this.fill.style.height = self.progress * 100 + '%';
          const index = Math.min(
            this.points.length - 1,
            Math.floor(self.progress * this.points.length),
          );
          this.setActive(index);
        },
      });

      this.setActive(0);

      // cleanup quand on repasse en-dessous du breakpoint
      return () => {
        this.trigger?.kill();
        this.trigger = null;
      };
    });

    this.mm.add('(max-width: 768px)', () => {
      this.fill.style.height = '0%';
      this.setActive(0);
    });
  }

  bindClicks() {
    this.points.forEach((point, index) => {
      point.addEventListener('click', () => this.goTo(index));
    });
  }

  goTo(index) {
    if (this.trigger) {
      // desktop : on scroll jusqu'à la position correspondante,
      // ScrollTrigger reprend la main ensuite tout seul
      const progress = (index + 0.5) / this.points.length;
      const target =
        this.trigger.start + progress * (this.trigger.end - this.trigger.start);
      window.scrollTo({ top: target, behavior: 'smooth' });
    } else {
      // mobile : pas de scroll, juste le changement d'état/image
      this.setActive(index);
    }
  }

  setActive(index) {
    if (index === this.activeIndex) return;
    this.activeIndex = index;

    this.points.forEach((p, i) => p.classList.toggle('active', i === index));

    const pointImg = this.points[index].querySelector('.point-img');
    const img = pointImg.src;

    gsap.to(this.photoImg, {
      opacity: 0,
      duration: 0.25,
      onComplete: () => {
        this.photoImg.src = img;
        gsap.to(this.photoImg, { opacity: 1, duration: 0.35 });
      },
    });
  }

  destroy() {
    this.mm?.revert();
  }
}
