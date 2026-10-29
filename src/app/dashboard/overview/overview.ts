import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductsService } from '../../core/services/products-service';
import { OrderService } from '../../core/services/order-service';
import { AuthService } from '../../core/services/auth-service';
import { IOrder } from '../../core/models/iuser';
import { DatePipe, DecimalPipe, TitleCasePipe } from '@angular/common';

export interface IMonthlySalesStat {
  month: string;
  revenue: number;
  orderCount: number;
  tealHeight: number;
  blackHeight: number;
}

@Component({
  selector: 'app-dashboard-overview',
  imports: [RouterLink, DatePipe, DecimalPipe, TitleCasePipe],
  templateUrl: './overview.html',
  styleUrl: './overview.css',
})
export class DashboardOverview implements OnInit {
  authService = inject(AuthService);
  private _productsService = inject(ProductsService);
  private _orderService = inject(OrderService);
  private _cdr = inject(ChangeDetectorRef);

  isLoading = true;
  errorMessage = '';

  totalRevenue = 0;
  totalProductsCount = 0;
  totalOrdersCount = 0;
  totalCustomersCount = 0;

  deliveredRevenue = 0;
  deliveredOrdersCount = 0;
  pendingRevenue = 0;
  pendingOrdersCount = 0;
  averageOrderValue = 0;
  totalUnitsSold = 0;

  monthlyStats: IMonthlySalesStat[] = [];
  maxMonthlyRevenue = 0;

  recentOrders: IOrder[] = [];

  ngOnInit(): void {
    this.loadOverviewData();
  }

  loadOverviewData(): void {
    this.isLoading = true;
    this.errorMessage = '';

    let productsLoaded = false;
    let ordersLoaded = false;
    let usersLoaded = false;

    const checkComplete = () => {
      if (productsLoaded && ordersLoaded && usersLoaded) {
        this.isLoading = false;
        this._cdr.detectChanges();
      }
    };

    this._productsService.getAllProducts().subscribe({
      next: (res) => {
        const prods = res.data || [];
        this.totalProductsCount = prods.length;
        productsLoaded = true;
        checkComplete();
      },
      error: () => {
        this.totalProductsCount = 0;
        productsLoaded = true;
        checkComplete();
      },
    });

    this._orderService.getAllOrders().subscribe({
      next: (res) => {
        const orders = res.data || [];
        this.processOrdersData(orders);
        ordersLoaded = true;
        checkComplete();
      },
      error: () => {

        let orders: IOrder[] = [];
        if (typeof window !== 'undefined' && window.localStorage) {
          const stored = localStorage.getItem('hein_local_orders');
          if (stored) {
            try {
              orders = JSON.parse(stored);
            } catch (e) {
              orders = [];
            }
          }
        }
        this.processOrdersData(orders);
        ordersLoaded = true;
        checkComplete();
      },
    });

    this.authService.getAllUsers().subscribe({
      next: (res) => {
        this.totalCustomersCount = (res.data || []).length;
        usersLoaded = true;
        checkComplete();
      },
      error: () => {
        this.totalCustomersCount = 0;
        usersLoaded = true;
        checkComplete();
      },
    });
  }

  private processOrdersData(orders: IOrder[]): void {
    this.totalOrdersCount = orders.length;
    this.recentOrders = orders.slice(0, 5);

    this.totalRevenue = orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);

    const delivered = orders.filter((o) => o.orderStatus === 'delivered');
    this.deliveredOrdersCount = delivered.length;
    this.deliveredRevenue = delivered.reduce((sum, o) => sum + (Number(o.total) || 0), 0);

    const pending = orders.filter(
      (o) => o.orderStatus === 'placed' || o.orderStatus === 'preparing' || o.orderStatus === 'delivering'
    );
    this.pendingOrdersCount = pending.length;
    this.pendingRevenue = pending.reduce((sum, o) => sum + (Number(o.total) || 0), 0);

    this.averageOrderValue = this.totalOrdersCount > 0 ? this.totalRevenue / this.totalOrdersCount : 0;

    this.totalUnitsSold = orders.reduce((sum, o) => {
      if (o.totalItems) return sum + Number(o.totalItems);
      if (o.products && o.products.length) {
        return sum + o.products.reduce((pSum, p) => pSum + (Number(p.quantity) || 1), 0);
      }
      return sum + 1;
    }, 0);

    this.calculateMonthlyStats(orders);
  }

  private calculateMonthlyStats(orders: IOrder[]): void {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const now = new Date();
    const monthsMap: { [key: string]: { label: string; revenue: number; orderCount: number } } = {};
    const last6Keys: string[] = [];

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      last6Keys.push(key);
      monthsMap[key] = {
        label: monthNames[d.getMonth()],
        revenue: 0,
        orderCount: 0,
      };
    }

    for (const order of orders) {
      if (order.createdAt) {
        const orderDate = new Date(order.createdAt);
        const key = `${orderDate.getFullYear()}-${orderDate.getMonth()}`;
        if (monthsMap[key]) {
          monthsMap[key].revenue += Number(order.total) || 0;
          monthsMap[key].orderCount += 1;
        }
      }
    }

    const maxRev = Math.max(...last6Keys.map((k) => monthsMap[k].revenue), 0);
    const maxOrders = Math.max(...last6Keys.map((k) => monthsMap[k].orderCount), 0);

    this.maxMonthlyRevenue = maxRev;
    this.monthlyStats = last6Keys.map((k) => {
      const m = monthsMap[k];
      const tealH = maxRev > 0 ? Math.max(8, Math.round((m.revenue / maxRev) * 110)) : 0;
      const blackH = maxOrders > 0 ? Math.max(6, Math.round((m.orderCount / maxOrders) * 55)) : 0;
      return {
        month: m.label,
        revenue: m.revenue,
        orderCount: m.orderCount,
        tealHeight: tealH,
        blackHeight: blackH,
      };
    });
  }
}
