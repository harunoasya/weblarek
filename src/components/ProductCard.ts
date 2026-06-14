import { BaseCard } from './BaseCard';
import { CDN_URL, categoryMap } from '../utils/constants';

export class ProductCard<T> extends BaseCard<T> {
  protected image: HTMLImageElement;
  protected category: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);

    this.image = container.querySelector('.card__image')!;
    this.category = container.querySelector('.card__category')!;
  }

  set productImage(value: string) {
    this.setImage(
      this.image,
      `${CDN_URL}/${value}`,
      this.title.textContent || ''
    );
  }

  set productCategory(value: string) {
    this.category.textContent = value;

    this.category.className = 'card__category';

    const modifier =
      categoryMap[value as keyof typeof categoryMap];

    if (modifier) {
      this.category.classList.add(modifier);
    }
  }
}