create extension if not exists "uuid-ossp";

CREATE TABLE products
(
    id          uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    title       text not null,
    description text,
    price       integer
);

CREATE TABLE stocks
(
    id         serial PRIMARY KEY,
    product_id uuid,
    count      integer
);

COMMENT ON COLUMN stocks.product_id IS 'foreign key from products.id';

COMMENT ON COLUMN stocks.count IS 'There are no more products than this count in stock';

ALTER TABLE stocks
    ADD CONSTRAINT fk_stocks_products FOREIGN KEY (product_id) REFERENCES products (id);
