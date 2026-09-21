// Étpae 1
//npm i gspa

// Étape 2
import { gsap } from 'gsap';

//Étape 4 (Plugin au besion) --> voir documentation sur gsap
import { SplitText } from 'gsap/SplitText.js';

export default class TextAnim {
  constructor(element) {
    //Étape 4
    gsap.registerPlugin(SplitText);

    this.element = element;

    // L'animation se fait une fois
    this.options = {
      repeat: false,
    };

    // Étape 3 (Animation Linéaire)
    /*  gsap.from(this.element, {
      duration: 1,
      y: '100',
      alpha: 0,
      delay: 0.25,
      ease: 'expo.out',
    }); */

    // Seulement quand autoSplit
    document.fonts.ready.then(this.init.bind(this));
  }

  init() {
    this.setOptions();
    // Étape 5
    this.split = SplitText.create(this.element, {
      mask: 'chars',
      type: 'chars, words, lines',
      autoSplit: true, //important pour le responsive, mais besion que fonts soient loaded
    });

    //Étape 6
    this.initAnim();

    // Étape 9
    this.initOberserver();
  }

  initOberserver() {
    const observer = new IntersectionObserver(this.watch.bind(this), {
      rootMagin: '0px 0px 0px 0px',
    });
    observer.observe(this.element);
  }

  watch(entries, observer) {
    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i];
      const target = entry.target;

      if (entry.isIntersecting) {
        this.anim(true);

        // L'animation se fait une fois
        if (!this.options.repeat) observer.unobserve(target);
      } else {
        this.anim(false);
      }
    }
  }

  // Étape 6 (Animation Linéaire)
  initAnim() {
    /* gsap.from(this.split.chars, {
        duration: 1,
        yPercent: 'random([-100, 100])',
        alpha: 0,
        delay: 0.25,
        stagger: 0.05, //rajoute delay entre chaque animation, petite valeur = importante
        ease: 'expo.out',
        }); */

    gsap.set(this.split.chars, {
      yPercent: 'random([-100, 100])',
      autoAlpha: 0, //met display: none; quand alpha = 0
    });
  }

  anim(isAnimIn) {
    const alpha = isAnimIn ? 1 : 0;
    const y = isAnimIn ? 0 : 'random([-100, 100])';

    gsap.to(this.split.chars, {
      duration: 1,
      yPercent: y,
      autoAlpha: alpha,
      delay: 0.25,
      stagger: 0.05,
      ease: 'expo.out',
    });
  }

  // L'animation se fait une fois
  setOptions() {
    if ('repeat' in this.element.dataset) {
      this.options.repeat = true;
    }
  }
}
