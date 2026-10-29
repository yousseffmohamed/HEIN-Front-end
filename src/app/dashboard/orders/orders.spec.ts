import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardOrders } from './orders';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

describe('DashboardOrders', () => {
  let component: DashboardOrders;
  let fixture: ComponentFixture<DashboardOrders>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardOrders],
      providers: [provideHttpClient(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardOrders);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the orders management component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with an orders array', () => {
    expect(Array.isArray(component.orders)).toBe(true);
  });
});
