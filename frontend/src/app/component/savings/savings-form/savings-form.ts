import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { InputText } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DatePickerModule } from 'primeng/datepicker';
import { Button } from 'primeng/button';
import { Textarea } from 'primeng/textarea';
import { SavingService } from '../../../api';
import { AuthService } from '../../../services/auth.service';
import {SidebarComponent} from '../../sidebar/sidebar.component';

@Component({
  selector: 'app-savings-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputText,
    DatePickerModule,
    Button,
    Textarea,
    InputNumberModule,
    SidebarComponent
  ],
  templateUrl: './savings-form.html',
  styleUrls: ['./savings-form.css']
})
export class SavingsForm implements OnInit {
  savingForm: FormGroup;
  savingId?: number;
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private savingService: SavingService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
  ) {
    this.savingForm = this.fb.group({
      amount: [null, [Validators.required, Validators.min(0.01)]],
      goal: ['', Validators.required],
      date: [null, Validators.required],
      description: ['']
    });
  }

  ngOnInit(): void {
    this.savingId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.savingId) {
      this.isEditMode = true;
      this.loadSavingForEdit(this.savingId);
    }
  }

  loadSavingForEdit(id: number): void {
    this.savingService.getSavingById(id).subscribe({
      next: (saving) => {
        this.savingForm.patchValue({
          amount: saving.amount,
          goal: saving.goal,
          date: new Date(saving.date ?? ''),
          description: saving.description
        });
      },
      error: (err) => console.error('Error loading saving:', err)
    });
  }

  onSubmit() {
    if (this.savingForm.invalid) {
      this.savingForm.markAllAsTouched();
      return;
    }

    // Convertește data în format ISO string (YYYY-MM-DD)
    const formValue = this.savingForm.value;
    const dateValue = formValue.date;
    const formattedDate = dateValue instanceof Date
      ? dateValue.toISOString().split('T')[0]  // ← Conversie la string
      : dateValue;

    if (this.isEditMode && this.savingId) {
      // UPDATE
      const savingToUpdate = {
        id: this.savingId,
        amount: formValue.amount,
        goal: formValue.goal,
        date: formattedDate,  // ← Data formatată
        description: formValue.description || '',
        userId: this.authService.getUser()?.id || 1  // ← Fallback la 1
      };

      this.savingService.updateSaving(this.savingId, savingToUpdate).subscribe({
        next: () => {
          alert('Saving updated successfully!');
          this.router.navigate(['/savings']);
        },
        error: (err) => {
          console.error('Error updating:', err);
          alert('Error updating saving: ' + (err.error?.message || err.message));
        }
      });
    } else {
      // CREATE
      const savingToCreate = {
        amount: formValue.amount,
        goal: formValue.goal,
        date: formattedDate,  // ← Data formatată
        description: formValue.description || '',
        userId: this.authService.getUser()?.id || 1  // ← Fallback la 1
      };

      this.savingService.addSaving(savingToCreate).subscribe({
        next: () => {
          alert('Saving added successfully!');
          this.router.navigate(['/savings']);
        },
        error: (err) => {
          console.error('Error creating:', err);
          alert('Error adding saving: ' + (err.error?.message || err.message));
        }
      });
    }
  }

  onCancel() {
    this.router.navigate(['/savings']);
  }
}
