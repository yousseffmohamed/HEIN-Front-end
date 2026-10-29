import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { WishlistService } from '../../core/services/wishlist-service';
import { CartService } from '../../core/services/cart-service';
import { ProductCard } from '../shared/product-card/product-card';

@Component({
  selector: 'app-wishlist-page',
  imports: [RouterLink, ProductCard],
  templateUrl: './wishlist.html',
  styleUrl: './wishlist.css',
})
export class WishlistPage {
  wishlistService = inject(WishlistService);
  cartService = inject(CartService);

  addAllToCart() {
    for (const item of this.wishlistService.items()) {
      this.cartService.addToCart(item, 1);
    }
    this.wishlistService.clearWishlist();
  }
}
