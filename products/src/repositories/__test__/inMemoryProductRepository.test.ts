import {InMemoryProductRepository} from "../inMemoryProductRepository";
import {ProductType} from "../../types/productType";

const productRepository = new InMemoryProductRepository();

describe('Product repository', () => {

  describe('Find method', () => {
    it('Should return the list of products', async () => {
      const products: ProductType[] = await productRepository.find();
      expect(products.length).toBeGreaterThan(0);
    });
  });

  describe('GetById method', () => {
    it('Should return an entity if the provided ID exists', async () => {
      const ID = '2';
      const product = await productRepository.getById(ID);
      expect(product.id).toContain(ID);
    });

    it("Should throw an exception if the provided ID doesn't exists", async () => {
      const ID = '12345789';
      await expect(() => productRepository.getById(ID)).rejects.toThrowError();
    });
  });
});
