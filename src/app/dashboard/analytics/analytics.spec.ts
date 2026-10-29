import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardAnalytics } from './analytics';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

describe('DashboardAnalytics', () => {
  let component: DashboardAnalytics;
  let fixture: ComponentFixture<DashboardAnalytics>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardAnalytics],
      providers: [provideHttpClient(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardAnalytics);
    component = fixture.componentInstance;
  });

  it('should create the analytics component', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should initialize with default zero/empty metrics', () => {
    fixture.detectChanges();
    expect(component.totalRevenue).toBe(0);
    expect(component.totalOrdersCount).toBe(0);
    expect(Array.isArray(component.topSellingProducts)).toBe(true);
    expect(Array.isArray(component.orderStatusPipeline)).toBe(true);
  });

  it('should render analytics metrics cards when loaded', () => {
    component.loadAnalyticsData = () => {};
    component.isLoading = false;
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelectorAll('.metric-glass-card').length).toBeGreaterThan(0);
  });
});
