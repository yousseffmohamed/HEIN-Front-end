import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Layout } from './layout';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

describe('Layout', () => {
  let component: Layout;
  let fixture: ComponentFixture<Layout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Layout],
      providers: [provideHttpClient(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Layout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the layout shell', () => {
    expect(component).toBeTruthy();
  });
});
