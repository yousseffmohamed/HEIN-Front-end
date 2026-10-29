import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { IProduct } from '../../../core/models/iproduct';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductsService } from '../../../core/services/products-service';
import { CartService } from '../../../core/services/cart-service';
import { WishlistService } from '../../../core/services/wishlist-service';
import { AuthService } from '../../../core/services/auth-service';
import { ReviewService } from '../../../core/services/review-service';
import { IReview } from '../../../core/models/ireview';
import { environment } from '../../../environments/env';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DatePipe, TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-product-details',
  imports: [RouterLink, ReactiveFormsModule, TitleCasePipe, DatePipe],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css',
})
export class ProductDetails implements OnInit {
  selectedProduct: IProduct | null = null;
  activeImage = '';
  quantity = 1;
  addedToCart = false;
  isLoading = true;
  errorMessage: string | null = null;

  reviews: IReview[] = [];
  averageRating = 5.0;
  isLoadingReviews = false;
  isSubmittingReview = false;
  reviewSuccessMessage = '';
  reviewErrorMessage = '';

  reviewForm = new FormGroup({
    rating: new FormControl(5, [Validators.required, Validators.min(1), Validators.max(5)]),
    text: new FormControl('', [Validators.required, Validators.minLength(10)]),
  });

  private route = inject(ActivatedRoute);
  private _router = inject(Router);
  private _productService = inject(ProductsService);
  private _reviewService = inject(ReviewService);
  private _cdr = inject(ChangeDetectorRef);
  cartService = inject(CartService);
  wishlistService = inject(WishlistService);
  authService = inject(AuthService);

  staticURL = environment.staticURL;

  get isInWishlist(): boolean {
    return this.selectedProduct ? this.wishlistService.isInWishlist(this.selectedProduct._id) : false;
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const slug = params.get('slug');

      if (!slug) return;

      this.isLoading = true;
      this.errorMessage = null;

      this._productService.getProductBySlug(slug).subscribe({
        next: (response) => {
          this.selectedProduct = response.data;
          this.activeImage = this.selectedProduct.mainPic;
          this.isLoading = false;
          this.loadProductReviews(this.selectedProduct._id);
          this._cdr.detectChanges();
        },
        error: (err) => {
          console.error('Failed to load Product', err);
          this.isLoading = false;
          this.errorMessage = 'Product could not be found or failed to load.';
          this._cdr.detectChanges();
        },
      });
    });
  }

  setActiveImage(img: string) {
    this.activeImage = img;
  }

  increaseQty() {
    const max = this.selectedProduct?.stock || 10;
    if (this.quantity < max) {
      this.quantity++;
    }
  }

  decreaseQty() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart() {
    if (!this.selectedProduct || this.selectedProduct.stock === 0) return;
    this.cartService.addToCart(this.selectedProduct, this.quantity);
    this.addedToCart = true;
    setTimeout(() => (this.addedToCart = false), 2000);
  }

  buyNow() {
    if (!this.selectedProduct || this.selectedProduct.stock === 0) return;
    this.cartService.addToCart(this.selectedProduct, this.quantity);
    this._router.navigate(['/checkout']);
  }

  toggleWishlist() {
    if (this.selectedProduct) {
      this.wishlistService.toggleWishlist(this.selectedProduct);
    }
  }

  loadProductReviews(productId: string) {
    this.isLoadingReviews = true;
    this._reviewService.getProductReviews(productId).subscribe({
      next: (response) => {
        this.reviews = response.data || [];
        this.averageRating = response.averageRating ?? 5.0;
        this.isLoadingReviews = false;
        this._cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load reviews from server', err);
        this.isLoadingReviews = false;
        this._cdr.detectChanges();
      },
    });
  }

  submitReview() {
    if (this.reviewForm.invalid || !this.selectedProduct) return;

    if (!this.authService.isLoggedIn()) {
      this._router.navigate(['/login']);
      return;
    }

    this.isSubmittingReview = true;
    this.reviewSuccessMessage = '';
    this.reviewErrorMessage = '';

    const payload = {
      productId: this.selectedProduct._id,
      rating: Number(this.reviewForm.value.rating) || 5,
      comment: (this.reviewForm.value.text || '').trim(),
    };

    this._reviewService.createReview(payload).subscribe({
      next: () => {
        this.isSubmittingReview = false;
        this.reviewSuccessMessage = 'Thank you! Your review has been submitted.';
        this.reviewForm.reset({ rating: 5, text: '' });
        if (this.selectedProduct?._id) {
          this.loadProductReviews(this.selectedProduct._id);
        }
        this._cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to post review', err);
        this.isSubmittingReview = false;
        this.reviewErrorMessage = err.error?.message || 'Failed to submit review. Please try again.';
        this._cdr.detectChanges();
      },
    });
  }
}
