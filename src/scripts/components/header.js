export default class Header {
    constructor(element) {
        this.element = element;
        this.options = {
            threshold: 0.1,
            alwaysShow: false,
        };
        this.lastScrollPosition = 0;
        this.scrollPosition = 0;
        this.html = document.documentElement;
        this.toggle = null;

        this.initNavMobile();
        this.init();
    }

    init() {
        this.setOptions();

        //if(!this.options.alwaysShow) {
        window.addEventListener('scroll', this.onScroll.bind(this), { passive: true });
        //}
    }

    setOptions() {
        if ('alwaysShow' in this.element.dataset) {
            this.options.alwaysShow = true;
        }

        if ('threshold' in this.element.dataset) {
            this.options.threshold = Number(this.element.dataset.threshold);
        }
    }

    onScroll() {
        this.lastScrollPosition = this.scrollPosition;
        this.scrollPosition = document.scrollingElement.scrollTop;

        this.setHeaderState();
        this.setDirections();
    }

    setHeaderState() {
        if (this.scrollPosition > document.scrollingElement.scrollHeight * this.options.threshold) {
            if (this.options.alwaysShow == false) {
                //voire ligne 19 pour version plus optimiser
                this.html.classList.add('header-is-hidden');
            }
        } else {
            this.html.classList.remove('header-is-hidden');
        }
    }

    setDirections() {
        if (this.scrollPosition >= this.lastScrollPosition) {
            //Scroll ver le bas
            this.html.classList.add('is-scrolling-down');
            this.html.classList.remove('is-scrolling-up');
        } else {
            //Scroll ver le haut
            this.html.classList.remove('is-scrolling-down');
            this.html.classList.add('is-scrolling-up');
        }
    }

    initNavMobile() {
        this.toggle = this.element.querySelector('.js-toggle');
        if (!this.toggle) return;

        this.toggle.setAttribute('aria-expanded', 'false');
        this.toggle.addEventListener('click', this.onToggleNav.bind(this));

        // Ferme le menu quand on clique sur un lien (menu ou hub)
        this.element.querySelectorAll('.nav-primary a, .nav__contact a').forEach((link) => {
            link.addEventListener('click', () => this.setNavState(false));
        });

        // Touche Échap : ferme le menu
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') this.setNavState(false);
        });

        // Passage en desktop (le burger est caché) : on referme le menu
        window.addEventListener('resize', () => {
            if (getComputedStyle(this.toggle).display === 'none') {
                this.setNavState(false);
            }
        });
    }

    onToggleNav() {
        this.setNavState(!this.html.classList.contains('nav-is-active'));
    }

    setNavState(isOpen) {
        this.html.classList.toggle('nav-is-active', isOpen);
        this.toggle?.setAttribute('aria-expanded', String(isOpen));
    }
}