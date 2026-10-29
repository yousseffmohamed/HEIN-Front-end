import { Routes } from '@angular/router';
import { Layout } from './layout/layout';
import { Home as HomeLayout } from './layout/home/home';
import { Products as ProductsLayout } from './layout/products/products';
import { Categories as CategoriesLayout } from './layout/categories/categories';
import { Deals as DealsLayout } from './layout/deals/deals';
import { Login } from './auth/login/login';
import { Register } from './auth/register/register';
import { ProductDetails } from './layout/products/product-details/product-details';
import { CartPage } from './layout/cart/cart';
import { WishlistPage } from './layout/wishlist/wishlist';
import { Checkout } from './layout/checkout/checkout';
import { Account } from './layout/account/account';
import { Dashboard } from './dashboard/dashboard';
import { DashboardOverview } from './dashboard/overview/overview';
import { DashboardProducts } from './dashboard/products/products';
import { DashboardDeals } from './dashboard/deals/deals';
import { DashboardOrders } from './dashboard/orders/orders';
import { DashboardCustomers } from './dashboard/customers/customers';
import { DashboardPayments } from './dashboard/payments/payments';
import { DashboardReviews } from './dashboard/reviews/reviews';
import { DashboardAnalytics } from './dashboard/analytics/analytics';
import { NotFound } from './shared/notfound/notfound';
import { authGuard, adminGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: Layout,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeLayout },
      { path: 'products', component: ProductsLayout },
      { path: 'categories', component: CategoriesLayout },
      { path: 'deals', component: DealsLayout },

      { path: 'products/category/:category', component: ProductsLayout },
      { path: 'products/department/:department', component: ProductsLayout },
      { path: 'products/:slug', component: ProductDetails },

      { path: 'cart', component: CartPage },
      { path: 'wishlist', component: WishlistPage },
      { path: 'checkout', component: Checkout },
      { path: 'account', component: Account, canActivate: [authGuard] },
      { path: 'account/orders', component: Account, canActivate: [authGuard] },
      { path: 'account/addresses', component: Account, canActivate: [authGuard] },
    ],
  },
  { path: 'login', component: Login },
  { path: 'sign-up', component: Register },
  {
    path: 'dashboard',
    component: Dashboard,
    canActivate: [adminGuard],
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      { path: 'overview', component: DashboardOverview },
      { path: 'products', component: DashboardProducts },
      { path: 'deals', component: DashboardDeals },
      { path: 'orders', component: DashboardOrders },
      { path: 'customers', component: DashboardCustomers },
      { path: 'payments', component: DashboardPayments },
      { path: 'reviews', component: DashboardReviews },
      { path: 'analytics', component: DashboardAnalytics },
    ],
  },
  { path: '**', component: NotFound },
];
