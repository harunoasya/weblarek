import { Component } from './base/Component';
import { IEvents } from './base/Events';

interface IBasketItem {
  id: string;
  title: string;
  price: number;
  index: number;
}

export class BasketItem extends Component<IBasketItem> {
  protected title: HTMLElement;
  protected price: HTMLElement;
  protected indexElement: HTMLElement;
  protected deleteButton: HTMLButtonElement;

  protected id!: string;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this.title = container.querySelector('.card__title')!;
    this.price = container.querySelector('.card__price')!;
    this.indexElement = container.querySelector('.basket__item-index')!;
    this.deleteButton = container.querySelector('.basket__item-delete')!;

    this.deleteButton.addEventListener('click', () => {
      this.events.emit('basket:remove', {
        id: this.id,
      });
    });
  }

  set itemId(value: string) {
    this.id = value;
  }

  set itemTitle(value: string) {
    this.title.textContent = value;
  }

  set itemPrice(value: number) {
    this.price.textContent = `${value} синапсов`;
  }

  set itemIndex(value: number) {
    this.indexElement.textContent = String(value);
  }

  render(data: IBasketItem): HTMLElement {
    this.itemId = data.id;
    this.itemTitle = data.title;
    this.itemPrice = data.price;
    this.itemIndex = data.index;

    return super.render();
  }
}