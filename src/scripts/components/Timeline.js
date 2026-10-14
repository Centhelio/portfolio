import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Distance de scroll par étape, en hauteurs d'écran (0.6 = 60vh par étape)
const SCROLL_PER_STEP = 0.6;
// Durée du fondu entre deux photos (fraction d'une étape)
const FADE = 0.25;

export default class Timeline {
  constructor(element) {
    this.element = element;

    gsap.registerPlugin(ScrollTrigger);
    // évite les refresh quand la barre d'Safari apparaît/disparaît
    ScrollTrigger.config({ ignoreMobileResize: true });

    this.stage = element.querySelector('.stage');
    this.photo = element.querySelector('.photo');
    this.fill = element.querySelector('#progressFill');
    this.points = gsap.utils.toArray('.point', element);
    this.count = this.points.length;
    this.activeIndex = -1;
    this.st = null;

    this.buildLayers();
    this.bindClicks();
    this.init();
  }

  // Une <img> par étape, empilées dans .photo pour pouvoir faire des fondus enchaînés
  buildLayers() {
    const first = this.element.querySelector('#photoImg');

    this.layers = this.points.map((point, i) => {
      const source = point.querySelector('.point-img');
      const img = i === 0 ? first : first.cloneNode(false);

      img.removeAttribute('id');
      if (source) {
        img.src = source.getAttribute('src');
        img.alt = source.alt;
      }
      if (i > 0) this.photo.appendChild(img);

      return img;
    });
  }

  init() {
    // aligne ces valeurs avec ta variable SCSS $breakpoint-sm (768px)
    this.mm = gsap.matchMedia();

    this.mm.add('(min-width: 769px)', () => {
      this.activeIndex = -1;
      this.buildDesktop();

      return () => {
        this.st = null;
      };
    });

    this.mm.add('(max-width: 768px)', () => {
      this.activeIndex = -1;
      gsap.set(this.layers, { opacity: (i) => (i === 0 ? 1 : 0) });
      this.setActive(0);
    });
  }

  // Desktop / tablette : la section est épinglée, le scroll pilote une timeline
  buildDesktop() {
    const n = this.count;

    gsap.set(this.layers, { opacity: (i) => (i === 0 ? 1 : 0) });

    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: this.stage,
        start: 'top top',
        end: () => `+=${window.innerHeight * SCROLL_PER_STEP * n}`,
        pin: true,
        scrub: 0.6,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        snap: {
          // se cale au centre de l'étape, sauf aux extrémités (pour pouvoir sortir de la section)
          snapTo: (v) => {
            const lo = 0.5 / n;
            const hi = 1 - 0.5 / n;
            if (v <= lo || v >= hi) return v;
            return (Math.round(v * n - 0.5) + 0.5) / n;
          },
          duration: { min: 0.2, max: 0.6 },
          delay: 0.08,
          ease: 'power2.inOut',
        },
        onUpdate: (self) => {
          this.setActive(Math.min(n - 1, Math.floor(self.progress * n)));
        },
      },
    });

    // Barre de progression
    tl.fromTo(this.fill, { scaleY: 0 }, { scaleY: 1, duration: n }, 0);

    // Photos : fondu enchaîné vers la suivante
    this.layers.forEach((layer, i) => {
      if (i < n - 1) {
        tl.to(layer, { opacity: 0, duration: FADE }, i + 1 - FADE);
        tl.to(this.layers[i + 1], { opacity: 1, duration: FADE }, i + 1 - FADE);
      }
    });

    this.st = tl.scrollTrigger;
  }

  bindClicks() {
    this.points.forEach((point, index) => {
      point.addEventListener('click', () => this.goTo(index));
    });
  }

  goTo(index) {
    if (this.st) {
      // desktop : on scrolle jusqu'au centre de l'étape
      const progress = (index + 0.5) / this.count;
      const top = this.st.start + progress * (this.st.end - this.st.start);
      window.scrollTo({ top, behavior: 'smooth' });
    } else {
      // mobile : pas de scroll, juste le changement d'état/image
      this.setActive(index);
    }
  }

  setActive(index) {
    if (index === this.activeIndex) return;
    this.activeIndex = index;

    this.points.forEach((p, i) => p.classList.toggle('active', i === index));

    // Sur desktop, les photos sont pilotées par la timeline ; sur mobile on fait le fondu ici
    if (!this.st) {
      gsap.to(this.layers, {
        opacity: (i) => (i === index ? 1 : 0),
        duration: 0.5,
        ease: 'power1.out',
        overwrite: true,
      });
    }
  }

  destroy() {
    this.mm?.revert();
  }
}