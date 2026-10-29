import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardCustomers } from './customers';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

describe('DashboardCustomers', () => {
  let component: DashboardCustomers;
  let fixture: ComponentFixture<DashboardCustomers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardCustomers],
      providers: [provideHttpClient(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardCustomers);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the customers component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with a users array', () => {
    expect(Array.isArray(component.users)).toBe(true);
  });
});
