import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Register } from './register';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

describe('Register', () => {
  let component: Register;
  let fixture: ComponentFixture<Register>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Register],
      providers: [provideHttpClient(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Register);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the registration component', () => {
    expect(component).toBeTruthy();
  });

  it('should be invalid when empty', () => {
    expect(component.registerForm.valid).toBe(false);
  });

  it('should validate matching passwords', () => {
    component.registerForm.patchValue({
      firstName: 'Ahmed',
      lastName: 'Ali',
      email: 'ahmed@example.com',
      password: 'StrongPass123!',
      confirmPassword: 'DifferentPass123!',
      acceptTerms: true,
    });

    const confirmControl = component.registerForm.get('confirmPassword');
    expect(confirmControl?.hasError('matchPassword')).toBe(true);

    component.registerForm.patchValue({
      confirmPassword: 'StrongPass123!',
    });

    expect(confirmControl?.hasError('matchPassword')).toBe(false);
  });
});
