import { IProduct } from './iproduct';

export interface IDeal {
  _id: string;
  title: string;
  description?: string;
  product: IProduct;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  originalPrice: number;
  discountPrice: number;
  startDate: string | Date;
  endDate: string | Date;
  isActive: boolean;
  banner?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IDealsRes {
  message: string;
  count?: number;
  data: IDeal[];
}

export interface IDealRes {
  message: string;
  data: IDeal;
}
