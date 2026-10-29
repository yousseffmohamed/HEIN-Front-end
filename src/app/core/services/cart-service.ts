import { computed, Injectable, signal } from '@angular/core';
import { IProduct } from '../models/iproduct';

export interface ICartItem {
  product: IProduct;
  quantity: number;
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  items = signal<ICartItem[]>(this.getStoredCart());

  totalItems = computed(() => {
    return this.items().reduce((total, item) => total + item.quantity, 0);
  });

  subtotal = computed(() => {
    return this.items().reduce((total, item) => total + item.product.price * item.quantity, 0);
  });

  private getStoredCart(): ICartItem[] {
    if (typeof window !== 'undefined' && window.localStorage) {
      const stored = localStorage.getItem('hein_cart');
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  }

  private persistCart(cart: ICartItem[]) {
    this.items.set(cart);
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('hein_cart', JSON.stringify(cart));
    }
  }

  addToCart(product: IProduct, quantity: number = 1) {
    const current = [...this.items()];
    const index = current.findIndex((item) => item.product._id === product._id);

    if (index > -1) {
      const maxStock = product.stock || 99;
      const newQty = Math.min(current[index].quantity + quantity, maxStock);
      current[index] = { ...current[index], quantity: newQty };
    } else {
      current.push({ product, quantity: Math.min(quantity, product.stock || 99) });
    }

    this.persistCart(current);
  }

  updateQuantity(productId: string, quantity: number) {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }

    const current = this.items().map((item) => {
      if (item.product._id === productId) {
        const maxStock = item.product.stock || 99;
        return { ...item, quantity: Math.min(quantity, maxStock) };
      }
      return item;
    });

    this.persistCart(current);
  }

  removeFromCart(productId: string) {
    const filtered = this.items().filter((item) => item.product._id !== productId);
    this.persistCart(filtered);
  }

  clearCart() {
    this.persistCart([]);
  }
}
