import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { SidebarComponent } from '../../sidebar/sidebar.component';
import { MenuService } from '../services/menu.service';
import { ExpenseControllerService, ExpenseDTO } from '../../../api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-all-expenses',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, SidebarComponent, ConfirmDialogModule, ToastModule],
  providers: [ConfirmationService, MessageService],
  templateUrl: './list-expense.html',
  styleUrls: ['./list-expense.css'],
})
export class AllExpensesComponent implements OnInit {
  private router: Router = inject(Router);
  private menuService: MenuService = inject(MenuService);
  private expenseService: ExpenseControllerService = inject(ExpenseControllerService);
  private confirmationService: ConfirmationService = inject(ConfirmationService);
  private messageService: MessageService = inject(MessageService);

  expenses: ExpenseDTO[] = [];
  filterDate = '';
  filterQuery = '';
  filterCategory = '';
  categories: string[] = [];

  loading = false;

  ngOnInit(): void {
    this.loadExpenses();
  }

  private sortExpenses(arr: ExpenseDTO[]): ExpenseDTO[] {
    arr.sort((a, b) => {
      const da = new Date(a.date || '').getTime();
      const db = new Date(b.date || '').getTime();
      return db - da;
    });
    return arr;
  }

  loadExpenses(): void {
    this.loading = true;
    // use the accepted header literal '*/*' to match the generated client types
    this.expenseService.getAllExpenses('body', false, { httpHeaderAccept: '*/*' }).subscribe({
      next: (data: ExpenseDTO[] | unknown) => {
        if (Array.isArray(data)) {
          const arr = data as ExpenseDTO[];
          this.expenses = this.sortExpenses(arr);
          this.categories = Array.from(new Set(this.expenses.map((e: ExpenseDTO) => e.category).filter(Boolean)));
        } else {
          // unexpected response
          this.expenses = [];
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load expenses', err);
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load expenses. Please try again.',
        });
      },
    });
  }

  editExpense(index: number): void {
    const expense = this.expenses[index];
    if (!expense?.id) return;
    this.router.navigate(['/expenses/edit', expense.id]);
  }

  goToAddExpense(): void {
    this.router.navigate(['/expenses/add']);
  }

  confirmDelete(index: number): void {
    const expense = this.expenses[index];
    if (!expense?.id) return;

    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this expense?',
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Yes',
      rejectLabel: 'Cancel',
      accept: () => {
        this.expenseService.deleteExpense(expense.id!).subscribe({
          next: () => {
            this.loadExpenses();
            this.messageService.add({
              severity: 'success',
              summary: 'Deleted',
              detail: 'Expense deleted successfully.',
              life: 2500,
            });
          },
          error: (err) => {
            console.error('Failed to delete expense', err);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to delete expense. Please try again.',
            });
          },
        });
      },
    });
  }

  filteredExpenses(): ExpenseDTO[] {
    return this.expenses.filter((e: ExpenseDTO) => {
      const matchDate = !this.filterDate || e.date === this.filterDate;
      const q = this.filterQuery?.toLowerCase() || '';
      const matchQuery = !q || (e.description?.toLowerCase().includes(q) || ('' + e.userId).includes(q));
      const matchCategory = !this.filterCategory || (e.category && e.category.toLowerCase() === this.filterCategory.toLowerCase());
      return matchDate && matchQuery && matchCategory;
    });
  }

  onMenuSelect(label: string): void {
    this.menuService.navigate(label);
  }
}
