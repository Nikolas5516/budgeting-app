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
import { TokenService } from '../../../services/token.service';
import { UserControllerService } from '../../../api';

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
  private tokenService = inject(TokenService);
  private userService = inject(UserControllerService);

  private userId?: number;

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
    // Resolve current user, then load expenses shortly after (matches income_overview behavior)
    this.loadCurrentUser();
    setTimeout(() => this.loadExpenses(), 100);
  }

  // helper to read status from ExpenseDTO in a resilient way
  private getStatus(item: ExpenseDTO): string | undefined {
    const s = (item as any).status ?? (item as any).state ?? (item as any).statusName ?? (item as any).statusCode;
    return typeof s === 'string' ? s : s?.toString();
  }

  loadExpenses(): void {
    this.loading = true;
    this.expenseService.getAllExpenses().subscribe({
      next: (data: any) => {
        if (Array.isArray(data)) {
          this.applyOverviewFiltering(data as ExpenseDTO[]);
          return;
        }

        // Some generated clients may return a Blob depending on headers; try to handle that
        if (data && typeof (data as any).text === 'function') {
          (data as Blob).text().then((text) => {
            try {
              const parsed = JSON.parse(text) as ExpenseDTO[];
              this.applyOverviewFiltering(parsed);
            } catch (e) {
              console.error('overview.loadExpenses: failed to parse blob text', e);
              this.loading = false;
            }
          }).catch((e) => {
            console.error('overview.loadExpenses: failed to read blob', e);
            this.loading = false;
          });
          return;
        }

        console.warn('overview.loadExpenses: unexpected response format — expected array', data);
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load expenses', err);
        this.loading = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load expenses. Please try again.' });
      }
    });
  }

  private applyOverviewFiltering(items: ExpenseDTO[]): void {
    // ensure we only show the current user's expenses (tolerant to string/number types)
    const filtered = this.userId != null ? items.filter(i => String(i.userId) === String(this.userId)) : [];
    const sorted = filtered.sort((a, b) => new Date((b as any).date || 0).getTime() - new Date((a as any).date || 0).getTime());
    this.expenses = sorted;
    this.recentExpenses = sorted.slice(0, 3);
    this.calculateTotals(filtered);
    this.updateChartMonthly(filtered);
    this.loading = false;
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
    // navigate to the expenses list route (matches app.routes.ts)
    this.router.navigate(['/expenses/list']);
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

  // Resolve the current user (by email from token) and set userId
  private loadCurrentUser(): void {
    const email = this.tokenService.getEmailFromToken();
    if (email) {
      this.userService.getUserByEmail(email).subscribe({
        next: (user) => {
          this.userId = user?.id;
        },
        error: (err) => console.error('Error loading user:', err),
      });
    }
  }
}
