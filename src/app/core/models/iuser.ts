export interface IAddress {
  _id?: string;
  title?: string;
  country: string;
  city: string;
  street: string;
  building: string;
  floor: string;
  apartment: string;
  isDefault?: boolean;
}

export interface IUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: 'customer' | 'admin';
  addresses?: IAddress[];
}

export interface IAuthResponse {
  message: string;
  data: {
    token: string;
    user: IUser;
  } | string;
}

export interface IOrderItem {
  product: string;
  productName: string;
  quantity: number;
  productPrice: number;
  productMainPic?: string;
}

export interface IOrder {
  _id: string;
  user: any;
  products: IOrderItem[];
  totalItems: number;
  subtotal: number;
  shippingCost: number;
  discounts: number;
  total: number;
  orderStatus: 'placed' | 'delivered' | 'cancelled' | 'preparing' | 'delivering';
  shippingAddress: IAddress;
  createdAt: string;
}

export interface IPayment {
  _id: string;
  user: any;
  order: any;
  amount: number;
  currency: string;
  paymentMethod: string;
  status: 'completed' | 'refunded' | 'failed' | 'cancelled' | 'pending';
  transactionId?: string;
  createdAt: string;
}
