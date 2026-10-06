import Swiper from 'swiper/bundle';

export default class Carousel {
  constructor(element) {
    this.element = element;

    this.options = {
      slidesPerView: 2,
      spaceBetween: 10,
      
      // Responsive breakpoints
      breakpoints: {
        // When window width is >= 640px
        640: {
          slidesPerView: 2,
          spaceBetween: 10,
        },
        // When window width is >= 768px
        768: {
          slidesPerView: 3,
          spaceBetween: 10,
        },
        // When window width is >= 1024px
        1024: {
          slidesPerView: 3,
          spaceBetween: 10,
        },
      },

      pagination: {
        el: this.element.querySelector('.swiper-pagination'),
        clickable: true,
      },
    };

    this.init();
  }

  init() {
    new Swiper(this.element, this.options);
  }
}
