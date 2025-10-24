import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { SidebarPaymentComponent } from '../sidebar/sidebar.component';
import { MenuService } from '../services/menu.service';
import { PaymentControllerService, PaymentDTO } from '../../../api';

@Component({
  selector: 'app-all-payments',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, SidebarPaymentComponent],
  templateUrl: './all-payments.component.html',
  styleUrls: ['./all-payments.component.css'],
})
export class AllPaymentsComponent implements OnInit {
  payments: PaymentDTO[] = [];
  filterDate: string = '';
  filterName: string = '';
  filterStatus: string = '';

  loading = false;

  constructor(
    private router: Router,
    private menuService: MenuService,
    private paymentService: PaymentControllerService
  ) {}

  ngOnInit(): void {
    this.loadPayments();
  }

  loadPayments(): void {
    this.loading = true;
    this.paymentService.getAllPayments().subscribe({
      next: (data) => {
        this.payments = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load payments', err);
        this.loading = false;
      },
    });
  }


  editPayment(payment: PaymentDTO): void {
    if (!payment?.id) return;
    this.router.navigate(['/edit-payment', payment.id]);
  }

  goToAddPayment(): void {
    this.router.navigate(['/add-payments']);
  }


  deletePayment(payment: PaymentDTO): void {
    if (!payment?.id) return;
    if (confirm(`Are you sure you want to delete payment "${payment.name}"?`)) {
      this.paymentService.deletePayment(payment.id).subscribe({
        next: () => {
          this.loadPayments();
        },
        error: (err) => {
          console.error('Failed to delete payment', err);
        },
      });
    }
  }

  filteredPayments(): PaymentDTO[] {
    return this.payments.filter((p) => {
      const matchDate = !this.filterDate || p.paymentDate === this.filterDate;
      const matchName =
        !this.filterName || p.name?.toLowerCase().includes(this.filterName.toLowerCase());
      const matchStatus = !this.filterStatus || p.status === this.filterStatus;
      return matchDate && matchName && matchStatus;
    });
  }

  onMenuSelect(label: string) {
    this.menuService.navigate(label);
  }

  protected readonly event = event;
}
