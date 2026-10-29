import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardDeals } from './deals';
import { of } from 'rxjs';
import { DealService } from '../../core/services/deal-service';
import { ProductsService } from '../../core/services/products-service';

describe('DashboardDeals', () => {
  let component: DashboardDeals;
  let fixture: ComponentFixture<DashboardDeals>;

  const mockDealService = {
    getAllDeals: () =>
      of({
        message: 'Success',
        count: 1,
        data: [
          {
            _id: 'deal_1',
            title: 'Weekend Flash Sale',
            product: {
              _id: 'prod_1',
              name: 'Minimal Chrono Watch',
              price: 1000,
              mainPic: 'watch.jpg',
            } as any,
            discountType: 'percentage' as const,
            discountValue: 20,
            originalPrice: 1000,
            discountPrice: 800,
            startDate: new Date().toISOString(),
            endDate: new Date(Date.now() + 86400000).toISOString(),
            isActive: true,
          },
        ],
      }),
    createDeal: (payload: any) => of({ message: 'Created', data: payload }),
    updateDeal: (id: string, payload: any) => of({ message: 'Updated', data: payload }),
    deleteDeal: () => of({ message: 'Deleted', data: {} as any }),
  };

  const mockProductsService = {
    getAllProducts: () =>
      of({
        message: 'Success',
        data: [
          {
            _id: 'prod_1',
            name: 'Minimal Chrono Watch',
            price: 1000,
          } as any,
        ],
      }),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardDeals],
      providers: [
        { provide: DealService, useValue: mockDealService },
        { provide: ProductsService, useValue: mockProductsService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardDeals);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the dashboard deals component', () => {
    expect(component).toBeTruthy();
  });

  it('should load deals and products on init', () => {
    expect(component.deals.length).toBe(1);
    expect(component.deals[0].title).toBe('Weekend Flash Sale');
    expect(component.products.length).toBe(1);
  });

  it('should toggle deal active state', () => {
    const deal = component.deals[0];
    expect(deal.isActive).toBe(true);
    component.toggleActive(deal);
    expect(deal.isActive).toBe(false);
  });
});
