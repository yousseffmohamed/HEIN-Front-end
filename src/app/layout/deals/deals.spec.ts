import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Deals } from './deals';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

describe('Deals', () => {
  let component: Deals;
  let fixture: ComponentFixture<Deals>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Deals],
      providers: [provideHttpClient(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Deals);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the deals component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with a deals array', () => {
    expect(Array.isArray(component.deals)).toBe(true);
  });
});
