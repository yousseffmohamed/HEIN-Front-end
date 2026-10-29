import { TestBed } from '@angular/core/testing';
import { ProductsService } from './products-service';
import { provideHttpClient } from '@angular/common/http';

describe('ProductsService', () => {
  let service: ProductsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient()],
    });
    service = TestBed.inject(ProductsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should define product fetching and search methods', () => {
    expect(service.getAllProducts).toBeDefined();
    expect(service.getProductBySlug).toBeDefined();
    expect(service.searchProducts).toBeDefined();
    expect(service.getPaginatedProducts).toBeDefined();
  });
});
