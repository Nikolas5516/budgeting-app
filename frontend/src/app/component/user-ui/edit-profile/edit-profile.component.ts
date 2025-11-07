import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, AsyncValidatorFn, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { UserDTO, UserControllerService } from '../../../api';
import { Observable, of } from 'rxjs';
import { map, catchError, debounceTime, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit, OnChanges {
  @Input() isOpen = false;
  @Input() isSaving = false;
  @Input() user: UserDTO | null = null;

  @Output() save = new EventEmitter<{ name: string; email: string }>();
  @Output() close = new EventEmitter<void>();

  profileForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userController: UserControllerService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.patchFromUser();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['user'] && !changes['user'].firstChange) {
      this.patchFromUser();
    }
  }

  private initForm(): void {
    this.profileForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(80)]],
      email: ['',
        [Validators.required, Validators.email, Validators.maxLength(120)],
        [this.emailExistsValidator()]
      ]
    });
  }

  private emailExistsValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value || control.value === this.user?.email) {
        return of(null);
      }

      return of(control.value).pipe(
        debounceTime(500),
        switchMap(email =>
          this.userController.getUserByEmail(email).pipe(
            map(() => ({ emailExists: true })),
            catchError(() => of(null))
          )
        )
      );
    };
  }

  private patchFromUser(): void {
    if (!this.user) return;
    this.profileForm.patchValue({
      name: this.user.name ?? '',
      email: this.user.email ?? ''
    });
  }

  hasError(field: string, error: string = 'required'): boolean {
    const control = this.profileForm.get(field);
    return !!(control && control.touched && control.hasError(error));
  }

  onSubmit(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    const formValue = this.profileForm.value;
    this.save.emit({
      name: formValue.name,
      email: formValue.email
    });
  }

  onCancel(): void {
    this.close.emit();
  }
}
