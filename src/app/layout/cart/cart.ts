import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart-service';
import { environment } from '../../environments/env';

@Component({
  selector: 'app-cart-page',
  imports: [RouterLink],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class CartPage {
  cartService = inject(CartService);
  private _router = inject(Router);
  staticURL = environment.staticURL;

  shippingEstimate = 50;

  get total(): number {
    return this.cartService.subtotal() > 0 ? this.cartService.subtotal() + this.shippingEstimate : 0;
  }

  updateQty(productId: string, quantity: number) {
    this.cartService.updateQuantity(productId, quantity);
  }

  removeItem(productId: string) {
    this.cartService.removeFromCart(productId);
  }

  proceedToCheckout() {
    this._router.navigate(['/checkout']);
  }
}
