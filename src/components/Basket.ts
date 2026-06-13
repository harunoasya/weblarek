import { Component } from '../components/base/Component';
import { IEvents } from '../components/base/Events';

interface IBasket {
  items: HTMLElement[];
  total: number;
}

export class Basket extends Component<IBasket> {
  protected list: HTMLElement;
  protected totalPrice: HTMLElement;
  protected orderButton: HTMLButtonElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this.list = container.querySelector('.basket__list')!;
    this.totalPrice = container.querySelector('.basket__price')!;
    this.orderButton = container.querySelector('.basket__button')!;

    this.orderButton.addEventListener('click', () => {
      this.events.emit('basket:order');
    });
  }

  set items(items: HTMLElement[]) {
    if (items.length) {
      this.list.replaceChildren(...items);
    } else {
      this.list.replaceChildren();
      this.list.textContent = 'Корзина пуста';
    }

    this.orderButton.disabled = items.length === 0;
  }

  set total(value: number) {
    this.totalPrice.textContent = `${value} синапсов`;
  }
}