import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { ReviewService } from '../../core/services/review-service';
import { IReview } from '../../core/models/ireview';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-dashboard-reviews',
  imports: [DatePipe],
  templateUrl: './reviews.html',
  styleUrl: './reviews.css',
})
export class DashboardReviews implements OnInit {
  private _reviewService = inject(ReviewService);
  private _cdr = inject(ChangeDetectorRef);

  reviews: IReview[] = [];
  isLoading = true;
  errorMessage = '';
  actionMessage = '';

  ngOnInit(): void {
    this.loadReviews();
  }

  loadReviews() {
    this.isLoading = true;
    this.errorMessage = '';
    this._reviewService.getAllReviews().subscribe({
      next: (res) => {
        this.reviews = res.data || [];
        this.isLoading = false;
        this._cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load reviews for dashboard', err);
        this.errorMessage = 'Failed to load reviews. Please verify network or administrative authentication.';
        this.isLoading = false;
        this._cdr.detectChanges();
      },
    });
  }

  getProductName(review: IReview): string {
    if (!review.product) return 'Unknown Product';
    if (typeof review.product === 'object' && review.product.name) {
      return review.product.name;
    }
    return String(review.product);
  }

  getAuthorName(review: IReview): string {
    if (!review.user) return 'Anonymous';
    return `${review.user.firstName || ''} ${review.user.lastName || ''}`.trim() || review.user.email;
  }

  toggleStatus(review: IReview) {
    const newStatus = review.status === 'published' ? 'pending' : 'published';
    this.actionMessage = '';

    this._reviewService.updateReviewStatus(review._id, newStatus).subscribe({
      next: () => {
        review.status = newStatus;
        this.actionMessage = `Review status updated to ${newStatus}`;
        this._cdr.detectChanges();
        setTimeout(() => (this.actionMessage = ''), 3000);
      },
      error: (err) => {
        console.error('Failed to update status', err);
        this.errorMessage = 'Could not update review status.';
        this._cdr.detectChanges();
        setTimeout(() => (this.errorMessage = ''), 3000);
      },
    });
  }

  deleteReview(review: IReview) {
    if (typeof window !== 'undefined' && !window.confirm('Are you sure you want to delete this review?')) {
      return;
    }

    this._reviewService.deleteReview(review._id).subscribe({
      next: () => {
        this.reviews = this.reviews.filter((r) => r._id !== review._id);
        this.actionMessage = 'Review removed successfully';
        this._cdr.detectChanges();
        setTimeout(() => (this.actionMessage = ''), 3000);
      },
      error: (err) => {
        console.error('Failed to delete review', err);
        this.errorMessage = 'Failed to delete review.';
        this._cdr.detectChanges();
        setTimeout(() => (this.errorMessage = ''), 3000);
      },
    });
  }
}
