import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth-service';

@Component({
  selector: 'app-login',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit {
  private _authService = inject(AuthService);
  private _router = inject(Router);
  private _route = inject(ActivatedRoute);
  private _cdr = inject(ChangeDetectorRef);

  isLoading = false;
  errorMessage: string | null = null;
  returnUrl = '/home';

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    rememberMe: new FormControl(false),
  });

  constructor() {
    const queryReturn = this._route.snapshot.queryParamMap.get('returnUrl');
    if (queryReturn) {
      this.returnUrl = queryReturn;
    }
  }

  ngOnInit(): void {

    this.loginForm.valueChanges.subscribe(() => {
      if (this.errorMessage) {
        this.errorMessage = null;
        this._cdr.detectChanges();
      }
    });
  }

  onSubmit(): void {
    if (this.isLoading) {
      return;
    }

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    const credentials = {
      email: this.loginForm.value.email || '',
      password: this.loginForm.value.password || '',
    };

    this._authService.login(credentials).subscribe({
      next: () => {
        this.isLoading = false;
        this._cdr.detectChanges();
        if (this._authService.isAdmin() && this.returnUrl === '/home') {
          this._router.navigate(['/dashboard']);
        } else {
          this._router.navigateByUrl(this.returnUrl);
        }
      },
      error: (err) => {
        this.isLoading = false;
        if (err.status === 0) {
          this.errorMessage = 'Unable to reach the server. Please check your connection or server status.';
        } else {
          this.errorMessage =
            err.error?.message || err.error?.error || 'Invalid email or password. Please try again.';
        }
        this._cdr.detectChanges();
      },
    });
  }
}
