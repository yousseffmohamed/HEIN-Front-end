import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DealService } from '../../core/services/deal-service';
import { ProductsService } from '../../core/services/products-service';
import { IDeal } from '../../core/models/ideal';
import { IProduct } from '../../core/models/iproduct';
import { environment } from '../../environments/env';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-dashboard-deals',
  imports: [ReactiveFormsModule, DatePipe],
  templateUrl: './deals.html',
  styleUrl: './deals.css',
})
export class DashboardDeals implements OnInit {
  private _dealService = inject(DealService);
  private _productsService = inject(ProductsService);
  private _cdr = inject(ChangeDetectorRef);

  deals: IDeal[] = [];
  products: IProduct[] = [];

  isLoading = true;
  isSaving = false;
  errorMessage = '';
  actionMessage = '';
  staticURL = environment.staticURL;

  showModal = false;
  editingDealId: string | null = null;
  modalTitle = 'Create Flash Deal';

  dealForm = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.minLength(3)]),
    description: new FormControl(''),
    productId: new FormControl('', [Validators.required]),
    discountType: new FormControl<'percentage' | 'fixed'>('percentage', [Validators.required]),
    discountValue: new FormControl<number | null>(null, [Validators.required, Validators.min(1)]),
    startDate: new FormControl('', [Validators.required]),
    endDate: new FormControl('', [Validators.required]),
    isActive: new FormControl(true),
  });

  ngOnInit(): void {
    this.loadDeals();
    this.loadProducts();
  }

  loadDeals(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this._dealService.getAllDeals().subscribe({
      next: (res) => {
        this.deals = res.data || [];
        this.isLoading = false;
        this._cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load deals', err);
        this.isLoading = false;
        this.errorMessage = 'Failed to load deals from server.';
        this._cdr.detectChanges();
      },
    });
  }

  loadProducts(): void {
    this._productsService.getAllProducts().subscribe({
      next: (res) => {
        this.products = res.data || [];
        this._cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load catalog products for deals', err);
      },
    });
  }

  openCreateModal(): void {
    this.editingDealId = null;
    this.modalTitle = 'Create Flash Deal';
    const now = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(now.getDate() + 7);

    this.dealForm.reset({
      title: '',
      description: '',
      productId: this.products[0]?._id || '',
      discountType: 'percentage',
      discountValue: 20,
      startDate: now.toISOString().split('T')[0],
      endDate: nextWeek.toISOString().split('T')[0],
      isActive: true,
    });
    this.showModal = true;
  }

  openEditModal(deal: IDeal): void {
    this.editingDealId = deal._id;
    this.modalTitle = 'Edit Flash Deal';

    const start = deal.startDate ? new Date(deal.startDate).toISOString().split('T')[0] : '';
    const end = deal.endDate ? new Date(deal.endDate).toISOString().split('T')[0] : '';
    const prodId = typeof deal.product === 'object' ? deal.product?._id : deal.product;

    this.dealForm.patchValue({
      title: deal.title,
      description: deal.description || '',
      productId: prodId || '',
      discountType: deal.discountType,
      discountValue: deal.discountValue,
      startDate: start,
      endDate: end,
      isActive: deal.isActive,
    });
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.editingDealId = null;
    this.dealForm.reset();
  }

  saveDeal(): void {
    if (this.dealForm.invalid) {
      this.dealForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    this.errorMessage = '';

    const payload = {
      title: this.dealForm.value.title!,
      description: this.dealForm.value.description || '',
      productId: this.dealForm.value.productId!,
      discountType: this.dealForm.value.discountType!,
      discountValue: Number(this.dealForm.value.discountValue),
      startDate: this.dealForm.value.startDate!,
      endDate: this.dealForm.value.endDate!,
      isActive: this.dealForm.value.isActive ?? true,
    };

    if (this.editingDealId) {
      this._dealService.updateDeal(this.editingDealId, payload).subscribe({
        next: () => {
          this.isSaving = false;
          this.actionMessage = 'Deal updated successfully!';
          this.closeModal();
          this.loadDeals();
          this._cdr.detectChanges();
          setTimeout(() => (this.actionMessage = ''), 3000);
        },
        error: (err) => {
          this.isSaving = false;
          this.errorMessage = err.error?.message || 'Failed to update deal.';
          this._cdr.detectChanges();
        },
      });
    } else {
      this._dealService.createDeal(payload).subscribe({
        next: () => {
          this.isSaving = false;
          this.actionMessage = 'Deal created successfully!';
          this.closeModal();
          this.loadDeals();
          this._cdr.detectChanges();
          setTimeout(() => (this.actionMessage = ''), 3000);
        },
        error: (err) => {
          this.isSaving = false;
          this.errorMessage = err.error?.message || 'Failed to create deal.';
          this._cdr.detectChanges();
        },
      });
    }
  }

  toggleActive(deal: IDeal): void {
    const updatedStatus = !deal.isActive;
    this._dealService.updateDeal(deal._id, { isActive: updatedStatus }).subscribe({
      next: () => {
        deal.isActive = updatedStatus;
        this.actionMessage = `Deal status updated to ${updatedStatus ? 'Active' : 'Paused'}`;
        this._cdr.detectChanges();
        setTimeout(() => (this.actionMessage = ''), 3000);
      },
      error: (err) => {
        console.error('Failed to toggle deal status', err);
        this.errorMessage = 'Could not update deal status.';
        this._cdr.detectChanges();
        setTimeout(() => (this.errorMessage = ''), 3000);
      },
    });
  }

  deleteDeal(id: string): void {
    if (typeof window !== 'undefined' && !window.confirm('Are you sure you want to delete this promotional deal?')) {
      return;
    }

    this._dealService.deleteDeal(id).subscribe({
      next: () => {
        this.deals = this.deals.filter((d) => d._id !== id);
        this.actionMessage = 'Deal removed successfully.';
        this._cdr.detectChanges();
        setTimeout(() => (this.actionMessage = ''), 3000);
      },
      error: (err) => {
        console.error('Failed to delete deal', err);
        this.errorMessage = 'Failed to delete deal.';
        this._cdr.detectChanges();
        setTimeout(() => (this.errorMessage = ''), 3000);
      },
    });
  }

  isExpired(deal: IDeal): boolean {
    if (!deal.endDate) return false;
    return new Date(deal.endDate) < new Date();
  }

  getProductName(deal: IDeal): string {
    if (!deal.product) return 'Unknown Product';
    if (typeof deal.product === 'object' && deal.product.name) {
      return deal.product.name;
    }
    return 'Product #' + deal.product;
  }

  getProductPic(deal: IDeal): string {
    if (deal.banner) return this.staticURL + deal.banner;
    if (typeof deal.product === 'object' && deal.product?.mainPic) {
      return this.staticURL + deal.product.mainPic;
    }
    return '';
  }
}
