import { IProduct } from "../../../types/index.ts";
import { IEvents } from "../Events.ts"

export class Catalog {
  private products: IProduct[] = [];
  private selectedProduct: IProduct | null = null;

  constructor(protected events: IEvents) {}

  setProducts(products: IProduct[]): void {
    this.products = [...products];

    this.events.emit('catalog:changed');
  }

  getProducts(): IProduct[] {
    return [...this.products];
  }

  getProduct(productId: string): IProduct | undefined {
    return this.products.find(product => product.id === productId);
  }

  setPreview(product: IProduct): void {
    this.selectedProduct = product;

    this.events.emit('catalog:selected');
  }

  getPreview(): IProduct | null {
    return this.selectedProduct;
  }
}