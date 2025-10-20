import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Checkbox } from 'primeng/checkbox';
import {ToastModule} from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { MessageModule } from 'primeng/message';
import { SidebarPaymentComponent } from '../sidebar/sidebar.component';
import { MenuService } from '../services/menu.service';


interface Payment {
  name: string;
  status: '' | 'pending' | 'paid' | 'failed';
  payment_date: string;
  expense_id: number | null;
}

@Component({
  selector: 'app-add-payment',
  standalone: true,
  imports: [FormsModule, CommonModule, Checkbox, ToastModule, ButtonModule, MessageModule, SidebarPaymentComponent],
  providers: [MessageService],
  templateUrl: './add-payments.component.html',
  styleUrls: ['./add-payments.component.css']
})
export class AddPaymentComponent {
  payment: Payment = { name: '', status: '', payment_date: '', expense_id: null };
  addMore = false;
  submitted = false;

  isNameInvalid = false;
  isStatusInvalid = false;
  isDateInvalid = false;
  isExpenseIdInvalid = false;
  expenseErrorMessage = '';

  menuItems = [
    { label: 'Home', icon: 'pi pi-home', active: false },
    { label: 'User', icon: 'pi pi-user', active: false },
    { label: 'Shared Account', icon: 'pi pi-users', active: false },
    { label: 'Incomes', icon: 'pi pi-dollar', active: false },
    { label: 'Expenses', icon: 'pi pi-minus-circle', active: false },
    { label: 'Payments', icon: 'pi pi-credit-card', active: true },
    { label: 'Savings', icon: 'pi pi-money-bill', active: false },
    { label: 'Settings', icon: 'pi pi-cog', active: false },
    { label: 'Help', icon: 'pi pi-question-circle', active: false },
    { label: 'Log out', icon: 'pi pi-sign-out', active: false }
  ];

  constructor(private router: Router, private messageService: MessageService, private menuService: MenuService) {}

  onNameInput(event: Event) {
    this.isNameInvalid = !this.payment.name.trim();
  }

  onStatusChange() {
    this.isStatusInvalid = !this.payment.status;
  }

  onDateInput(event: Event) {
    this.isDateInvalid = !this.payment.payment_date;
  }

  onExpenseIdInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = input.value.trim();
    const num = Number(value);

    if (!value) {
      this.payment.expense_id = null;
      this.expenseErrorMessage = 'Please provide a valid expense id.';
      this.isExpenseIdInvalid = true;
    } else if (isNaN(num) || num <= 0) {
      this.payment.expense_id = null;
      this.expenseErrorMessage = 'Expense Id must be positive.';
      this.isExpenseIdInvalid = true;
    } else {
      this.payment.expense_id = num;
      this.isExpenseIdInvalid = false;
      this.expenseErrorMessage = '';
    }
  }

  savePayment(form: NgForm) {
    this.submitted = true;

    this.isNameInvalid = !this.payment.name;
    this.isStatusInvalid = !this.payment.status;
    this.isDateInvalid = !this.payment.payment_date;
    this.isExpenseIdInvalid = !this.payment.expense_id || this.payment.expense_id <= 0;

    if (this.isExpenseIdInvalid && !this.payment.expense_id) {
      this.expenseErrorMessage = 'Please provide a valid expense id.';
    } else if (this.isExpenseIdInvalid && this.payment.expense_id! <= 0) {
      this.expenseErrorMessage = 'Expense Id must be positive.';
    }


    if (this.isNameInvalid || this.isStatusInvalid || this.isDateInvalid || this.isExpenseIdInvalid) {
      return;
    }

    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Payment saved successfully!',
      life: 3000,
    });

    setTimeout(() => {

        if (this.addMore) {
          form.resetForm({ name: '', status: '', payment_date: '', expense_id: '' });
          this.submitted = false;
          return;
        }
        else if(this.submitted==true)
          this.router.navigate(['/all-payments']);
    }, 1200);
  }

  onSelect(item: any) {
    this.menuItems.forEach(i => i.active = false);
    item.active = true;
  }
  cancelEdit() {
    this.router.navigate(['/all-payments']);
  }
  onMenuSelect(label: string) {
    this.menuService.navigate(label);
  }
}
