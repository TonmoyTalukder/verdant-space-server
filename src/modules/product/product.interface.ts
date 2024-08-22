export type TSale = {
  onSale: string;
  onSaleDiscountPercentage: number;
};

export type TInventory = {
  quantity: number;
  inStock: boolean;
};

export type TProduct = {
  productId?: string; // Make this optional
  name: string;
  description: string;
  price: number;
  image: string;
  type: string;
  seasonal: string;
  rating: number;
  sale: TSale;
  tags: string[];
  inventory: TInventory;
  isDeleted?: boolean;
};
