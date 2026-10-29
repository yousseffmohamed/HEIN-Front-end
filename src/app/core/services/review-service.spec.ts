import { TestBed } from '@angular/core/testing';
import { ReviewService } from './review-service';
import { provideHttpClient } from '@angular/common/http';

describe('ReviewService', () => {
  let service: ReviewService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient()],
    });
    service = TestBed.inject(ReviewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
