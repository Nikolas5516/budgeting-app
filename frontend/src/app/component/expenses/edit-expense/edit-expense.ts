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

  isAmountInvalid = false;
  isCategoryInvalid = false;
  isDateInvalid = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private menuService: MenuService,
    private expenseService: ExpenseControllerService,
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
                console.error('Error parsing expense', e);
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

  onAmountInput(): void {
    this.isAmountInvalid = !(this.expense.amount !== undefined && this.expense.amount !== null && this.expense.amount > 0);
  }

  onCategoryChange(): void {
    this.isCategoryInvalid = !this.expense.category;
  }

  onDateInput(): void {
    this.isDateInvalid = !this.expense.date;
  }

  saveExpense(form: NgForm): void {
    this.submitted = true;

    this.isAmountInvalid = !(this.expense.amount !== undefined && this.expense.amount !== null && this.expense.amount > 0);
    this.isCategoryInvalid = !this.expense.category;
    this.isDateInvalid = !this.expense.date;

    if (this.isAmountInvalid || this.isCategoryInvalid || this.isDateInvalid) {
      return;
    }

    this.expenseService.updateExpense(this.expense.id!, this.expense).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Expense updated successfully!',
          life: 3000,
        });
        setTimeout(() => this.router.navigate(['/expenses/list']), 1200);
      },
      error: (err) => {
        console.error('Failed to update expense', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to update expense.',
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
