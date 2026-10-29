import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Account } from './account';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

describe('Account', () => {
  let component: Account;
  let fixture: ComponentFixture<Account>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Account],
      providers: [
        provideHttpClient(),
        provideRouter([{ path: 'login', component: Account }]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Account);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the account component', () => {
    expect(component).toBeTruthy();
  });

  it('should switch active tabs', () => {
    expect(component.activeTab).toBe('profile');
    component.setTab('orders');
    expect(component.activeTab).toBe('orders');
    component.setTab('addresses');
    expect(component.activeTab).toBe('addresses');
  });
});
