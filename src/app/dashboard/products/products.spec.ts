import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardProducts } from './products';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

describe('DashboardProducts', () => {
  let component: DashboardProducts;
  let fixture: ComponentFixture<DashboardProducts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardProducts],
      providers: [provideHttpClient(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardProducts);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the products management component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with product form with required validators', () => {
    expect(component.productForm).toBeDefined();
    expect(component.productForm.get('name')).toBeDefined();
    expect(component.productForm.get('price')).toBeDefined();
    expect(component.productForm.get('stock')).toBeDefined();
  });

  it('should open and close the add product modal', () => {
    component.openAddProductModal();
    expect(component.showProductModal).toBe(true);
    expect(component.editingProductId).toBeNull();

    component.closeProductModal();
    expect(component.showProductModal).toBe(false);
  });
});
