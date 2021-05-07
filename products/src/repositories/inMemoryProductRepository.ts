import products from "./products.json"
import {ProductType} from "../types/productType";
import {ProductRepository} from "@repositories/productRepository";
import {NotFoundError} from "../errors/notFoundError";
import {v4 as uuidv4} from "uuid";

const productsTypes: ProductType[] = products;

export class InMemoryProductRepository implements ProductRepository {
  async find(): Promise<ProductType[]> {
    return Promise.resolve(productsTypes);
  }

  async getById(id: string): Promise<ProductType> {
    const resultProduct = productsTypes.find((el) => el.id === id);
    if (!resultProduct) {
      throw new NotFoundError(`Product ${id} not found`);
    }

    return Promise.resolve(resultProduct);
  }

  async add(product: ProductType): Promise<ProductType> {
    product.id = uuidv4();
    products.push(product as any);

    return Promise.resolve(product);
  }
}
