import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DealService } from '../../core/services/deal-service';
import { CartService } from '../../core/services/cart-service';
import { IDeal } from '../../core/models/ideal';
import { environment } from '../../environments/env';
import { DatePipe, DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-deals',
  imports: [RouterLink, DatePipe, DecimalPipe],
  templateUrl: './deals.html',
  styleUrl: './deals.css',
})
export class Deals implements OnInit {
  private _dealService = inject(DealService);
  private _cartService = inject(CartService);
  private _cdr = inject(ChangeDetectorRef);

  deals: IDeal[] = [];
  isLoading = true;
  errorMessage = '';
  staticURL = environment.staticURL;
  addedDealId: string | null = null;

  ngOnInit(): void {
    this.loadDeals();
  }

  loadDeals(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this._dealService.getActiveDeals().subscribe({
      next: (res) => {
        this.deals = res.data || [];
        this.isLoading = false;
        this._cdr.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage = 'Unable to load special offers at the moment. Please try again later.';
        this._cdr.detectChanges();
      },
    });
  }

  addToCart(deal: IDeal): void {
    if (!deal.product) return;
    this._cartService.addToCart(deal.product, 1);
    this.addedDealId = deal._id;
    this._cdr.detectChanges();
    setTimeout(() => {
      if (this.addedDealId === deal._id) {
        this.addedDealId = null;
        this._cdr.detectChanges();
      }
    }, 1800);
  }
}
