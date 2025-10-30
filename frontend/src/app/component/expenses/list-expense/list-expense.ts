import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { SidebarComponent } from '../../sidebar/sidebar.component';
import { MenuService } from '../services/menu.service';
import { ExpenseControllerService, ExpenseDTO } from '../../../api';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { TokenService } from '../../../services/token.service';
import { UserControllerService } from '../../../api';

@Component({
  selector: 'app-all-expenses',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, SidebarComponent, ConfirmDialog, ToastModule],
  providers: [ConfirmationService, MessageService],
  templateUrl: './list-expense.html',
  styleUrls: ['./list-expense.css'],
})
export class AllExpensesComponent implements OnInit, OnDestroy {
  private router: Router = inject(Router);
  private menuService: MenuService = inject(MenuService);
  private expenseService: ExpenseControllerService = inject(ExpenseControllerService);
  private confirmationService: ConfirmationService = inject(ConfirmationService);
  private messageService: MessageService = inject(MessageService);
  private tokenService: TokenService = inject(TokenService);
  private userService: UserControllerService = inject(UserControllerService);

  expenses: ExpenseDTO[] = [];
  filterDate = '';
  filterQuery = '';
  filterSource = '';
  filterCategory = '';
  categories: string[] = [];

  loading = false;
  private navSub?: Subscription;
  private userId?: number;

  ngOnInit(): void {
    // Resolve current user and then load expenses once userId is known
    this.loadCurrentUser();
    // reload when navigation finishes
    this.navSub = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (event.urlAfterRedirects && event.urlAfterRedirects.includes('/expenses/list')) {
          // if we already know the userId, refresh; otherwise resolve user then load
          if (this.userId != null) {
            this.loadExpenses();
          } else {
            this.loadCurrentUser();
          }
        }
      }
    });

    // listen for manual refresh events (dispatched by AddExpenseComponent after create)
    window.addEventListener('expenses:refresh', this.handleRefreshEvent);

    // reference confirmDelete so static analyzers know it's used from the template
    // (this is a no-op statement and has no runtime effect)
    void (this.confirmDelete);
    // also reference deleteExpense (used in template via action) so it's not flagged as unused
    void (this.deleteExpense);
  }

  private handleRefreshEvent = () => {
    this.loadExpenses();
  }

  ngOnDestroy(): void {
    this.navSub?.unsubscribe();
    window.removeEventListener('expenses:refresh', this.handleRefreshEvent);
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
    const userId = this.userId;
    this.loading = true;
    this.expenseService.getAllExpenses().subscribe({
      next: (data: any) => {
        // handle Blob response that some generated clients produce
        if (data && typeof (data as any).text === 'function') {
          (data as Blob).text().then((text) => {
            try {
              const arr = JSON.parse(text) as ExpenseDTO[];
              this.expenses = this.sortExpenses(arr.filter(i => String(i.userId) === String(userId)));
              this.categories = Array.from(new Set(this.expenses.map(e => e.category).filter(Boolean)));
            } catch (e) {
              console.error('Failed to parse blob response for expenses:', e);
              this.expenses = [];
            }
            this.loading = false;
          }).catch((e) => {
            console.error('Failed to read blob response for expenses:', e);
            this.loading = false;
          });
          return;
        }

        if (Array.isArray(data)) {
          this.expenses = this.sortExpenses((data as ExpenseDTO[]).filter(i => String(i.userId) === String(userId)));
          this.categories = Array.from(new Set(this.expenses.map(e => e.category).filter(Boolean)));
        } else {
          console.warn('Unexpected response for getAllExpenses, expected array:', data);
          this.expenses = [];
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load expenses', err);
        this.loading = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load expenses. Please try again.' });
      }
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

  deleteExpense(id: number): void {
    // show a confirm dialog and call delete API
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this expense?',
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.expenseService.deleteExpense(id).subscribe({
          next: () => {
            this.expenses = this.expenses.filter(e => e.id !== id);
            this.messageService.add({ severity: 'success', summary: 'Deleted', detail: 'Expense deleted successfully.', life: 2500 });
          },
          error: (err) => {
            console.error('Error deleting expense:', err);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete expense.' });
          }
        });
      }
    });
  }

  get filteredExpenses(): ExpenseDTO[] {
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

  // load current user id from token/email and then load expenses (deterministic)
  private loadCurrentUser(): void {
    const email = this.tokenService.getEmailFromToken?.() ?? null;
    console.log('list.loadCurrentUser: token email =', email);
    if (email) {
      this.userService.getUserByEmail(email).subscribe({
        next: (user) => {
          console.log('list.loadCurrentUser: resolved user =', user);
          this.userId = user.id;
          this.loadExpenses();
        },
        error: (err) => {
          console.error('Error loading user by email:', err);
          // fallback to attempt token decode / localStorage
          this.resolveUserFromTokenOrStorage();
        }
      });
      return;
    }
    // no email from TokenService -> try to resolve from token or localStorage
    this.resolveUserFromTokenOrStorage();
  }

  private resolveUserFromTokenOrStorage(): void {
    // try to get token via TokenService.getToken() if available
    let token: string | null;
    try {
      token = (this.tokenService as any).getToken?.() ?? null;
    } catch (e) { token = null; }
    // also try common localStorage keys (include 'jwt')
    if (!token) token = localStorage.getItem('jwt') ?? localStorage.getItem('token') ?? localStorage.getItem('access_token') ?? localStorage.getItem('id_token') ?? null;

    const decode = (jwt: string | null): any | null => {
      if (!jwt) return null;
      try {
        const parts = jwt.split('.');
        if (parts.length < 2) return null;
        const payload = parts[1];
        const b64 = payload.replace(/-/g, '+').replace(/_/g, '/');
        const pad = b64.length % 4;
        const padded = pad ? b64 + '='.repeat(4 - pad) : b64;
        return JSON.parse(atob(padded));
      } catch (e) {
        return null;
      }
    };

    const p = decode(token);
    console.log('list.resolveUserFromTokenOrStorage: decoded token payload =', p);
    const candidateId = p?.id ?? p?.userId ?? null;
    const candidateSub = p?.sub ?? p?.email ?? null;
    console.log('list.resolveUserFromTokenOrStorage: candidateId =', candidateId, 'candidateSub/email =', candidateSub);
    if (candidateId) {
      this.userId = Number(candidateId);
      this.loadExpenses();
      return;
    }
    // If token contains an email/subject, try to resolve user by email
    if (candidateSub && typeof candidateSub === 'string' && candidateSub.includes('@')) {
      this.userService.getUserByEmail(candidateSub).subscribe({
        next: (user) => {
          this.userId = user?.id;
          this.loadExpenses();
        },
        error: (err) => {
          console.error('Failed to resolve user by email from token payload:', err);
          // continue to fallback to localStorage below
          this.fallbackCurrentUserStorage();
        }
      });
      return;
    }

    // fallback: check localStorage.currentUser
    this.fallbackCurrentUserStorage();
  }

  private fallbackCurrentUserStorage(): void {
    try {
      const cur = localStorage.getItem('currentUser');
      console.log('list.fallbackCurrentUserStorage: localStorage.currentUser =', cur);
      if (cur) {
        const parsed = JSON.parse(cur);
        console.log('list.fallbackCurrentUserStorage: parsed currentUser =', parsed);
        if (parsed && parsed.id) this.userId = Number(parsed.id);
      }
    } catch (e) { /* ignore */ }
    this.loadExpenses();
  }
}
