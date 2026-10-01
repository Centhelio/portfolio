import gsap from 'gsap';

export default class Ball {
  constructor(element) {
    this.element = element;
    this.ball = document.querySelector('.cursor__ball');
    this.textSpan = this.ball.querySelector('.cursor__ball-text-span');

    this.init();
  }

  init() {
    gsap.set(this.ball, { xPercent: -50, yPercent: -50 });

    this.xTo = gsap.quickTo(this.ball, 'x', {
      duration: 0.5,
      ease: 'power2.out',
    });
    this.yTo = gsap.quickTo(this.ball, 'y', {
      duration: 0.5,
      ease: 'power2.out',
    });

    this.onMouseMove = this.onMouseMove.bind(this);
    window.addEventListener('mousemove', this.onMouseMove);

    const watchs = document.querySelectorAll('[data-interactive]');
    watchs.forEach((watch) => {
      watch.addEventListener('mouseenter', () => this.addActive(watch));
      watch.addEventListener('mouseleave', this.removeActive.bind(this));
    });
  }

  onMouseMove(e) {
    this.xTo(e.clientX);
    this.yTo(e.clientY);
  }

  addActive(target) {
    this.ball.classList.add('is-active');
    this.textSpan.textContent = target.dataset.cursorText || '';
  }

  removeActive() {
    this.ball.classList.remove('is-active');
  }
}
