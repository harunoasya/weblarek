import { IEvents } from './base/Events';
import { BaseCard } from './BaseCard';

interface IBasketItem {
  title: string;
  price: number;
  index: number;
}

export class BasketItem extends BaseCard<IBasketItem> {
  protected title: HTMLElement;
  protected price: HTMLElement;
  protected indexElement: HTMLElement;
  protected deleteButton: HTMLButtonElement;

  constructor(container: HTMLElement, onDelete: () => void) {
    super(container);

    this.title = container.querySelector('.card__title')!;
    this.price = container.querySelector('.card__price')!;
    this.indexElement = container.querySelector('.basket__item-index')!;
    this.deleteButton = container.querySelector('.basket__item-delete')!;

    this.deleteButton.addEventListener('click', () => {
      onDelete();
    });
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
    this.itemTitle = data.title;
    this.itemPrice = data.price;
    this.itemIndex = data.index;

    return super.render();
  }
}