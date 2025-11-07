import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { SidebarComponent } from '../../sidebar/sidebar.component';
import { MenuService } from '../services/menu.service';
import { ExpenseControllerService, ExpenseDTO } from '../../../api';

@Component({
  selector: 'app-edit-expense',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    ToastModule,
    ButtonModule,
    MessageModule,
    SidebarComponent,
  ],
  providers: [MessageService],
  templateUrl: './edit-expense.html',
  styleUrls: ['./edit-expense.css'],
})
export class EditExpenseComponent implements OnInit {
  expense: ExpenseDTO = {} as ExpenseDTO;
  submitted = false;

  // validation flags
  isAmountInvalid = false;
  isCategoryInvalid = false;
  isDateInvalid = false;
  isEndDateInvalid = false;
  isNextDueDateInvalid = false;

  // dropdown options
  frequencyOptions = [
    { label: 'One Time', value: 'ONE_TIME' },
    { label: 'Monthly', value: 'MONTHLY' },
    { label: 'Yearly', value: 'YEARLY' },
  ];

  paymentMethodOptions = [
    { label: 'Card', value: 'CARD' },
    { label: 'Transfer', value: 'TRANSFER' },
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private menuService: MenuService,
    private expenseService: ExpenseControllerService
  ) {}

  ngOnInit(): void {
    const nav = history.state;
    if (nav && nav.expense) {
      this.expense = { ...nav.expense };
      return;
    }

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadExpenseById(+id);
    }
  }

  /** Load expense details by ID */
  loadExpenseById(id: number): void {
    this.expenseService
      .getExpenseById(id, 'body', false, { httpHeaderAccept: '*/*' })
      .subscribe({
        next: (data: any) => {
          if (data instanceof Blob) {
            data.text().then((text) => {
              try {
                this.expense = JSON.parse(text);
              } catch (e) {
                console.error('Error parsing expense:', e);
              }
            });
          } else {
            this.expense = data;
          }
        },
        error: (err) => {
          console.error('Failed to load expense', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Could not load expense data.',
          });
          this.router.navigate(['/expenses/list']);
        },
      });
  }

  /** Input field validation handlers */
  onAmountInput(): void {
    this.isAmountInvalid =
      !(this.expense.amount !== undefined &&
        this.expense.amount !== null &&
        this.expense.amount > 0);
  }

  onCategoryChange(): void {
    this.isCategoryInvalid = !this.expense.category;
  }

  onDateInput(): void {
    this.isDateInvalid = !this.expense.date;
    this.validateDateRelations();
  }

  onEndDateInput(): void {
    this.validateDateRelations();
  }

  onNextDueDateInput(): void {
    this.validateDateRelations();
  }

  /** Validate logical date order */
  private validateDateRelations(): void {
    this.isEndDateInvalid = false;
    this.isNextDueDateInvalid = false;

    const date = this.expense.date ? new Date(this.expense.date) : null;
    const endDate = this.expense.endDate ? new Date(this.expense.endDate) : null;
    const nextDue = this.expense.nextDueDate ? new Date(this.expense.nextDueDate) : null;

    if (date && endDate && endDate < date) {
      this.isEndDateInvalid = true;
    }
    if (date && nextDue && nextDue < date) {
      this.isNextDueDateInvalid = true;
    }
  }

  /** Save (update) expense */
  updateExpense(form: NgForm): void {
    this.submitted = true;

    this.onAmountInput();
    this.onCategoryChange();
    this.onDateInput();
    this.validateDateRelations();

    if (
      this.isAmountInvalid ||
      this.isCategoryInvalid ||
      this.isDateInvalid ||
      this.isEndDateInvalid ||
      this.isNextDueDateInvalid
    ) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Validation error',
        detail: 'Please correct the highlighted fields.',
      });
      return;
    }

    this.expenseService.updateExpense(this.expense.id!, this.expense).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Updated',
          detail: 'Expense updated successfully!',
          life: 2500,
        });
        setTimeout(() => this.router.navigate(['/expenses/list']), 1200);
      },
      error: (err) => {
        console.error('Failed to update expense:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to update expense. Please try again.',
        });
      },
    });
  }

  cancelEdit(): void {
    this.router.navigate(['/expenses/list']);
  }

  onMenuSelect(label: string): void {
    this.menuService.navigate(label);
  }
}
