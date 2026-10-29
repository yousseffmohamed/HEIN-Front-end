import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WishlistPage } from './wishlist';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

describe('WishlistPage', () => {
  let component: WishlistPage;
  let fixture: ComponentFixture<WishlistPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WishlistPage],
      providers: [provideHttpClient(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(WishlistPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the wishlist page component', () => {
    expect(component).toBeTruthy();
  });

  it('should have wishlistService available', () => {
    expect(component.wishlistService).toBeDefined();
    expect(Array.isArray(component.wishlistService.items())).toBe(true);
  });
});
