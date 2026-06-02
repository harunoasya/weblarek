import { IProduct } from "../../../types/index.ts";

export class Catalog {
  private products: IProduct[] = [];
  private selectedProduct: IProduct | null = null;

  setProducts(products: IProduct[]): void {
    this.products = [...products];
  }

  getProducts(): IProduct[] {
    return [...this.products];
  }

  getProduct(productId: string): IProduct | undefined {
    return this.products.find(product => product.id === productId);
  }

  setPrewiew(product: IProduct): void {
    this.selectedProduct = product;
  }

  getPrewiew(): IProduct | null {
    return this.selectedProduct;
  }
}