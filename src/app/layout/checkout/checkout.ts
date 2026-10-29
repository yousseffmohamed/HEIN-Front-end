import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart-service';
import { AuthService } from '../../core/services/auth-service';
import { OrderService } from '../../core/services/order-service';
import { IAddress, IOrder } from '../../core/models/iuser';
import { environment } from '../../environments/env';

@Component({
  selector: 'app-checkout',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export class Checkout implements OnInit {
  cartService = inject(CartService);
  authService = inject(AuthService);
  private _orderService = inject(OrderService);
  private _router = inject(Router);
  private _cdr = inject(ChangeDetectorRef);

  staticURL = environment.staticURL;
  shippingCost = 50;

  isSubmitting = false;
  orderSuccess = false;
  placedOrder: IOrder | null = null;
  errorMessage: string | null = null;

  savedAddresses: IAddress[] = [];
  selectedSavedAddressId: string = 'new';

  checkoutForm = new FormGroup({
    city: new FormControl('', [Validators.required]),
    street: new FormControl('', [Validators.required]),
    building: new FormControl('', [Validators.required]),
    floor: new FormControl(''),
    apartment: new FormControl(''),
    country: new FormControl('Egypt', [Validators.required]),
    paymentMethod: new FormControl('cash', [Validators.required]),
  });

  get subtotal(): number {
    return this.cartService.subtotal();
  }

  get total(): number {
    return this.subtotal + this.shippingCost;
  }

  ngOnInit(): void {
    if (this.cartService.items().length === 0 && !this.orderSuccess) {
      this._router.navigate(['/cart']);
      return;
    }

    if (this.authService.isLoggedIn()) {
      const user = this.authService.currentUser();
      this.savedAddresses = user?.addresses || [];
      if (this.savedAddresses.length > 0) {
        this.selectedSavedAddressId = this.savedAddresses[0]._id || '0';
        this.populateAddress(this.savedAddresses[0]);
      }
    }
  }

  onAddressSelectChange(addressId: string) {
    this.selectedSavedAddressId = addressId;
    if (addressId === 'new') {
      this.checkoutForm.patchValue({
        city: '',
        street: '',
        building: '',
        floor: '',
        apartment: '',
      });
    } else {
      const found = this.savedAddresses.find((a) => (a._id || '') === addressId);
      if (found) {
        this.populateAddress(found);
      }
    }
  }

  private populateAddress(addr: IAddress) {
    this.checkoutForm.patchValue({
      city: addr.city,
      street: addr.street,
      building: addr.building,
      floor: addr.floor || '',
      apartment: addr.apartment || '',
      country: addr.country || 'Egypt',
    });
  }

  placeOrder() {
    if (this.checkoutForm.invalid) {
      this.checkoutForm.markAllAsTouched();
      return;
    }

    if (!this.authService.isLoggedIn()) {
      this._router.navigate(['/login'], { queryParams: { returnUrl: '/checkout' } });
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = null;

    const shippingAddress: IAddress = {
      country: this.checkoutForm.value.country || 'Egypt',
      city: this.checkoutForm.value.city || '',
      street: this.checkoutForm.value.street || '',
      building: this.checkoutForm.value.building || '',
      floor: this.checkoutForm.value.floor || '',
      apartment: this.checkoutForm.value.apartment || '',
    };

    const orderPayload = {
      products: this.cartService.items().map((item) => ({
        product: item.product._id,
        productName: item.product.name,
        quantity: item.quantity,
        productPrice: item.product.price,
      })),
      shippingAddress,
      shippingCost: this.shippingCost,
      discounts: 0,
    };

    this._orderService.createOrder(orderPayload).subscribe({
      next: (res) => {
        const order = res.data;
        this.placedOrder = order;

        const paymentPayload = {
          orderId: order._id,
          amount: order.total,
          currency: 'EGP',
          paymentMethod: this.checkoutForm.value.paymentMethod || 'cash',
        };

        this._orderService.createPayment(paymentPayload).subscribe({
          next: () => {},
          error: () => {},
        });

        if (typeof window !== 'undefined' && window.localStorage) {
          const stored = localStorage.getItem('hein_local_orders');
          const orders = stored ? JSON.parse(stored) : [];
          orders.unshift(order);
          localStorage.setItem('hein_local_orders', JSON.stringify(orders));
        }

        this.cartService.clearCart();
        this.isSubmitting = false;
        this.orderSuccess = true;
        this._cdr.detectChanges();
      },
      error: (err) => {
        this.isSubmitting = false;
        this.errorMessage = err.error?.message || 'Failed to place order. Please try again.';
        this._cdr.detectChanges();
      },
    });
  }
}
