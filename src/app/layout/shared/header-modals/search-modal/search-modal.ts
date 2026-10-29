import { ChangeDetectorRef, Component, EventEmitter, HostListener, inject, OnInit, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ProductsService } from '../../../../core/services/products-service';
import { IProduct } from '../../../../core/models/iproduct';
import { environment } from '../../../../environments/env';
import { debounceTime, distinctUntilChanged, switchMap, of } from 'rxjs';

@Component({
  selector: 'app-search-modal',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './search-modal.html',
  styleUrl: './search-modal.css',
})
export class SearchModal implements OnInit {
  @Output() close = new EventEmitter<void>();

  private _productsService = inject(ProductsService);
  private _router = inject(Router);
  private _cdr = inject(ChangeDetectorRef);

  staticURL = environment.staticURL;
  filteredProducts: IProduct[] = [];
  hasQuery = false;
  isSearching = false;

  searchControl = new FormControl('');

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.close.emit();
  }

  ngOnInit(): void {

    this.searchControl.valueChanges
      .pipe(
        debounceTime(250),
        distinctUntilChanged(),
        switchMap((query) => {
          const q = (query || '').trim();
          this.hasQuery = q.length > 0;
          if (!this.hasQuery) {
            this.filteredProducts = [];
            this.isSearching = false;
            return of({ data: [] });
          }
          this.isSearching = true;
          return this._productsService.searchProducts({ q, limit: 6 });
        })
      )
      .subscribe({
        next: (res) => {
          this.filteredProducts = res.data || [];
          this.isSearching = false;
          this._cdr.detectChanges();
        },
        error: () => {
          this.filteredProducts = [];
          this.isSearching = false;
          this._cdr.detectChanges();
        },
      });
  }

  onClose(): void {
    this.close.emit();
  }

  onSubmit(): void {
    const q = this.searchControl.value?.trim();
    if (q) {
      this._router.navigate(['/products'], { queryParams: { q } });
      this.close.emit();
    }
  }

  onSelectProduct(slug: string): void {
    this._router.navigate(['/products', slug]);
    this.close.emit();
  }
}
