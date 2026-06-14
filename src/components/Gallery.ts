import { Component } from './base/Component';

interface IGallery {
  items: HTMLElement[];
}

export class Gallery extends Component<IGallery> {
  protected gallery: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);

    this.gallery = container;
  }

  set items(items: HTMLElement[]) {
    this.gallery.replaceChildren(...items);
  }
}