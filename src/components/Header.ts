import { Component } from './base/Component';
import { IEvents } from './base/Events';

interface IHeader {
  counter: number;
}

export class Header extends Component<IHeader> {
  protected basketButton: HTMLButtonElement;
  protected basketCounter: HTMLElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this.basketButton = container.querySelector('.header__basket')!;
    this.basketCounter = container.querySelector(
      '.header__basket-counter'
    )!;

    this.basketButton.addEventListener('click', () => {
      this.events.emit('basket:open');
    });
  }

  set counter(value: number) {
    this.basketCounter.textContent = String(value);
  }
}