import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { OrderService } from '../../core/services/order-service';
import { IOrder } from '../../core/models/iuser';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-dashboard-orders',
  imports: [DatePipe],
  templateUrl: './orders.html',
  styleUrl: './orders.css',
})
export class DashboardOrders implements OnInit {
  private _orderService = inject(OrderService);
  private _cdr = inject(ChangeDetectorRef);

  orders: IOrder[] = [];
  isLoading = true;
  errorMessage = '';

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this._orderService.getAllOrders().subscribe({
      next: (res) => {
        this.orders = res.data || [];
        this.isLoading = false;
        this._cdr.detectChanges();
      },
      error: () => {
        if (typeof window !== 'undefined' && window.localStorage) {
          const stored = localStorage.getItem('hein_local_orders');
          if (stored) {
            this.orders = JSON.parse(stored);
          }
        }
        this.isLoading = false;
        this._cdr.detectChanges();
      },
    });
  }

  updateOrderStatus(orderId: string, status: string): void {
    this._orderService.updateOrderStatus(orderId, status).subscribe({
      next: (res) => {
        const order = this.orders.find((o) => o._id === orderId);
        if (order && res.data) {
          order.orderStatus = res.data.orderStatus;
          this._cdr.detectChanges();
        }
      },
      error: () => {
        const order = this.orders.find((o) => o._id === orderId);
        if (order) {
          order.orderStatus = status as any;
          this._cdr.detectChanges();
        }
      },
    });
  }
}
