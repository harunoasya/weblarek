import { ProductCard } from './ProductCard';
import { IProduct } from '../types';

export class CatalogCard extends ProductCard<IProduct> {
  constructor(
    container: HTMLElement,
    private onClick: () => void
  ) {
    super(container);

    this.container.addEventListener('click', () => {
      this.onClick();
    });
  }

  render(data: IProduct): HTMLElement {
    this.titleText = data.title;
    this.productPrice = data.price;
    this.productCategory = data.category;
    this.productImage = data.image;

    return super.render();
  }
}