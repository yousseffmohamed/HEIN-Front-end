import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth-service';
import { IUser } from '../../core/models/iuser';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-dashboard-customers',
  imports: [TitleCasePipe],
  templateUrl: './customers.html',
  styleUrl: './customers.css',
})
export class DashboardCustomers implements OnInit {
  private _authService = inject(AuthService);
  private _cdr = inject(ChangeDetectorRef);

  users: IUser[] = [];
  isLoading = true;
  errorMessage = '';

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this._authService.getAllUsers().subscribe({
      next: (res) => {
        this.users = res.data || [];
        this.isLoading = false;
        this._cdr.detectChanges();
      },
      error: () => {
        const current = this._authService.currentUser();
        if (current) this.users = [current];
        this.isLoading = false;
        this._cdr.detectChanges();
      },
    });
  }
}
