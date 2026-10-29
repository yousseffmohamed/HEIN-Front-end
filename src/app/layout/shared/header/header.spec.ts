import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Header } from './header';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

describe('Header', () => {
  let component: Header;
  let fixture: ComponentFixture<Header>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Header],
      providers: [provideHttpClient(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Header);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the header component', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle and pin search modal correctly', () => {
    expect(component.isSearchOpen).toBe(false);

    component.onSearchHover();
    expect(component.isSearchOpen).toBe(true);

    const mockEvent = new MouseEvent('click');
    component.onSearchClick(mockEvent);
    expect(component.isSearchPinned).toBe(true);

    component.closeAll();
    expect(component.isSearchOpen).toBe(false);
    expect(component.isSearchPinned).toBe(false);
  });
});
