import { Component, EventEmitter, HostListener, inject, Output } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../../../core/services/cart-service';
import { environment } from '../../../../environments/env';

@Component({
  selector: 'app-cart-modal',
  imports: [],
  templateUrl: './cart-modal.html',
  styleUrl: './cart-modal.css',
})
export class CartModal {
  @Output() close = new EventEmitter<void>();

  cartService = inject(CartService);
  private _router = inject(Router);
  staticURL = environment.staticURL;

  @HostListener('document:keydown.escape')
  onEscape() {
    this.close.emit();
  }

  onClose() {
    this.close.emit();
  }

  navigate(path: string) {
    this._router.navigate([path]);
    this.close.emit();
  }

  updateQty(productId: string, qty: number) {
    this.cartService.updateQuantity(productId, qty);
  }

  removeItem(productId: string) {
    this.cartService.removeFromCart(productId);
  }
}
