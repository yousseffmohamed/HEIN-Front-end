import { Component, EventEmitter, HostListener, inject, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth-service';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-account-modal',
  imports: [TitleCasePipe],
  templateUrl: './account-modal.html',
  styleUrl: './account-modal.css',
})
export class AccountModal {
  @Output() close = new EventEmitter<void>();

  authService = inject(AuthService);
  private _router = inject(Router);

  @HostListener('document:keydown.escape')
  onEscape() {
    this.close.emit();
  }

  onClose() {
    this.close.emit();
  }

  logout() {
    this.authService.logout();
    this.close.emit();
  }

  navigate(path: string) {
    this._router.navigate([path]);
    this.close.emit();
  }
}
