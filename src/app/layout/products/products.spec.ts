import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Products } from './products';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

describe('Products', () => {
  let component: Products;
  let fixture: ComponentFixture<Products>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Products],
      providers: [provideHttpClient(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Products);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the products page component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with search and filters forms', () => {
    expect(component.searchForm).toBeDefined();
    expect(component.filtersForm).toBeDefined();
  });

  it('should manage pagination state correctly', () => {
    expect(component.currentPage).toBe(1);
    expect(component.pageSize).toBe(8);
  });
});
