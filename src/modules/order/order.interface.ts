import { TUser } from "../user/user.interface";

export type TPayment = {
  method: string;
  status: string;
  price: number;
}

export type TOrderDetails = {
  status: string;
  delivery: boolean;
  adminApproval: boolean; 
  checkoutStatus: boolean;
};


export type TOrder = {
  userId: string;
  userDetails?: Omit<TUser, 'password'>;
  productId: string;
  address: string;
  payment: TPayment;
  order: TOrderDetails;
  quantity: number;
  isDeleted: boolean;  // Added field for soft deletion
};
