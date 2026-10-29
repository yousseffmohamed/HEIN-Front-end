import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardOverview } from './overview';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

describe('DashboardOverview', () => {
  let component: DashboardOverview;
  let fixture: ComponentFixture<DashboardOverview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardOverview],
      providers: [provideHttpClient(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardOverview);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the overview component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default metrics and recent orders list', () => {
    expect(component.totalRevenue).toBeGreaterThanOrEqual(0);
    expect(Array.isArray(component.recentOrders)).toBe(true);
  });

  it('should render the greeting header', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.dash-hero-heading h1')?.textContent).toContain('Good morning');
  });
});
