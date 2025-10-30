import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { InputNumberModule } from 'primeng/inputnumber';
import { CalendarModule } from 'primeng/calendar';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import { SidebarComponent } from '../../sidebar/sidebar.component';
import { MenuService } from '../services/menu.service';

import { ExpenseDTO, ExpenseControllerService } from '../../../api';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-add-expense',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputNumberModule,
    CalendarModule,
    InputTextareaModule,
    ToastModule,
    SidebarComponent,
  ],
  providers: [MessageService],
  templateUrl: './add-expense.html',
  styleUrls: ['./add-expense.css'],
})
export class AddExpenseComponent implements OnInit {

  private fb = inject(FormBuilder);
  private expenseService = inject(ExpenseControllerService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);
  private messageService = inject(MessageService);
  private menuService = inject(MenuService);

  expenseForm: FormGroup = this.fb.group({
    amount: [null, [Validators.required, Validators.min(0.01)]],
    category: [null, Validators.required],
    date: [new Date().toISOString().split('T')[0], Validators.required],
    description: [''],
    frequency: [ExpenseDTO.FrequencyEnum.OneTime as any, Validators.required],
    endDate: [null],
    nextDueDate: [null],
    paymentMethod: [ExpenseDTO.PaymentMethodEnum.Card as any, Validators.required],
  });
  expenseId?: number;
  isEditMode = false;

  ngOnInit(): void {
    this.expenseId = Number(this.route.snapshot.paramMap.get('id')) || undefined;
    if (this.expenseId) {
      this.isEditMode = true;
      this.loadExpenseForEdit(this.expenseId);
    }

    this.handleFrequencyChanges();

    // keep references to methods used by template
    void this.onSubmit;
  }

  private handleFrequencyChanges(): void {
    const frequencyControl = this.expenseForm.get('frequency');
    const endDateControl = this.expenseForm.get('endDate');
    const nextDueDateControl = this.expenseForm.get('nextDueDate');

    frequencyControl?.valueChanges.subscribe((frequency) => {
      const isOneTime = frequency === ExpenseDTO.FrequencyEnum.OneTime;

      if (isOneTime) {
        endDateControl?.setValue(null);
        nextDueDateControl?.setValue(null);
        endDateControl?.disable();
        nextDueDateControl?.disable();
      } else {
        endDateControl?.enable();
        nextDueDateControl?.enable();
      }
    });
  }

  loadExpenseForEdit(id: number): void {
    this.expenseService.getExpenseById(id).subscribe({
      next: (expense: ExpenseDTO) => {
        this.expenseForm.patchValue({
          amount: expense.amount,
          category: expense.category,
          date: expense.date ?? new Date().toISOString().split('T')[0],
          description: expense.description,
          frequency: expense.frequency,
          endDate: expense.endDate ?? null,
          nextDueDate: expense.nextDueDate ?? null,
          paymentMethod: expense.paymentMethod,
        });
      },
      error: (_err: unknown) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load expense.' });
      },
    });
  }

  onSubmit() {
    if (this.expenseForm.invalid) {
      this.expenseForm.markAllAsTouched();
      this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Please fill in all required fields.' });
      return;
    }

    const formValue = this.expenseForm.getRawValue();

    const userId = this.authService.getUser?.()?.id;
    if (!userId) {
      this.messageService.add({ severity: 'error', summary: 'Auth Error', detail: 'User not authenticated or ID missing.' });
      return;
    }

    const toIso = (v: string | Date | null | undefined): string | undefined => {
      if (!v) return undefined;
      if (typeof v === 'string') return v;
      return (v as Date).toISOString().split('T')[0];
    };

    const expenseData: ExpenseDTO = {
      ...formValue,
      userId: userId,
      date: toIso(formValue.date)!,
      endDate: toIso(formValue.endDate),
      nextDueDate: toIso(formValue.nextDueDate),
    } as ExpenseDTO;

    if (this.expenseId) {
      this.expenseService.updateExpense(this.expenseId, expenseData).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Expense updated successfully!' });
          this.router.navigate(['/expenses']);
        },
        error: (_err: unknown) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error updating expense.' });
        },
      });
    } else {
      this.expenseService.createExpense(expenseData).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Expense added successfully!' });
          this.router.navigate(['/expenses']);
        },
        error: (_err: unknown) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error adding expense.' });
        },
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/expenses']);
    this.messageService.add({ severity: 'info', summary: 'Cancelled', detail: 'Expense creation cancelled.' });
  }

  onMenuSelect(label: string): void {
    this.menuService.navigate(label);
  }
}
