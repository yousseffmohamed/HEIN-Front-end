export interface IReviewUser {
  _id: string;
  firstName: string;
  lastName?: string;
  email: string;
}

export interface IReviewProduct {
  _id: string;
  name: string;
  slug: string;
  mainPic?: string;
}

export interface IReview {
  _id: string;
  user: IReviewUser;
  product: IReviewProduct | string;
  rating: number;
  comment: string;
  status: 'published' | 'pending' | 'flagged';
  helpfulCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface IProductReviewsResponse {
  message: string;
  count: number;
  averageRating: number;
  ratingCounts: { [key: number]: number };
  data: IReview[];
}

export interface IAllReviewsResponse {
  message: string;
  count: number;
  data: IReview[];
}

export interface IReviewResponse {
  message: string;
  data: IReview;
}
