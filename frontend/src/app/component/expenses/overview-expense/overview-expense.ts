// typescript
import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ChartModule } from 'primeng/chart';
import { SidebarComponent } from '../../sidebar/sidebar.component';
import { MenuService } from '../services/menu.service';
import { ExpenseControllerService, ExpenseDTO } from '../../../api';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialog } from 'primeng/confirmdialog';

@Component({
  selector: 'app-overview-expense',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule, ChartModule, SidebarComponent, ToastModule, ConfirmDialog],
  templateUrl: './overview-expense.html',
  styleUrls: ['./overview-expense.css'],
  providers: [ConfirmationService, MessageService],
})
export class OverviewExpenseComponent implements OnInit {
  // injected using the new inject() API to satisfy @angular-eslint/prefer-inject
  private router = inject(Router);
  private menuService = inject(MenuService);
  private expenseService = inject(ExpenseControllerService);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);

  loading = false;
  expenses: ExpenseDTO[] = [];
  recentExpenses: ExpenseDTO[] = [];
  expenseChartData: any;
  chartOptions = {
    plugins: { legend: { display: true } },
    scales: { y: { beginAtZero: true } },
  };

  totalExpenses = 0;
  reimbursedExpenses = 0;
  pendingExpenses = 0;
  failedExpenses = 0;

  tips = [
    { title: 'Track receipts', note: '- Keep records for deductions' },
    { title: 'Categorize expenses', note: '- Easier reporting' },
    { title: 'Set budgets', note: '- Avoid overspending' },
    { title: 'Review monthly', note: '- Spot unexpected charges' },
    { title: 'Use tags', note: '- Filter faster' },
  ];

  ngOnInit(): void {
    this.loadExpenses();
  }

  // helper to read status from ExpenseDTO in a resilient way
  private getStatus(item: ExpenseDTO): string | undefined {
    const s = (item as any).status ?? (item as any).state ?? (item as any).statusName ?? (item as any).statusCode;
    return typeof s === 'string' ? s : s?.toString();
  }

  loadExpenses(): void {
    this.loading = true;
    this.expenseService.getAllExpenses('body', false, { httpHeaderAccept: '*/*' }).subscribe({
      next: (data: any) => {
        const handle = (items: ExpenseDTO[]) => {
          const sorted = items.sort(
            (a, b) => new Date((b as any).date || 0).getTime() - new Date((a as any).date || 0).getTime(),
          );
          this.expenses = sorted;
          this.recentExpenses = sorted.slice(0, 3);
          this.calculateTotals(items);
          this.updateChartMonthly(items);
          this.loading = false;
        };

        if (Array.isArray(data)) {
          handle(data);
        } else {
          console.warn('Unexpected API response format. Expected array:', data);
          this.expenses = [];
          this.recentExpenses = [];
          this.expenseChartData = { labels: [], datasets: [{ label: 'Expenses', data: [], backgroundColor: '#A16EFF' }] };
          this.loading = false;
        }
      },
      error: (err) => {
        console.error('Failed to load expenses', err);
        this.loading = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load expenses. Please try again.' });
      },
    });
  }

  calculateTotals(items: ExpenseDTO[]): void {
    this.totalExpenses = items.length;
    // use the helper to safely obtain status, normalize to upper case
    this.reimbursedExpenses = items.filter((p) => {
      const s = (this.getStatus(p) ?? '').toUpperCase();
      return s === 'REIMBURSED' || s === 'PAID';
    }).length;

    this.pendingExpenses = items.filter((p) => {
      const s = (this.getStatus(p) ?? '').toUpperCase();
      return s === 'PENDING';
    }).length;

    this.failedExpenses = items.filter((p) => {
      const s = (this.getStatus(p) ?? '').toUpperCase();
      return s === 'FAILED' || s === 'ERROR';
    }).length;
  }

  updateChartMonthly(items: ExpenseDTO[]): void {
    if (!items || items.length === 0) {
      this.expenseChartData = { labels: [], datasets: [{ label: 'Expenses per Month', data: [], backgroundColor: '#A16EFF' }] };
      return;
    }

    const monthlyTotals: Record<string, number> = {};
    items.forEach((e) => {
      if (!e || !(e as any).date) return;
      const date = new Date((e as any).date);
      const monthName = date.toLocaleString('en-US', { month: 'short' });
      const amt = Number((e as any).amount) || 0;
      monthlyTotals[monthName] = (monthlyTotals[monthName] || 0) + amt;
    });

    const orderedMonths = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].filter(m => monthlyTotals[m]);
    const values = orderedMonths.map(m => monthlyTotals[m]);

    this.expenseChartData = {
      labels: orderedMonths,
      datasets: [{ label: 'Expenses per Month (amount)', data: values, backgroundColor: '#A16EFF' }],
    };
  }

  goToAllExpenses(): void {
    this.router.navigate(['/expenses']);
  }

  onMenuSelect(label: string): void {
    this.menuService.navigate(label);
  }

  editExpense(index: number): void {
    const expense = this.recentExpenses[index];
    if (!expense?.id) return;
    this.router.navigate(['/expenses/edit', expense.id]);
  }

  confirmDelete(index: number): void {
    const expense = this.recentExpenses[index];
    if (!expense?.id) return;

    this.confirmationService.confirm({
      message: `Are you sure you want to delete expense "${(expense as any).description || expense.id}"?`,
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Yes',
      rejectLabel: 'Cancel',
      accept: () => {
        this.expenseService.deleteExpense(expense.id!).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Deleted', detail: 'Expense deleted successfully.', life: 2500 });
            this.loadExpenses();
          },
          error: (err) => {
            console.error('Failed to delete expense', err);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete expense. Please try again.' });
          },
        });
      },
    });
  }
}
