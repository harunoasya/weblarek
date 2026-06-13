import { Component } from '../components/base/Component';
import { IEvents } from '../components/base/Events';

interface IPage {
  counter: number;
  catalog: HTMLElement[];
}

export class Page extends Component<IPage> {
  protected gallery: HTMLElement;
  protected basketButton: HTMLButtonElement;
  protected basketCounter: HTMLElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this.gallery = container.querySelector('.gallery')!;
    this.basketButton = container.querySelector('.header__basket')!;
    this.basketCounter = container.querySelector('.header__basket-counter')!;

    this.basketButton.addEventListener('click', () => {
      this.events.emit('basket:open');
    });
  }

  set counter(value: number) {
    this.basketCounter.textContent = String(value);
  }

  set catalog(items: HTMLElement[]) {
    this.gallery.replaceChildren(...items);
  }
}