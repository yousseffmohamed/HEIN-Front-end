import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductDetails } from './product-details';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

describe('ProductDetails', () => {
  let component: ProductDetails;
  let fixture: ComponentFixture<ProductDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductDetails],
      providers: [provideHttpClient(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the product details component', () => {
    expect(component).toBeTruthy();
  });

  it('should manage quantity counters with boundary minimum of 1', () => {
    expect(component.quantity).toBe(1);
    component.decreaseQty();
    expect(component.quantity).toBe(1);
    component.increaseQty();
    expect(component.quantity).toBe(2);
    component.decreaseQty();
    expect(component.quantity).toBe(1);
  });
});
