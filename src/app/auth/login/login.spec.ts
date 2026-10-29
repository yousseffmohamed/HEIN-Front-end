import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Login } from './login';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

describe('Login', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Login],
      providers: [provideHttpClient(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the login component', () => {
    expect(component).toBeTruthy();
  });

  it('should be invalid when empty', () => {
    expect(component.loginForm.valid).toBe(false);
  });

  it('should validate email format', () => {
    const email = component.loginForm.controls['email'];
    expect(email.valid).toBe(false);

    email.setValue('invalid-email');
    expect(email.hasError('email')).toBe(true);

    email.setValue('user@example.com');
    expect(email.valid).toBe(true);
  });

  it('should require password', () => {
    const password = component.loginForm.controls['password'];
    expect(password.valid).toBe(false);
    expect(password.hasError('required')).toBe(true);

    password.setValue('ValidPass123!');
    expect(password.valid).toBe(true);
  });
});
