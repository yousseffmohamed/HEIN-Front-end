import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardPayments } from './payments';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

describe('DashboardPayments', () => {
  let component: DashboardPayments;
  let fixture: ComponentFixture<DashboardPayments>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardPayments],
      providers: [provideHttpClient(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardPayments);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the payments component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with a payments list', () => {
    expect(Array.isArray(component.payments)).toBe(true);
  });
});
