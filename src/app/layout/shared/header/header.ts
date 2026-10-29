import { Component, ElementRef, HostListener, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SearchModal } from '../header-modals/search-modal/search-modal';
import { AccountModal } from '../header-modals/account-modal/account-modal';
import { CartModal } from '../header-modals/cart-modal/cart-modal';
import { WishlistModal } from '../header-modals/wishlist-modal/wishlist-modal';
import { CartService } from '../../../core/services/cart-service';
import { WishlistService } from '../../../core/services/wishlist-service';
import { AuthService } from '../../../core/services/auth-service';

type ActivePanel = 'none' | 'search' | 'account' | 'cart' | 'wishlist';

@Component({
  selector: 'app-header',
  imports: [
    RouterLink,
    RouterLinkActive,
    SearchModal,
    AccountModal,
    CartModal,
    WishlistModal,
  ],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  cartService = inject(CartService);
  wishlistService = inject(WishlistService);
  authService = inject(AuthService);
  private _elementRef = inject(ElementRef);

  activePanel: ActivePanel = 'none';
  isSearchPinned = false;
  private _searchCloseTimer: any = null;

  get isSearchOpen(): boolean {
    return this.activePanel === 'search';
  }

  get isAccountOpen(): boolean {
    return this.activePanel === 'account';
  }

  get isCartOpen(): boolean {
    return this.activePanel === 'cart';
  }

  get isWishlistOpen(): boolean {
    return this.activePanel === 'wishlist';
  }

  onSearchHover(): void {
    this.clearSearchTimer();
    if (this.activePanel === 'none') {
      this.activePanel = 'search';
    }
  }

  onSearchLeave(): void {
    if (this.isSearchPinned) {
      return;
    }

    this.clearSearchTimer();
    this._searchCloseTimer = setTimeout(() => {
      if (this.activePanel === 'search' && !this.isSearchPinned) {
        this.activePanel = 'none';
      }
    }, 220);
  }

  private clearSearchTimer(): void {
    if (this._searchCloseTimer) {
      clearTimeout(this._searchCloseTimer);
      this._searchCloseTimer = null;
    }
  }

  onSearchClick(event: Event): void {
    event.stopPropagation();
    this.clearSearchTimer();

    if (this.activePanel === 'search') {
      if (this.isSearchPinned) {
        this.closeAll();
      } else {
        this.isSearchPinned = true;
      }
    } else {
      this.closeAll();
      this.activePanel = 'search';
      this.isSearchPinned = true;
    }
  }

  toggleAccount(event: Event): void {
    event.stopPropagation();
    this.clearSearchTimer();
    this.activePanel = this.activePanel === 'account' ? 'none' : 'account';
    this.isSearchPinned = false;
  }

  toggleCart(event: Event): void {
    event.stopPropagation();
    this.clearSearchTimer();
    this.activePanel = this.activePanel === 'cart' ? 'none' : 'cart';
    this.isSearchPinned = false;
  }

  toggleWishlist(event: Event): void {
    event.stopPropagation();
    this.clearSearchTimer();
    this.activePanel = this.activePanel === 'wishlist' ? 'none' : 'wishlist';
    this.isSearchPinned = false;
  }

  closeAll(): void {
    this.clearSearchTimer();
    this.activePanel = 'none';
    this.isSearchPinned = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const clickedInside = this._elementRef.nativeElement.contains(event.target);
    if (!clickedInside) {
      this.closeAll();
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closeAll();
  }
}
