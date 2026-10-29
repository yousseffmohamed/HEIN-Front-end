import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Home } from './home';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

describe('Home', () => {
  let component: Home;
  let fixture: ComponentFixture<Home>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Home],
      providers: [provideHttpClient(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Home);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the home component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with featured products array', () => {
    expect(Array.isArray(component.featuredProducts)).toBe(true);
  });
});
