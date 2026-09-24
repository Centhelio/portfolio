import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default class Timeline {
  constructor(element) {
    this.element = element;

    gsap.registerPlugin(ScrollTrigger);
    this.points = gsap.utils.toArray('.point', this.element);
    this.photoImg = this.element.querySelector('#photoImg');
    this.fill = this.element.querySelector('#progressFill');
    this.activeIndex = -1;

    this.init();
    console.log('allo');
  }

  init() {
    this.trigger = ScrollTrigger.create({
      trigger: this.element.querySelector('.scroller'),
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
  }

  setActive(index) {
    if (index === this.activeIndex) return;
    this.activeIndex = index;

    this.points.forEach((p, i) => p.classList.toggle('active', i === index));

    const pointImg = this.points[index].querySelector('.point-img');
    const img = pointImg.src; // .src (pas getAttribute) résout le chemin final via le navigateur/bundler

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
    this.trigger?.kill();
  }
}
