import products from "./products.json"
import {ProductType} from "../types/productType";

const productsTypes: ProductType[] = products;

export const find = async (): Promise<ProductType[]> => Promise.resolve(productsTypes);

/**
 * Find product by its ID
 * @param id
 * @throws Error
 */
export const getById = async (id: string): Promise<ProductType> => {
  const resultProduct = productsTypes.find((el) => el.id === id);
  if (!resultProduct) {
    throw new Error(`Product ${id} not found`);
  }

  return Promise.resolve(resultProduct);
}
