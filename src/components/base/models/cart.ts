import { IProduct } from "../../../types/index.ts";
import { IEvents } from "../Events.ts"

export class Cart {
  private items: IProduct[] = [];

  constructor(protected events: IEvents) {}

  getItems(): IProduct[] {
    return [...this.items];
  }

  addItem(product: IProduct): void {
    this.items.push(product);

    this.events.emit('cart:changed');
  }

  removeItem(product: IProduct): boolean {
    const index = this.items.findIndex(item => item.id === product.id);

    if (index !== -1) {
      this.items.splice(index, 1);

      this.events.emit('cart:changed');

      return true;
    }
    return false;
  }

  clear(): void {
    this.items = [];

    this.events.emit('cart:changed');
  }

  getTotalPrice(): number {
  return this.items.reduce((total, product) => {
    return total + (product.price !== null ? product.price : 0);
  }, 0);
  }

  getItemCount(): number {
    return this.items.length;
  }

  hasItem(productId: string): boolean {
    return this.items.some(item => item.id === productId);
  }
}