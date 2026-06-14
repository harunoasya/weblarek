import { Component } from './base/Component';

interface IBaseCard {
  title: string;
  price: number | null;
}

export class BaseCard<T> extends Component<T> {
  protected title: HTMLElement;
  protected price: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);

    this.title = container.querySelector('.card__title')!;
    this.price = container.querySelector('.card__price')!;
  }

  set titleText(value: string) {
    this.title.textContent = value;
  }

  set productPrice(value: number | null) {
    this.price.textContent =
      value === null
        ? 'Бесценно'
        : `${value} синапсов`;
  }
}