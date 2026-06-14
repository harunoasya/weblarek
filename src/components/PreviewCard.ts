import { ProductCard } from './ProductCard';
import { IProduct } from '../types';

export class PreviewCard extends ProductCard<IProduct> {
  protected button: HTMLButtonElement;

  constructor(
    container: HTMLElement,
    private onAction: () => void
  ) {
    super(container);

    this.button = container.querySelector('.card__button')!;

    this.button.addEventListener('click', () => {
      this.onAction();
    });
  }

  set buttonDisabled(value: boolean) {
    this.button.disabled = value;
  }

  set buttonText(value: string) {
    this.button.textContent = value;
  }

  render(data: IProduct): HTMLElement {
    this.titleText = data.title;
    this.productPrice = data.price;
    this.productCategory = data.category;
    this.productImage = data.image;

    return super.render();
  }
}