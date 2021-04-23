import {PgProductRepository} from "@repositories/pgProductRepository";
import {Connection} from "../db/connection";

export const getProductRepository = async () => {
  return new PgProductRepository(new Connection());
}
