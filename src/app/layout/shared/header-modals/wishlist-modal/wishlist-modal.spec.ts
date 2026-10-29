import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WishlistModal } from './wishlist-modal';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

describe('WishlistModal', () => {
  let component: WishlistModal;
  let fixture: ComponentFixture<WishlistModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WishlistModal],
      providers: [provideHttpClient(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(WishlistModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the wishlist modal', () => {
    expect(component).toBeTruthy();
  });
});
