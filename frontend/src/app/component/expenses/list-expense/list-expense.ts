import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { SidebarComponent } from '../../sidebar/sidebar.component';
import { MenuService } from '../services/menu.service';
import { ExpenseControllerService, ExpenseDTO, UserControllerService } from '../../../api';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { TokenService } from '../../../services/token.service';

@Component({
  selector: 'app-all-expenses',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    SidebarComponent,
    ToastModule,
    ConfirmDialog,
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './list-expense.html',
  styleUrls: ['./list-expense.css'],
})
export class AllExpensesComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private menuService = inject(MenuService);
  private expenseService = inject(ExpenseControllerService);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);
  private tokenService = inject(TokenService);
  private userService = inject(UserControllerService);

  expenses: ExpenseDTO[] = [];
  filterDate = '';
  filterQuery = '';
  filterCategory = '';
  categories: string[] = [];
  filterMethod = '';
  methods: string[] = ['Card', 'Transfer'];

  loading = false;
  private navSub?: Subscription;
  private userId?: number;

  ngOnInit(): void {
    this.loadCurrentUser();

    // 🔁 Reload when navigating back to this route
    this.navSub = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd && event.urlAfterRedirects.includes('/expenses/list')) {
        this.userId ? this.loadExpenses() : this.loadCurrentUser();
      }
    });

    window.addEventListener('expenses:refresh', this.handleRefreshEvent);
  }

  ngOnDestroy(): void {
    this.navSub?.unsubscribe();
    window.removeEventListener('expenses:refresh', this.handleRefreshEvent);
  }

  private handleRefreshEvent = () => this.loadExpenses();

  private sortExpenses(arr: ExpenseDTO[]): ExpenseDTO[] {
    return arr.sort((a, b) => {
      const da = new Date(a.date || '').getTime();
      const db = new Date(b.date || '').getTime();
      return db - da;
    });
  }

  /** 🔹 Load expenses belonging only to the current user */
  loadExpenses(): void {
    if (!this.userId) return;
    this.loading = true;

    this.expenseService.getAllExpenses().subscribe({
      next: (data: any) => {
        let expenses: ExpenseDTO[] = [];

        // 🧩 Handle Blob responses (from generated OpenAPI clients)
        if (data && typeof data.text === 'function') {
          (data as Blob).text().then((text) => {
            try {
              expenses = JSON.parse(text);
              this.applyExpenses(expenses);
            } catch {
              console.error('Failed to parse blob response for expenses.');
            }
            this.loading = false;
          });
          return;
        }

        if (Array.isArray(data)) {
          expenses = data;
          this.applyExpenses(expenses);
        } else {
          console.warn('Unexpected response for getAllExpenses', data);
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

  private applyExpenses(expenses: ExpenseDTO[]): void {
    this.expenses = this.sortExpenses(expenses.filter(e => String(e.userId) === String(this.userId)));
    this.categories = Array.from(new Set(this.expenses.map(e => e.category).filter(Boolean)));
  }

  /** 🔹 Load current user by decoding token or querying backend */
  private loadCurrentUser(): void {
    const email = this.tokenService.getEmailFromToken?.() ?? null;
    console.log('🟣 loadCurrentUser(): token email =', email);

    if (email) {
      this.userService.getUserByEmail(email).subscribe({
        next: (user) => {
          this.userId = user.id;
          this.loadExpenses();
        },
        error: (err) => {
          console.error('Error loading user by email:', err);
          this.resolveUserFromTokenOrStorage();
        },
      });
    } else {
      this.resolveUserFromTokenOrStorage();
    }
  }

  /** 🔹 Attempt to get user from token or fallback storage */
  private resolveUserFromTokenOrStorage(): void {
    const token = this.tokenService.getToken?.() ??
      localStorage.getItem('jwt') ??
      localStorage.getItem('token') ??
      localStorage.getItem('access_token') ??
      null;

    if (!token) {
      this.fallbackCurrentUserStorage();
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      this.userId = payload?.id || payload?.userId || null;

      if (this.userId) {
        this.loadExpenses();
        return;
      }

      const email = payload?.sub || payload?.email;
      if (email) {
        this.userService.getUserByEmail(email).subscribe({
          next: (user) => {
            this.userId = user.id;
            this.loadExpenses();
          },
          error: (err) => {
            console.error('Failed to resolve user by email from token:', err);
            this.fallbackCurrentUserStorage();
          },
        });
      } else {
        this.fallbackCurrentUserStorage();
      }
    } catch (e) {
      console.error('Invalid JWT structure or decode error:', e);
      this.fallbackCurrentUserStorage();
    }
  }

  /** 🔹 Last fallback — try localStorage.currentUser */
  private fallbackCurrentUserStorage(): void {
    try {
      const cur = localStorage.getItem('currentUser');
      if (cur) {
        const parsed = JSON.parse(cur);
        if (parsed?.id) {
          this.userId = Number(parsed.id);
          this.loadExpenses();
        }
      }
    } catch (e) {
      console.warn('Could not parse currentUser from localStorage');
    }
  }

  /** 🔹 Filtering logic */
  get filteredExpenses(): ExpenseDTO[] {
    const query = this.filterQuery?.toLowerCase().trim();
    return this.expenses.filter((e) => {
      const matchDate = !this.filterDate || e.date === this.filterDate;
      const matchQuery =
        !query ||
        e.description?.toLowerCase().includes(query) ||
        ('' + e.userId).includes(query);
      const matchCategory =
        !this.filterCategory ||
        e.category?.toLowerCase() === this.filterCategory.toLowerCase();
      return matchDate && matchQuery && matchCategory;
    });
  }

  /** 🔹 Actions */
  goToAddExpense(): void {
    this.router.navigate(['/expenses/add']);
  }

  editExpense(index: number): void {
    const expense = this.expenses[index];
    if (expense?.id) this.router.navigate(['/expenses/edit', expense.id]);
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
          error: () => {
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

  onMenuSelect(label: string): void {
    this.menuService.navigate(label);
  }
}
