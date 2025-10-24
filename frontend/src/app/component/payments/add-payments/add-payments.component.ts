import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Checkbox } from 'primeng/checkbox';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { MessageModule } from 'primeng/message';
import { SidebarPaymentComponent } from '../sidebar/sidebar.component';
import { MenuService } from '../services/menu.service';
import { PaymentControllerService, PaymentDTO } from '../../../api';

@Component({
  selector: 'app-add-payment',
  standalone: true,
  imports: [FormsModule, CommonModule, Checkbox, ToastModule, ButtonModule, MessageModule, SidebarPaymentComponent],
  providers: [MessageService],
  templateUrl: './add-payments.component.html',
  styleUrls: ['./add-payments.component.css']
})
export class AddPaymentComponent {
  payment: PaymentDTO = {};
  addMore = false;
  submitted = false;

  isNameInvalid = false;
  isStatusInvalid = false;
  isDateInvalid = false;
  isExpenseIdInvalid = false;
  expenseErrorMessage = '';

  constructor(
    private router: Router,
    private messageService: MessageService,
    private menuService: MenuService,
    private paymentService: PaymentControllerService
  ) {}

  onNameInput(event: Event) {
    this.isNameInvalid = !this.payment.name?.trim();
  }

  onStatusChange() {
    this.isStatusInvalid = !this.payment.status;
  }

  onDateInput(event: Event) {
    this.isDateInvalid = !this.payment.paymentDate;
  }

  onExpenseIdInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = input.value.trim();
    const num = Number(value);

    if (!value) {
      this.payment.expenseId = 0;
      this.expenseErrorMessage = 'Please provide a valid expense id.';
      this.isExpenseIdInvalid = true;
    } else if (isNaN(num) || num <= 0) {
      this.payment.expenseId = 0;
      this.expenseErrorMessage = 'Expense Id must be positive.';
      this.isExpenseIdInvalid = true;
    } else {
      this.payment.expenseId = num;
      this.isExpenseIdInvalid = false;
      this.expenseErrorMessage = '';
    }
  }

  savePayment(form: NgForm) {
    this.submitted = true;

    this.isNameInvalid = !this.payment.name;
    this.isStatusInvalid = !this.payment.status;
    this.isDateInvalid = !this.payment.paymentDate;
    this.isExpenseIdInvalid = !this.payment.expenseId || this.payment.expenseId <= 0;

    if (this.isExpenseIdInvalid && !this.payment.expenseId) {
      this.expenseErrorMessage = 'Please provide a valid expense id.';
    } else if (this.isExpenseIdInvalid && this.payment.expenseId! <= 0) {
      this.expenseErrorMessage = 'Expense Id must be positive.';
    }

    if (this.isNameInvalid || this.isStatusInvalid || this.isDateInvalid || this.isExpenseIdInvalid) {
      return;
    }

    // ✅ Trimiterea cererii către backend
    this.paymentService.createPayment(this.payment).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Payment added successfully!',
          life: 3000,
        });

        setTimeout(() => {
          if (this.addMore) {
            form.resetForm({ name: '', status: '', paymentDate: '', expenseId: '' });
            this.submitted = false;
          } else {
            this.router.navigate(['/all-payments']);
          }
        }, 1200);
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to add payment. Please check the data.',
        });
      },
    });
  }

  cancelEdit() {
    this.router.navigate(['/all-payments']);
  }

  onMenuSelect(label: string) {
    this.menuService.navigate(label);
  }
}
