import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Checkout } from './checkout';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

describe('Checkout', () => {
  let component: Checkout;
  let fixture: ComponentFixture<Checkout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Checkout],
      providers: [
        provideHttpClient(),
        provideRouter([{ path: 'cart', component: Checkout }]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Checkout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the checkout component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize checkout form with required fields', () => {
    expect(component.checkoutForm).toBeDefined();
    expect(component.checkoutForm.get('city')).toBeDefined();
    expect(component.checkoutForm.get('street')).toBeDefined();
    expect(component.checkoutForm.get('building')).toBeDefined();
    expect(component.shippingCost).toBe(50);
  });
});
