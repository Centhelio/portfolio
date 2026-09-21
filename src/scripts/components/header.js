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

        this.initNavMobile();
        this.init();
    }

    init() {
        this.setOptions();
                    
        //if(!this.options.alwaysShow) {
            window.addEventListener('scroll', this.onScroll.bind(this));
        //}
    }

    setOptions() {
        if ('alwaysShow' in this.element.dataset) {
            this.options.alwaysShow = true;
        }

        if('threshold' in this.element.dataset){
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
            if(this.options.alwaysShow == false) { //voire ligne 19 pour version plus optimiser
                this.html.classList.add('header-is-hidden');
            }
        } 
        else {
            this.html.classList.remove('header-is-hidden');
        }

    }

    setDirections() {
        if (this.scrollPosition >= this.lastScrollPosition){
            //Scroll ver le bas
            this.html.classList.add('is-scrolling-down');
            this.html.classList.remove('is-scrolling-up');
        } 
        else {
            //Scroll ver le haut 
            this.html.classList.remove('is-scrolling-down');
            this.html.classList.add('is-scrolling-up');
        }
    }

    initNavMobile() {
        const toggle = this.element.querySelector('.js-toggle');
        toggle.addEventListener('click', this.onToggleNav.bind(this));
    }

    onToggleNav() {
        this.html.classList.toggle('nav-is-active');
    }
}