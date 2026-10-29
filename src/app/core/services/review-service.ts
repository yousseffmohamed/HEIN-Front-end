import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/env';
import { IAllReviewsResponse, IProductReviewsResponse, IReviewResponse } from '../models/ireview';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  private _http = inject(HttpClient);
  private _apiURL = environment.apiURL + 'reviews/';

  getProductReviews(productId: string) {
    return this._http.get<IProductReviewsResponse>(`${this._apiURL}product/${productId}`);
  }

  createReview(payload: { productId: string; rating: number; comment: string }) {
    return this._http.post<IReviewResponse>(this._apiURL, payload);
  }

  getAllReviews() {
    return this._http.get<IAllReviewsResponse>(`${this._apiURL}all`);
  }

  updateReviewStatus(id: string, status: 'published' | 'pending' | 'flagged') {
    return this._http.patch<IReviewResponse>(`${this._apiURL}${id}/status`, { status });
  }

  deleteReview(id: string) {
    return this._http.delete<IReviewResponse>(`${this._apiURL}${id}`);
  }
}
