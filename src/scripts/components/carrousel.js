import Swiper from 'swiper/bundle';

export default class Carousel {
  constructor(element) {
    this.element = element;

    this.options = {
      slidesPerView: 3,
      spaceBetween: 0,

      // Pagination bullets
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
