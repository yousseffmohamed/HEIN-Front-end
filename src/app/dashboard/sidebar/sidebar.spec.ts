import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardSidebar } from './sidebar';
import { provideRouter } from '@angular/router';

describe('DashboardSidebar', () => {
  let component: DashboardSidebar;
  let fixture: ComponentFixture<DashboardSidebar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardSidebar],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardSidebar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the dashboard sidebar', () => {
    expect(component).toBeTruthy();
  });

  it('should render navigation pill links', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const links = compiled.querySelectorAll('.sidebar-pill-btn');
    expect(links.length).toBeGreaterThan(0);
  });
});
