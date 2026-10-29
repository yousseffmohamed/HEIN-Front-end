import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AccountModal } from './account-modal';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

describe('AccountModal', () => {
  let component: AccountModal;
  let fixture: ComponentFixture<AccountModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountModal],
      providers: [provideHttpClient(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(AccountModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the account modal', () => {
    expect(component).toBeTruthy();
  });
});
