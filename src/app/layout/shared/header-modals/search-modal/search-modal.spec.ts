import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchModal } from './search-modal';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

describe('SearchModal', () => {
  let component: SearchModal;
  let fixture: ComponentFixture<SearchModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchModal],
      providers: [provideHttpClient(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the search modal', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with search input control', () => {
    expect(component.searchControl).toBeDefined();
    expect(component.filteredProducts.length).toBe(0);
  });
});
