import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductsService } from '../../core/services/products-service';
import { IProduct } from '../../core/models/iproduct';
import { ProductCard } from '../shared/product-card/product-card';
import { environment } from '../../environments/env';

@Component({
  selector: 'app-home',
  imports: [RouterLink, ProductCard],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  private _productsService = inject(ProductsService);
  private _cdr = inject(ChangeDetectorRef);

  featuredProducts: IProduct[] = [];
  staticURL = environment.staticURL;
  isLoading = true;

  ngOnInit(): void {
    this._productsService.getAllProducts().subscribe({
      next: (res) => {
        this.featuredProducts = (res.data || []).slice(0, 4);
        this.isLoading = false;
        this._cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load featured products', err);
        this.isLoading = false;
        this._cdr.detectChanges();
      },
    });
  }
}
