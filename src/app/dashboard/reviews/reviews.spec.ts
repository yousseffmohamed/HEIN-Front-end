import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardReviews } from './reviews';
import { of } from 'rxjs';
import { ReviewService } from '../../core/services/review-service';

describe('DashboardReviews', () => {
  let component: DashboardReviews;
  let fixture: ComponentFixture<DashboardReviews>;

  const mockReviewService = {
    getAllReviews: () =>
      of({
        message: 'Success',
        count: 1,
        data: [
          {
            _id: 'rev_1',
            user: { _id: 'u1', firstName: 'Ahmed', lastName: 'M', email: 'ahmed@example.com' },
            product: { _id: 'p1', name: 'Minimal Watch', slug: 'minimal-watch' },
            rating: 5,
            comment: 'Great product!',
            status: 'published' as const,
            helpfulCount: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ],
      }),
    updateReviewStatus: () =>
      of({
        message: 'Updated',
        data: {} as any,
      }),
    deleteReview: () =>
      of({
        message: 'Deleted',
        data: {} as any,
      }),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardReviews],
      providers: [{ provide: ReviewService, useValue: mockReviewService }],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardReviews);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the reviews component', () => {
    expect(component).toBeTruthy();
  });

  it('should load reviews on init', () => {
    expect(component.reviews.length).toBe(1);
    expect(component.getProductName(component.reviews[0])).toBe('Minimal Watch');
  });

  it('should toggle review publishing status', () => {
    const rev = component.reviews[0];
    expect(rev.status).toBe('published');
    component.toggleStatus(rev);
    expect(rev.status).toBe('pending');
  });
});
