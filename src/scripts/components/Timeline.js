import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default class Timeline {
  constructor(element) {
    this.element = element;

    gsap.registerPlugin(ScrollTrigger);
    // évite les refresh quand la barre d'Safari apparaît/disparaît
    ScrollTrigger.config({ ignoreMobileResize: true });

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

    // aligne ces valeurs avec ta variable SCSS $breakpoint-sm (768px)
    this.mm = gsap.matchMedia();

    this.mm.add('(min-width: 769px)', () => {
      this.trigger = ScrollTrigger.create({
        trigger: this.scroller,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => this.update(self),
        onRefresh: (self) => this.update(self), // état correct au chargement / resize
      });

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

  update(self) {
    this.fill.style.height = self.progress * 100 + '%';
    const index = Math.min(
      this.points.length - 1,
      Math.floor(self.progress * this.points.length),
    );
    this.setActive(index);
  }

  bindClicks() {
    this.points.forEach((point, index) => {
      point.addEventListener('click', () => this.goTo(index));
    });
  }

  goTo(index) {
    if (this.trigger) {
      // desktop / tablette : on scrolle jusqu'à la position correspondante
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

    const nextSrc = this.points[index].querySelector('.point-img')?.src;
    if (!nextSrc) return;

    // évite que plusieurs fondus se chevauchent (tap / scroll rapide)
    gsap.killTweensOf(this.photoImg);
    gsap.to(this.photoImg, {
      opacity: 0,
      duration: 0.25,
      onComplete: () => {
        this.photoImg.src = nextSrc;
        gsap.to(this.photoImg, { opacity: 1, duration: 0.35 });
      },
    });
  }

  destroy() {
    this.mm?.revert();
  }
}