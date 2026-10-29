import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { OrderService } from '../../core/services/order-service';
import { ProductsService } from '../../core/services/products-service';
import { AuthService } from '../../core/services/auth-service';
import { ReviewService } from '../../core/services/review-service';
import { IOrder } from '../../core/models/iuser';
import { IProduct } from '../../core/models/iproduct';
import { environment } from '../../environments/env';

export interface ITopProductStat {
  productId: string;
  name: string;
  mainPic?: string;
  price: number;
  unitsSold: number;
  totalRevenue: number;
}

export interface IOrderStatusBreakdown {
  status: string;
  label: string;
  count: number;
  percentage: number;
  badgeClass: string;
}

@Component({
  selector: 'app-dashboard-analytics',
  imports: [RouterLink, DecimalPipe],
  templateUrl: './analytics.html',
  styleUrl: './analytics.css',
})
export class DashboardAnalytics implements OnInit {
  private _orderService = inject(OrderService);
  private _productsService = inject(ProductsService);
  private _authService = inject(AuthService);
  private _reviewService = inject(ReviewService);
  private _cdr = inject(ChangeDetectorRef);

  staticURL = environment.staticURL;

  isLoading = true;
  hasStoreData = false;

  totalRevenue = 0;
  totalOrdersCount = 0;
  averageOrderValue = 0;
  deliveredOrdersCount = 0;
  fulfillmentRate = 0;

  totalCustomersCount = 0;
  uniqueOrderingCustomersCount = 0;
  repeatCustomersCount = 0;
  repeatCustomerRate = 0;

  totalProductsCount = 0;
  totalStockUnits = 0;
  inStockCount = 0;
  lowStockCount = 0;
  outOfStockCount = 0;

  totalReviewsCount = 0;
  averageStoreRating = 0;

  topSellingProducts: ITopProductStat[] = [];
  orderStatusPipeline: IOrderStatusBreakdown[] = [];

  ngOnInit(): void {
    this.loadAnalyticsData();
  }

  loadAnalyticsData(): void {
    this.isLoading = true;

    let ordersLoaded = false;
    let productsLoaded = false;
    let usersLoaded = false;
    let reviewsLoaded = false;

    let allOrders: IOrder[] = [];
    let allProducts: IProduct[] = [];

    const checkComplete = () => {
      if (ordersLoaded && productsLoaded && usersLoaded && reviewsLoaded) {
        this.computeCrossAnalytics(allOrders, allProducts);
        this.isLoading = false;
        this._cdr.detectChanges();
      }
    };

    this._orderService.getAllOrders().subscribe({
      next: (res) => {
        allOrders = res.data || [];
        ordersLoaded = true;
        checkComplete();
      },
      error: () => {

        if (typeof window !== 'undefined' && window.localStorage) {
          const stored = localStorage.getItem('hein_local_orders');
          if (stored) {
            try {
              allOrders = JSON.parse(stored);
            } catch (e) {
              allOrders = [];
            }
          }
        }
        ordersLoaded = true;
        checkComplete();
      },
    });

    this._productsService.getAllProducts().subscribe({
      next: (res) => {
        allProducts = res.data || [];
        this.processProducts(allProducts);
        productsLoaded = true;
        checkComplete();
      },
      error: () => {
        this.processProducts([]);
        productsLoaded = true;
        checkComplete();
      },
    });

    this._authService.getAllUsers().subscribe({
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

    this._reviewService.getAllReviews().subscribe({
      next: (res) => {
        const reviews = res.data || [];
        this.totalReviewsCount = reviews.length;
        if (this.totalReviewsCount > 0) {
          const ratingSum = reviews.reduce((sum, r) => sum + (Number(r.rating) || 0), 0);
          this.averageStoreRating = ratingSum / this.totalReviewsCount;
        } else {
          this.averageStoreRating = 0;
        }
        reviewsLoaded = true;
        checkComplete();
      },
      error: () => {
        this.totalReviewsCount = 0;
        this.averageStoreRating = 0;
        reviewsLoaded = true;
        checkComplete();
      },
    });
  }

  private processProducts(products: IProduct[]): void {
    this.totalProductsCount = products.length;
    this.totalStockUnits = products.reduce((sum, p) => sum + (Number(p.stock) || 0), 0);
    this.inStockCount = products.filter((p) => (Number(p.stock) || 0) > 0).length;
    this.lowStockCount = products.filter((p) => {
      const s = Number(p.stock) || 0;
      return s > 0 && s <= 5;
    }).length;
    this.outOfStockCount = products.filter((p) => (Number(p.stock) || 0) === 0).length;
  }

  private computeCrossAnalytics(orders: IOrder[], products: IProduct[]): void {
    this.totalOrdersCount = orders.length;
    this.hasStoreData = this.totalOrdersCount > 0 || this.totalProductsCount > 0;

    this.totalRevenue = orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
    this.averageOrderValue = this.totalOrdersCount > 0 ? this.totalRevenue / this.totalOrdersCount : 0;

    const delivered = orders.filter((o) => o.orderStatus === 'delivered');
    this.deliveredOrdersCount = delivered.length;
    this.fulfillmentRate = this.totalOrdersCount > 0 ? (this.deliveredOrdersCount / this.totalOrdersCount) * 100 : 0;

    const customerOrdersMap: { [userId: string]: number } = {};
    for (const o of orders) {
      const uId = typeof o.user === 'object' && o.user?._id ? o.user._id : (o.user || 'anonymous');
      customerOrdersMap[uId] = (customerOrdersMap[uId] || 0) + 1;
    }

    const uniqueUsers = Object.keys(customerOrdersMap);
    this.uniqueOrderingCustomersCount = uniqueUsers.length;
    this.repeatCustomersCount = uniqueUsers.filter((uId) => customerOrdersMap[uId] > 1).length;
    this.repeatCustomerRate =
      this.uniqueOrderingCustomersCount > 0
        ? (this.repeatCustomersCount / this.uniqueOrderingCustomersCount) * 100
        : 0;

    const statusCounts: { [key: string]: { count: number; label: string; badge: string } } = {
      placed: { count: 0, label: 'Placed', badge: 'badge-placed' },
      preparing: { count: 0, label: 'Preparing', badge: 'badge-preparing' },
      delivering: { count: 0, label: 'Out for Delivery', badge: 'badge-delivering' },
      delivered: { count: 0, label: 'Delivered', badge: 'badge-delivered' },
      cancelled: { count: 0, label: 'Cancelled', badge: 'badge-cancelled' },
    };

    for (const o of orders) {
      const st = o.orderStatus || 'placed';
      if (statusCounts[st]) {
        statusCounts[st].count += 1;
      }
    }

    this.orderStatusPipeline = Object.keys(statusCounts).map((key) => {
      const item = statusCounts[key];
      const pct = this.totalOrdersCount > 0 ? (item.count / this.totalOrdersCount) * 100 : 0;
      return {
        status: key,
        label: item.label,
        count: item.count,
        percentage: pct,
        badgeClass: item.badge,
      };
    });

    const salesMap: {
      [productId: string]: {
        name: string;
        mainPic?: string;
        price: number;
        unitsSold: number;
        totalRevenue: number;
      };
    } = {};

    for (const o of orders) {
      if (o.products && o.products.length) {
        for (const item of o.products) {
          const pId = typeof item.product === 'object' && (item.product as any)?._id
            ? (item.product as any)._id
            : String(item.product);

          const qty = Number(item.quantity) || 1;
          const price = Number(item.productPrice) || 0;

          if (!salesMap[pId]) {

            const catalogItem = products.find((p) => p._id === pId);
            salesMap[pId] = {
              name: item.productName || catalogItem?.name || 'Product #' + pId.substring(0, 6),
              mainPic: item.productMainPic || catalogItem?.mainPic || '',
              price: price || catalogItem?.price || 0,
              unitsSold: 0,
              totalRevenue: 0,
            };
          }

          salesMap[pId].unitsSold += qty;
          salesMap[pId].totalRevenue += price * qty;
        }
      }
    }

    this.topSellingProducts = Object.keys(salesMap)
      .map((pId) => ({
        productId: pId,
        name: salesMap[pId].name,
        mainPic: salesMap[pId].mainPic,
        price: salesMap[pId].price,
        unitsSold: salesMap[pId].unitsSold,
        totalRevenue: salesMap[pId].totalRevenue,
      }))
      .sort((a, b) => b.unitsSold - a.unitsSold)
      .slice(0, 6);
  }
}
