import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardTopbar } from './topbar';
import { provideHttpClient } from '@angular/common/http';

describe('DashboardTopbar', () => {
  let component: DashboardTopbar;
  let fixture: ComponentFixture<DashboardTopbar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardTopbar],
      providers: [provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardTopbar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the dashboard topbar', () => {
    expect(component).toBeTruthy();
  });

  it('should render the search pill input', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.top-search-pill input')).toBeTruthy();
  });
});
