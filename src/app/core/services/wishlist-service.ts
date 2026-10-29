import { computed, Injectable, signal } from '@angular/core';
import { IProduct } from '../models/iproduct';

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  items = signal<IProduct[]>(this.getStoredWishlist());

  totalItems = computed(() => this.items().length);

  private getStoredWishlist(): IProduct[] {
    if (typeof window !== 'undefined' && window.localStorage) {
      const stored = localStorage.getItem('hein_wishlist');
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  }

  private persistWishlist(list: IProduct[]) {
    this.items.set(list);
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('hein_wishlist', JSON.stringify(list));
    }
  }

  isInWishlist(productId: string): boolean {
    return this.items().some((item) => item._id === productId);
  }

  toggleWishlist(product: IProduct) {
    if (this.isInWishlist(product._id)) {
      this.removeFromWishlist(product._id);
    } else {
      this.addToWishlist(product);
    }
  }

  addToWishlist(product: IProduct) {
    if (!this.isInWishlist(product._id)) {
      const updated = [...this.items(), product];
      this.persistWishlist(updated);
    }
  }

  removeFromWishlist(productId: string) {
    const updated = this.items().filter((item) => item._id !== productId);
    this.persistWishlist(updated);
  }

  clearWishlist() {
    this.persistWishlist([]);
  }
}
