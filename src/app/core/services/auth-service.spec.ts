import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth-service';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideRouter([])],
    });
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should report logged in status based on token', () => {
    expect(typeof service.isLoggedIn()).toBe('boolean');
  });
});
