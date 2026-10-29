import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Categories } from './categories';
import { provideRouter } from '@angular/router';

describe('Categories', () => {
  let component: Categories;
  let fixture: ComponentFixture<Categories>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Categories],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Categories);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the categories component', () => {
    expect(component).toBeTruthy();
  });
});
