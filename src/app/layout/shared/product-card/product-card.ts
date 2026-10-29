import { Component, inject, Input } from '@angular/core';
import { IProduct } from '../../../core/models/iproduct';
import { environment } from '../../../environments/env';
import { RouterLink } from '@angular/router';
import { CartService } from '../../../core/services/cart-service';
import { WishlistService } from '../../../core/services/wishlist-service';

@Component({
  selector: 'app-product-card',
  imports: [RouterLink],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css',
})
export class ProductCard {
  @Input({ required: true }) product!: IProduct;

  cartService = inject(CartService);
  wishlistService = inject(WishlistService);
  staticURL = environment.staticURL;

  addedToCart = false;

  get isInWishlist(): boolean {
    return this.wishlistService.isInWishlist(this.product._id);
  }

  toggleWishlist(event: Event) {
    event.stopPropagation();
    event.preventDefault();
    this.wishlistService.toggleWishlist(this.product);
  }

  onAddToCart(event: Event) {
    event.stopPropagation();
    event.preventDefault();
    if (this.product.stock > 0) {
      this.cartService.addToCart(this.product, 1);
      this.addedToCart = true;
      setTimeout(() => (this.addedToCart = false), 1500);
    }
  }
}
