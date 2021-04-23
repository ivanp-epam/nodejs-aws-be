import {ProductType} from "../../types/productType";
import {Connection} from "../../db/connection";
import {PgProductRepository} from "../PgProductRepository";

const connectMock = jest.fn();
const queryMock = jest.fn();
const endMock = jest.fn();

const mock = {
  connect: connectMock,
  query: queryMock,
  end: endMock,
};

const connection = {
  connect: async () => mock
};

const productRepository = new PgProductRepository((connection as any) as Connection);

describe('Product repository', () => {
  beforeAll(() => { // get rid of async
    jest.clearAllMocks();
  });

  describe('Find method', () => {
    it('Should return the list of products', async () => {
      const productMock = {
        id: "asd",
        title: "qwe",
        description: 'desc',
        price: 123,
        count: 321
      };

      queryMock.mockReturnValueOnce({
        rows: [
          productMock
        ]
      });

      const products: ProductType[] = await productRepository.find();
      expect(queryMock).toHaveBeenCalledTimes(1);
      expect(endMock).toHaveBeenCalledTimes(1);

      expect(products).toStrictEqual([productMock])
    });
  });

  describe('GetById method', () => {
    it('Should return an entity if the provided ID exists', async () => {
      const ID = "asd";
      const productMock = {
        id: ID,
        title: "qwe",
        description: 'desc',
        price: 123,
        count: 321
      };

      queryMock.mockReturnValueOnce({
        rows: [
          productMock
        ]
      });

      const product = await productRepository.getById(ID);
      expect(product.id).toContain(ID);
    });

    it("Should throw an exception if the provided ID doesn't exists", async () => {
      const ID = '12345789';
      queryMock.mockReturnValueOnce({
        rows: []
      });
      await expect(() => productRepository.getById(ID)).rejects.toThrowError();
    });
  });

  describe('add method', () => {
    it('Should return product', async () => {
      const productInput = {
        title: "qwe",
        description: 'desc',
        price: 123,
        count: 321
      };

      const ID = "asdqwe";

      queryMock.mockReturnValue({
        rows: [
          {
            id: ID,
            ...productInput
          }
        ]
      });

      const productResult: ProductType = await productRepository.add(productInput as ProductType);

      expect(queryMock).toHaveBeenCalledWith('BEGIN');
      expect(queryMock).toHaveBeenCalledWith('COMMIT');
      expect(endMock).toHaveBeenCalledTimes(1);

      expect(productResult.id).toBe(ID)
    });
  });

});
