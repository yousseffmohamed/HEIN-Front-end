import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { ProductsService } from '../../core/services/products-service';
import { IProduct } from '../../core/models/iproduct';
import { ProductCard } from '../shared/product-card/product-card';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { merge, debounceTime } from 'rxjs';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-products',
  imports: [ProductCard, ReactiveFormsModule, TitleCasePipe],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products implements OnInit {
  products: IProduct[] = [];
  paginatedProducts: IProduct[] = [];

  isLoading = true;
  errorMessage: string | null = null;

  currentPage = 1;
  pageSize = 8;
  totalPages = 1;
  totalProducts = 0;

  currentDepartment: string | null = null;
  currentCategory: string | null = null;

  private route = inject(ActivatedRoute);
  private _productService = inject(ProductsService);
  private _cdr = inject(ChangeDetectorRef);

  searchForm = new FormGroup({
    searchFilter: new FormControl(''),
  });

  filtersForm = new FormGroup({
    categoryFilter: new FormControl(''),
    minPriceFilter: new FormControl(''),
    maxPriceFilter: new FormControl(''),
    sortFilter: new FormControl('featured'),
  });

  get filteredProducts(): IProduct[] {
    return this.products;
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  ngOnInit(): void {
    merge(this.route.paramMap, this.route.queryParamMap).subscribe(() => {
      const categoryParam = this.route.snapshot.paramMap.get('category');
      const departmentParam = this.route.snapshot.paramMap.get('department');
      const querySearch = this.route.snapshot.queryParamMap.get('q');
      const queryCategory = this.route.snapshot.queryParamMap.get('category');

      this.currentCategory = categoryParam || queryCategory;
      this.currentDepartment = departmentParam;

      if (querySearch) {
        this.searchForm.controls.searchFilter.setValue(querySearch, { emitEvent: false });
      }

      if (this.currentCategory) {
        this.filtersForm.controls.categoryFilter.setValue(this.currentCategory, { emitEvent: false });
      }

      this.currentPage = 1;
      this.loadProducts();
    });

    this.searchForm.valueChanges.pipe(debounceTime(300)).subscribe(() => {
      this.currentPage = 1;
      this.loadProducts();
    });

    this.filtersForm.valueChanges.subscribe(() => {
      this.currentPage = 1;
      this.loadProducts();
    });
  }

  loadProducts(): void {
    this.isLoading = true;
    this.errorMessage = null;

    const q = (this.searchForm.controls.searchFilter.value || '').trim();
    const category = (this.filtersForm.controls.categoryFilter.value || '').trim();
    const department = this.currentDepartment || undefined;
    const minPrice = this.filtersForm.controls.minPriceFilter.value
      ? Number(this.filtersForm.controls.minPriceFilter.value)
      : undefined;
    const maxPrice = this.filtersForm.controls.maxPriceFilter.value
      ? Number(this.filtersForm.controls.maxPriceFilter.value)
      : undefined;
    const sort = this.filtersForm.controls.sortFilter.value || 'featured';

    this._productService
      .getAllProducts({
        q: q || undefined,
        category: category && category !== 'all' ? category : undefined,
        department: department && department !== 'all' ? department : undefined,
        minPrice,
        maxPrice,
        sort,
        page: this.currentPage,
        limit: this.pageSize,
      })
      .subscribe({
        next: (response) => {
          this.products = response.data || [];
          this.paginatedProducts = this.products;
          this.totalProducts = response.total ?? this.products.length;
          this.totalPages = response.totalPages ?? (Math.ceil(this.totalProducts / this.pageSize) || 1);
          if (this.currentPage > this.totalPages && this.totalPages > 0) {
            this.currentPage = this.totalPages;
          }
          this.isLoading = false;
          this._cdr.detectChanges();
        },
        error: (err) => {
          console.error('Failed to load products', err);
          this.isLoading = false;
          this.errorMessage =
            'Could not load products. Please check your connection or try again later.';
          this._cdr.detectChanges();
        },
      });
  }

  loadAllProducts(): void {
    this.loadProducts();
  }

  applyPagination(): void {

    this.totalPages = Math.ceil(this.totalProducts / this.pageSize) || 1;
    this.paginatedProducts = this.products;
  }

  setPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadProducts();
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }

  goToPage(page: number): void {
    this.setPage(page);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.setPage(this.currentPage + 1);
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.setPage(this.currentPage - 1);
    }
  }

  resetFilters(): void {
    this.searchForm.reset({ searchFilter: '' });
    this.filtersForm.reset({
      categoryFilter: '',
      minPriceFilter: '',
      maxPriceFilter: '',
      sortFilter: 'featured',
    });
    this.currentCategory = null;
    this.currentDepartment = null;
    this.currentPage = 1;
    this.loadProducts();
  }

  clearFilters(): void {
    this.resetFilters();
  }

  get displayedCount(): number {
    return this.totalProducts;
  }
}
