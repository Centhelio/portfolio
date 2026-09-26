import gsap from "gsap";

export default class Ball {
    constructor(element) {
        this.element = element;
        this.ball = document.querySelector('.cursor__ball');

        this.init();
    }

    init() {
        gsap.set(this.ball, { xPercent: -50, yPercent: -50 });

        // Crée UNE SEULE FOIS les fonctions de tween réutilisables
        this.xTo = gsap.quickTo(this.ball, "x", { duration: 0.5, ease: "power2.out" });
        this.yTo = gsap.quickTo(this.ball, "y", { duration: 0.5, ease: "power2.out" });

        this.onMouseMove = this.onMouseMove.bind(this);
        window.addEventListener("mousemove", this.onMouseMove);

        const watchs = document.querySelectorAll('[data-interactive]');
        watchs.forEach((watch) => {
            watch.addEventListener('mouseenter', this.addActive.bind(this));
            watch.addEventListener('mouseleave', this.removeActive.bind(this));
        });
    }

    onMouseMove(e) {
        this.xTo(e.clientX);
        this.yTo(e.clientY);
    }

    addActive() {
        this.ball.classList.add('is-active');
    }

    removeActive() {
        this.ball.classList.remove('is-active');
    }
}