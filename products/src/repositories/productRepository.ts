import {ProductType} from "../types/productType";

export interface ProductRepository {
  find(): Promise<ProductType[]>;

  getById(id: string): Promise<ProductType>;

  add(product: ProductType): Promise<ProductType>;
}
