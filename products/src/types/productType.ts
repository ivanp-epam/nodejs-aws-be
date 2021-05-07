export type ProductType = {
  id: string,
  title: string,
  description?: string,
  price: number,
  count: number // belongs to stocks
};
