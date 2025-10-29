import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  @Input() isOpen = false;
  @Input() isSaving = false;

  @Output() save = new EventEmitter<{ currentPassword: string; newPassword: string }>();
  @Output() close = new EventEmitter<void>();

  passwordForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.passwordForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  private passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const newPassword = control.get('newPassword')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    if (!newPassword || !confirmPassword) {
      return null;
    }

    return newPassword === confirmPassword ? null : { passwordMismatch: true };
  }

  hasError(field: string, error: string = 'required'): boolean {
    const control = this.passwordForm.get(field);
    if (field === 'confirmPassword' && error === 'passwordMismatch') {
      return (this.passwordForm.touched && this.passwordForm.hasError('passwordMismatch'));
    }
    return !!(control && control.touched && control.hasError(error));
  }

  onSubmit(): void {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    const formValue = this.passwordForm.value;
    this.save.emit({
      currentPassword: formValue.currentPassword,
      newPassword: formValue.newPassword
    });
  }

  onCancel(): void {
    this.passwordForm.reset();
    this.close.emit();
  }
}
