import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { OrderService } from '../../core/services/order-service';
import { IPayment } from '../../core/models/iuser';
import { DatePipe, TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-dashboard-payments',
  imports: [DatePipe, TitleCasePipe],
  templateUrl: './payments.html',
  styleUrl: './payments.css',
})
export class DashboardPayments implements OnInit {
  private _orderService = inject(OrderService);
  private _cdr = inject(ChangeDetectorRef);

  payments: IPayment[] = [];
  isLoading = true;
  errorMessage = '';

  ngOnInit(): void {
    this.loadPayments();
  }

  loadPayments(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this._orderService.getAllPayments().subscribe({
      next: (res) => {
        this.payments = res.data || [];
        this.isLoading = false;
        this._cdr.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this._cdr.detectChanges();
      },
    });
  }
}
