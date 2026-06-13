import { Component } from './base/Component';
import { IEvents } from '../components/base/Events';
import { IProduct } from '../types';
import { categoryMap, CDN_URL } from '../utils/constants';

export class Card extends Component<IProduct> {
  protected title: HTMLElement;
  protected image?: HTMLImageElement;
  protected category?: HTMLElement;
  protected price: HTMLElement;
  protected button?: HTMLButtonElement;

  protected id!: string;

  constructor(
    container: HTMLElement,
    protected events: IEvents
  ) {
    super(container);

    this.title = container.querySelector('.card__title')!;
    this.price = container.querySelector('.card__price')!;

    this.image = container.querySelector('.card__image') ?? undefined;
    this.category = container.querySelector('.card__category') ?? undefined;
    this.button = container.querySelector('.card__button') ?? undefined;

    this.container.addEventListener('click', () => {
      this.events.emit('card:select', { id: this.id });
    });

    if (this.button) {
      this.button.addEventListener('click', (event) => {
        event.stopPropagation();

        this.events.emit('card:action', { id: this.id });
      });
    }
  }

  set titleText(value: string) {
    this.title.textContent = value;
  }

  set productId(value: string) {
    this.id = value;
  }

  set productPrice(value: number | null) {
    this.price.textContent =
      value === null ? 'Бесценно' : `${value} синапсов`;

    if (this.button) {
      this.button.disabled = value === null;

      if (value === null) {
        this.button.textContent = 'Недоступно';
      } else {
        this.button.textContent = 'Купить';
      }
    }
  }

  set inCart(value: boolean) {
    if (!this.button) {
      return;
    }

    this.button.textContent = value ? 'Удалить из корзины' : 'Купить';
  }

  set productCategory(value: string) {
    if (!this.category) {
      return;
    }

    this.category.textContent = value;

    this.category.className = 'card__category';

    const modifier = categoryMap[value as keyof typeof categoryMap];

    if (modifier) {
      this.category.classList.add(modifier);
    }
  }

  set productImage(value: string) {
    if (this.image) {
      this.setImage(this.image, `${CDN_URL}/${value}`, this.title.textContent || '');
    }
  }

  render(data: IProduct): HTMLElement {
    this.productId = data.id;
    this.titleText = data.title;
    this.productPrice = data.price;
    this.productCategory = data.category;
    this.productImage = data.image;

    return super.render();
  }
}