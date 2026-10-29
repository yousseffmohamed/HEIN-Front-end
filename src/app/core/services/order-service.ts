import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/env';
import { IOrder, IPayment } from '../models/iuser';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private _http = inject(HttpClient);
  private _apiURL = environment.apiURL;

  createOrder(orderData: any) {
    return this._http.post<{ message: string; data: IOrder }>(this._apiURL + 'orders', orderData);
  }

  getMyOrders() {
    return this._http.get<{ message: string; data: IOrder[] }>(this._apiURL + 'orders/my-orders');
  }

  getOrderById(id: string) {
    return this._http.get<{ data: IOrder }>(this._apiURL + 'orders/' + id);
  }

  getAllOrders() {
    return this._http.get<{ message: string; data: IOrder[] }>(this._apiURL + 'orders');
  }

  updateOrderStatus(id: string, orderStatus: string) {
    return this._http.patch<{ message: string; data: IOrder }>(this._apiURL + `orders/${id}/status`, { orderStatus });
  }

  createPayment(paymentData: any) {
    return this._http.post<{ message: string; data: IPayment }>(this._apiURL + 'payments', paymentData);
  }

  getAllPayments() {
    return this._http.get<{ message: string; data: IPayment[] }>(this._apiURL + 'payments');
  }

  updatePaymentStatus(id: string, status: string) {
    return this._http.patch<{ message: string; data: IPayment }>(this._apiURL + `payments/${id}/status`, { status });
  }
}
