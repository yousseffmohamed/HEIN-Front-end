import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductCard } from './product-card';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

describe('ProductCard', () => {
  let component: ProductCard;
  let fixture: ComponentFixture<ProductCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductCard],
      providers: [provideHttpClient(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductCard);
    component = fixture.componentInstance;
    component.product = {
      _id: 'test_prod_1',
      name: 'Sample Minimal Product',
      price: 250,
      department: 'men',
      category: ['accessories'],
      brand: 'HeIn Originals',
      description: 'A test description',
      mainPic: 'sample.jpg',
      images: [],
      slug: 'sample-minimal-product',
      stock: 12,
    };
    fixture.detectChanges();
  });

  it('should create the product card component', () => {
    expect(component).toBeTruthy();
  });

  it('should render the product name and price', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Sample Minimal Product');
    expect(compiled.textContent).toContain('250');
  });

  it('should add product to cart and prevent navigation when Add to Cart is clicked', () => {
    let stopped = false;
    let prevented = false;
    const mockEvent = {
      stopPropagation: () => {
        stopped = true;
      },
      preventDefault: () => {
        prevented = true;
      },
    } as unknown as Event;

    const initialCount = component.cartService.totalItems();
    component.onAddToCart(mockEvent);

    expect(stopped).toBe(true);
    expect(prevented).toBe(true);
    expect(component.cartService.totalItems()).toBe(initialCount + 1);
    expect(component.addedToCart).toBe(true);
  });
});
