import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CartModal } from './cart-modal';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

describe('CartModal', () => {
  let component: CartModal;
  let fixture: ComponentFixture<CartModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartModal],
      providers: [provideHttpClient(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(CartModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the cart modal', () => {
    expect(component).toBeTruthy();
  });
});
