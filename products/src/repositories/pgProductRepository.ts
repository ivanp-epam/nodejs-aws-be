import console from "console";
import {ProductRepository} from "@repositories/productRepository";
import {ProductType} from "../types/productType";
import {NotFoundError} from "../errors/notFoundError";
import {Connection} from "../db/connection";

export class PgProductRepository implements ProductRepository {

  private fetchSQLString = `
    SELECT p.id,
           p.title,
           p.description,
           p.price,
           s.count
    FROM products p
    INNER JOIN stocks s
               ON s.product_id = p.id`;

  private insertProductTemplate = `
    insert into products (title, description, price)
    values ($1, $2, $3)
    returning *
  `;

  private insertStockTemplate = `
    insert into stocks (product_id, count)
    values ($1, $2)
  `;

  private readonly connection: Connection;

  constructor(client: Connection) {
    console.debug('PgProductRepository has created');
    this.connection = client;
  }

  public async find(): Promise<ProductType[]> {
    console.debug('PgProductRepository::find() has called');

    const client = await this.connection.connect();
    const {rows} = await client.query<ProductType>(this.fetchSQLString);

    console.debug(`PgProductRepository::find() returned ${rows.length} rows`);

    await client.end();

    return rows;
  }

  public async getById(id: string): Promise<ProductType> {
    console.debug(`PgProductRepository::getById() has called with id:${id}`);
    const client = await this.connection.connect();
    const {rows} = await client.query<ProductType>(
      `${this.fetchSQLString} where p.id = $1 limit 1`, [id]
    );

    await client.end();
    const result = rows[0];

    if (!result) {
      console.debug(`PgProductRepository::getById() with id:${id} has returned 0 results`);
      throw new NotFoundError(`Product ${id} not found`);
    }

    return result;
  }

  public async add(product: ProductType): Promise<ProductType> {
    console.debug(`PgProductRepository::add() with product:${JSON.stringify(product)} has returned called`);
    const client = await this.connection.connect();
    await client.query('BEGIN');

    try {
      const {rows: [returningProduct]} = await client.query<ProductType>(
        this.insertProductTemplate, [product.title, product.description, product.price]
      );
      await client.query(this.insertStockTemplate, [returningProduct.id, product.count]);
      await client.query('COMMIT');

      console.debug(`PgProductRepository::add() with product:${JSON.stringify(product)} has committed`);

      returningProduct.count = product.count;

      return returningProduct;
    } catch (err) {
      console.debug(`PgProductRepository::add() with product:${JSON.stringify(product)} has raised error ROLLBACK`);
      await client.query('ROLLBACK');
      throw err;
    } finally {
      await client.end();
    }
  }
}
