import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { MessageModule } from 'primeng/message';
import { SidebarComponent } from '../../sidebar/sidebar.component';
import { MenuService } from '../services/menu.service';
import { ExpenseControllerService, ExpenseDTO } from '../../../api';
import { TokenService } from '../../../services/token.service';
import { UserControllerService } from '../../../api';
import { CheckboxModule } from 'primeng/checkbox';
import { RippleModule } from 'primeng/ripple';

@Component({
  selector: 'app-add-expense',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    ToastModule,
    ButtonModule,
    MessageModule,
    SidebarComponent,
    CheckboxModule,
    RippleModule,
  ],
  providers: [MessageService],
  templateUrl: './add-expense.html',
  styleUrls: ['./add-expense.css'],
})
export class AddExpenseComponent {
  // expose enums to the template for type-safe bindings
  readonly FrequencyEnum = ExpenseDTO.FrequencyEnum;
  readonly PaymentMethodEnum = ExpenseDTO.PaymentMethodEnum;

  // Options for selects (used by the template)
  frequencyOptions = [
    { label: 'One-time', value: this.FrequencyEnum.OneTime },
    { label: 'Monthly', value: this.FrequencyEnum.Monthly },
    { label: 'Yearly', value: this.FrequencyEnum.Yearly },
  ];

  paymentMethodOptions = [
    { label: 'Card', value: this.PaymentMethodEnum.Card },
    { label: 'Transfer', value: this.PaymentMethodEnum.Transfer },
  ];

  expense: ExpenseDTO = {
    userId: 0,
    amount: 0,
    category: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    frequency: ExpenseDTO.FrequencyEnum.OneTime,
    endDate: undefined,
    nextDueDate: undefined,
    paymentMethod: ExpenseDTO.PaymentMethodEnum.Card,
  } as ExpenseDTO;

  // match add-payments behavior
  addMore = false;

  submitted = false;
  isLoading = false;

  isAmountInvalid = false;
  isCategoryInvalid = false;
  isDateInvalid = false;
  amountErrorMessage = '';

  constructor(
    private router: Router,
    private messageService: MessageService,
    private menuService: MenuService,
    private expenseService: ExpenseControllerService,
    private tokenService: TokenService,
    private userService: UserControllerService
  ) {}

  onAmountInput() {
    this.isAmountInvalid = !(this.expense.amount && this.expense.amount > 0);
    if (this.isAmountInvalid) this.amountErrorMessage = 'Please provide a positive amount.';
    else this.amountErrorMessage = '';
  }

  onCategoryInput() {
    this.isCategoryInvalid = !this.expense.category?.trim();
  }

  onDateInput() {
    this.isDateInvalid = !this.expense.date;
  }

  saveExpense(form: NgForm) {
    this.submitted = true;

    this.onAmountInput();
    this.onCategoryInput();
    this.onDateInput();

    if (this.isAmountInvalid || this.isCategoryInvalid || this.isDateInvalid) {
      return;
    }

    this.isLoading = true;

    // helper to decode JWT payload safely (returns object or null)
    const decodePayload = (jwt: string | null | undefined): any | null => {
      if (!jwt) return null;
      try {
        const parts = jwt.split('.');
        if (parts.length < 2) return null;
        const payload = parts[1];
        const b64 = payload.replace(/-/g, '+').replace(/_/g, '/');
        const pad = b64.length % 4;
        const padded = pad ? b64 + '='.repeat(4 - pad) : b64;
        const json = atob(padded);
        return JSON.parse(json);
      } catch (e) {
        console.warn('Failed to decode token payload', e);
        return null;
      }
    };

    const doCreate = (userId: number) => {
      const payload: ExpenseDTO = {
        userId: userId,
        amount: this.expense.amount,
        category: this.expense.category!.trim(),
        date: this.expense.date!,
        description: this.expense.description,
        frequency: this.expense.frequency!,
        endDate: this.expense.endDate,
        nextDueDate: this.expense.nextDueDate,
        paymentMethod: this.expense.paymentMethod!,
      } as ExpenseDTO;

      console.log('📤 Sending expense payload:', payload);

      this.expenseService.createExpense(payload).subscribe({
        next: () => {
          this.isLoading = false;
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Expense added successfully!', life: 3000 });

          setTimeout(() => {
            if (this.addMore) {
              form.resetForm({
                amount: null,
                category: '',
                date: '',
                description: '',
                frequency: ExpenseDTO.FrequencyEnum.OneTime,
                endDate: '',
                nextDueDate: '',
                paymentMethod: ExpenseDTO.PaymentMethodEnum.Card,
              });
              this.submitted = false;
              // reset local model to defaults
              this.expense = {
                userId: 0,
                amount: 0,
                category: '',
                date: new Date().toISOString().split('T')[0],
                description: '',
                frequency: ExpenseDTO.FrequencyEnum.OneTime,
                endDate: undefined,
                nextDueDate: undefined,
                paymentMethod: ExpenseDTO.PaymentMethodEnum.Card,
              } as ExpenseDTO;
            } else {
              this.router.navigate(['/expenses/list']);
            }
          }, 1200);
        },
        error: (err) => {
          this.isLoading = false;
          console.error('Expense creation failed:', err);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to add expense. Please check the data or try again later.', life: 4000 });
        },
      });
    };

    // Resolve user: prefer decoding token first (id/email), then fallback to TokenService.getEmailFromToken
    const token = this.tokenService.getToken?.();
    const payload = decodePayload(token);
    console.debug('saveExpense: token:', token, 'decoded payload:', payload);

    // First try token-decoded candidate id
    const tokenCandidate = payload?.id ?? payload?.userId ?? payload?.sub;
    if (tokenCandidate && !isNaN(Number(tokenCandidate))) {
      console.debug('Using user id from token payload:', tokenCandidate);
      doCreate(Number(tokenCandidate));
      return;
    }

    // If token includes an email, try lookup
    const tokenEmail = payload?.email ?? null;
    if (tokenEmail) {
      console.debug('Trying user lookup by email from token:', tokenEmail);
      this.userService.getUserByEmail(tokenEmail).subscribe({
        next: (user) => {
          if (user && user.id) {
            doCreate(user.id);
            return;
          }
          // try currentUser fallback
          try {
            const cur = localStorage.getItem('currentUser');
            if (cur) {
              const parsed = JSON.parse(cur);
              if (parsed && parsed.id) {
                doCreate(Number(parsed.id));
                return;
              }
            }
          } catch (e) {
            console.debug('Failed to parse currentUser from localStorage', e);
          }
          this.isLoading = false;
          this.messageService.add({ severity: 'error', summary: 'Auth Error', detail: 'Could not resolve user from token. Please sign in or check your session.' });
        },
        error: (err) => {
          console.error('User lookup from token email failed', err);
          this.isLoading = false;
          this.messageService.add({ severity: 'error', summary: 'Auth Error', detail: 'Failed to resolve user — please ensure you are signed in.' });
        },
      });
      return;
    }

    // Next try TokenService.getEmailFromToken (legacy behavior)
    const email = this.tokenService.getEmailFromToken?.();
    if (email) {
      console.debug('Trying user lookup by email from TokenService:', email);
      this.userService.getUserByEmail(email).subscribe({
        next: (user) => {
          if (user && user.id) {
            doCreate(user.id);
            return;
          }
          // try currentUser fallback
          try {
            const cur = localStorage.getItem('currentUser');
            if (cur) {
              const parsed = JSON.parse(cur);
              if (parsed && parsed.id) {
                doCreate(Number(parsed.id));
                return;
              }
            }
          } catch (e) {
            console.debug('Failed to parse currentUser from localStorage', e);
          }
          this.isLoading = false;
          this.messageService.add({ severity: 'error', summary: 'Auth Error', detail: 'Could not resolve user from token. Please sign in or check your session.' });
        },
        error: (err) => {
          console.error('User lookup failed', err);
          this.isLoading = false;
          this.messageService.add({ severity: 'error', summary: 'Auth Error', detail: 'Failed to resolve user — please ensure you are signed in.' });
        },
      });
      return;
    }

    // Lastly try currentUser localStorage
    try {
      const cur = localStorage.getItem('currentUser');
      if (cur) {
        const parsed = JSON.parse(cur);
        if (parsed && parsed.id) {
          doCreate(Number(parsed.id));
          return;
        }
      }
    } catch (e) {
      console.debug('Failed to parse currentUser from localStorage', e);
    }

    // If we reach here, we couldn't resolve a user
    this.isLoading = false;
    this.messageService.add({ severity: 'error', summary: 'Auth Error', detail: 'User not authenticated. Please sign in to continue.' });
    return;
  }

  cancel() {
    this.router.navigate(['/expenses/list']);
  }

  onMenuSelect(label: string) {
    this.menuService.navigate(label);
  }
}
