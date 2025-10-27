import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { SidebarPaymentComponent } from '../sidebar/sidebar.component';
import { MenuService } from '../services/menu.service';
import { PaymentControllerService, PaymentDTO } from '../../../api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';



@Component({
  selector: 'app-all-payments',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, SidebarPaymentComponent, ConfirmDialogModule, ToastModule],
  providers: [ConfirmationService, MessageService],
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
    private paymentService: PaymentControllerService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadPayments();
  }

  // Metodă care aplică sortarea DESC după paymentDate
  private sortPayments(paymentsArray: PaymentDTO[]): PaymentDTO[] {
    // Sortarea DESC după data de plată
    paymentsArray.sort((a, b) => {
      // Convertim string-urile de dată (ex: '2025-10-24') în obiecte Date
      // getTime() returnează timestamp-ul în milisecunde pentru o comparație ușoară
      const dateA = new Date(a.paymentDate!).getTime();
      const dateB = new Date(b.paymentDate!).getTime();

      // Pentru ordine DESC (descrescătoare / cel mai nou primul):
      // Dacă dateB > dateA, returnează pozitiv, punând B înaintea lui A.
      return dateB - dateA;
    });
    return paymentsArray;
  }

  loadPayments(): void {
    this.loading = true;
    this.paymentService
      .getAllPayments('body', false, {
        httpHeaderAccept: 'application/json'
      })
      .subscribe({
        next: (data: any) => {
          if (Array.isArray(data)) {
            this.payments = this.sortPayments(data);
          } else {
            console.warn('Unexpected API response format. Expected array:', data);
            this.payments = [];
          }
          this.loading = false;
        },
        error: (err) => {
          console.error('Failed to load payments', err);
          this.loading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load payments. Please try again.',
          });
        },
      });
  }

  editPayment(index: number) {
    const payment = this.payments[index];
    this.router.navigate(['/edit-payments'], { state: { payment, index } });
  }


  goToAddPayment(): void {
    this.router.navigate(['/add-payments']);
  }


  confirmDelete(index: number): void {
    const payment = this.payments[index];
    if (!payment?.id) return;

    this.confirmationService.confirm({
      message: `Are you sure you want to delete payment "${payment.name}"?`,
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',

      acceptLabel: 'Yes',
      rejectLabel: 'Cancel',
      acceptButtonStyleClass: 'p-button-success p-button-sm',
      rejectButtonStyleClass: 'p-button-text p-button-sm text-purple-700 font-semibold',

      accept: () => {
        this.paymentService.deletePayment(payment.id!).subscribe({
          next: () => {
            this.loadPayments();
            this.messageService.add({
              severity: 'success',
              summary: 'Deleted',
              detail: `Payment "${payment.name}" deleted successfully.`,
              life: 2500
            });
          },
          error: (err) => {
            console.error('Failed to delete payment', err);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to delete payment. Please try again.',
            });
          }
        });
      }
    });
  }


  filteredPayments(): PaymentDTO[] {
    return this.payments.filter((p) => {
      const matchDate = !this.filterDate || p.paymentDate === this.filterDate;
      const matchName =
        !this.filterName || p.name?.toLowerCase().includes(this.filterName.toLowerCase());
      const matchStatus =
        !this.filterStatus ||
        p.status?.toLowerCase() === this.filterStatus.toLowerCase();

      return matchDate && matchName && matchStatus;
    });
  }

  onMenuSelect(label: string) {
    this.menuService.navigate(label);
  }

  protected readonly event = event;
}
