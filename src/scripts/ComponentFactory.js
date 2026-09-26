import TextAnim from './components/TextAnim.js';
import Scroller from './components/Scroller.js';
import Header from './components/header.js';
import Timeline from './components/Timeline.js';
import HoverImage from './components/HoverImage.js';
import HighlightText from './components/HighlightText.js';
import Ball from './components/Ball.js';

export default class ComponentFactory {
  constructor() {
    this.componentInstances = [];
    this.componentList = {
      Header,
      TextAnim,
      Scroller,
      Timeline,
      HoverImage,
      HighlightText,
      Ball, 
    };
    this.init();
  }
  init() {
    const components = document.querySelectorAll('[data-component]');

    for (let i = 0; i < components.length; i++) {
      const element = components[i];
      const componentName = element.dataset.component;

      if (this.componentList[componentName]) {
        const instance = new this.componentList[componentName](element);
        this.componentInstances.push(instance);
      } else {
        console.log(`La composante ${componentName} n'existe pas`);
      }
    }
  }
}
