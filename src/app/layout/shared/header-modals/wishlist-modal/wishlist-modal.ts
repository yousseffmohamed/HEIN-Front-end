import { Component, EventEmitter, HostListener, inject, Output } from '@angular/core';
import { Router } from '@angular/router';
import { WishlistService } from '../../../../core/services/wishlist-service';
import { CartService } from '../../../../core/services/cart-service';
import { environment } from '../../../../environments/env';
import { IProduct } from '../../../../core/models/iproduct';

@Component({
  selector: 'app-wishlist-modal',
  imports: [],
  templateUrl: './wishlist-modal.html',
  styleUrl: './wishlist-modal.css',
})
export class WishlistModal {
  @Output() close = new EventEmitter<void>();

  wishlistService = inject(WishlistService);
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

  removeFromWishlist(productId: string) {
    this.wishlistService.removeFromWishlist(productId);
  }

  moveToCart(product: IProduct) {
    this.cartService.addToCart(product, 1);
    this.wishlistService.removeFromWishlist(product._id);
  }
}
