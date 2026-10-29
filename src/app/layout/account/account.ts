import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth-service';
import { OrderService } from '../../core/services/order-service';
import { IAddress, IOrder, IUser } from '../../core/models/iuser';
import { DatePipe, TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-account',
  imports: [RouterLink, ReactiveFormsModule, DatePipe, TitleCasePipe],
  templateUrl: './account.html',
  styleUrl: './account.css',
})
export class Account implements OnInit {
  authService = inject(AuthService);
  private _orderService = inject(OrderService);
  private _router = inject(Router);
  private _cdr = inject(ChangeDetectorRef);

  activeTab: 'profile' | 'addresses' | 'orders' = 'profile';

  user: IUser | null = null;
  orders: IOrder[] = [];
  addresses: IAddress[] = [];

  isSavingProfile = false;
  profileSuccess = false;
  profileError: string | null = null;

  isAddingAddress = false;
  showAddAddressModal = false;

  profileForm = new FormGroup({
    firstName: new FormControl('', [Validators.required, Validators.minLength(2)]),
    lastName: new FormControl('', [Validators.required, Validators.minLength(2)]),
    phone: new FormControl(''),
  });

  addressForm = new FormGroup({
    title: new FormControl('Home', [Validators.required]),
    country: new FormControl('Egypt', [Validators.required]),
    city: new FormControl('', [Validators.required]),
    street: new FormControl('', [Validators.required]),
    building: new FormControl('', [Validators.required]),
    floor: new FormControl(''),
    apartment: new FormControl(''),
  });

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this._router.navigate(['/login'], { queryParams: { returnUrl: '/account' } });
      return;
    }

    this.user = this.authService.currentUser();
    if (this.user) {
      this.profileForm.patchValue({
        firstName: this.user.firstName,
        lastName: this.user.lastName,
        phone: this.user.phone || '',
      });
      this.addresses = this.user.addresses || [];
    }

    this.authService.getProfile().subscribe({
      next: (res) => {
        if (res.data) {
          this.user = res.data;
          this.addresses = res.data.addresses || [];
          this.profileForm.patchValue({
            firstName: res.data.firstName,
            lastName: res.data.lastName,
            phone: res.data.phone || '',
          });
          this._cdr.detectChanges();
        }
      },
      error: () => {},
    });

    this._orderService.getMyOrders().subscribe({
      next: (res) => {
        this.orders = res.data || [];
        this._cdr.detectChanges();
      },
      error: () => {

        if (typeof window !== 'undefined' && window.localStorage) {
          const stored = localStorage.getItem('hein_local_orders');
          if (stored) {
            this.orders = JSON.parse(stored);
          }
        }
        this._cdr.detectChanges();
      },
    });
  }

  setTab(tab: 'profile' | 'addresses' | 'orders') {
    this.activeTab = tab;
  }

  saveProfile() {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.isSavingProfile = true;
    this.profileSuccess = false;
    this.profileError = null;

    const data = {
      firstName: this.profileForm.value.firstName || '',
      lastName: this.profileForm.value.lastName || '',
      phone: this.profileForm.value.phone || '',
    };

    this.authService.updateProfile(data).subscribe({
      next: (res) => {
        this.isSavingProfile = false;
        this.profileSuccess = true;
        this.user = res.data;
        this._cdr.detectChanges();
        setTimeout(() => {
          this.profileSuccess = false;
          this._cdr.detectChanges();
        }, 2500);
      },
      error: (err) => {
        this.isSavingProfile = false;
        this.profileError = err.error?.message || 'Failed to update profile.';
        this._cdr.detectChanges();
      },
    });
  }

  submitAddress() {
    if (this.addressForm.invalid) {
      this.addressForm.markAllAsTouched();
      return;
    }

    this.isAddingAddress = true;

    const newAddr: IAddress = {
      title: this.addressForm.value.title || 'Home',
      country: this.addressForm.value.country || 'Egypt',
      city: this.addressForm.value.city || '',
      street: this.addressForm.value.street || '',
      building: this.addressForm.value.building || '',
      floor: this.addressForm.value.floor || '',
      apartment: this.addressForm.value.apartment || '',
    };

    this.authService.addAddress(newAddr).subscribe({
      next: (res) => {
        this.isAddingAddress = false;
        this.addresses = res.data || [];
        this.showAddAddressModal = false;
        this.addressForm.reset({ title: 'Home', country: 'Egypt' });
        this._cdr.detectChanges();
      },
      error: () => {

        this.isAddingAddress = false;
        newAddr._id = 'addr_' + Date.now();
        this.addresses = [...this.addresses, newAddr];
        this.showAddAddressModal = false;
        this.addressForm.reset({ title: 'Home', country: 'Egypt' });
        this._cdr.detectChanges();
      },
    });
  }

  deleteAddress(addressId?: string) {
    if (!addressId) return;
    this.authService.deleteAddress(addressId).subscribe({
      next: (res) => {
        this.addresses = res.data || [];
        this._cdr.detectChanges();
      },
      error: () => {
        this.addresses = this.addresses.filter((a) => a._id !== addressId);
        this._cdr.detectChanges();
      },
    });
  }
}
