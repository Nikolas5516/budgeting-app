import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { InputText } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DatePickerModule } from 'primeng/datepicker';
import { Button } from 'primeng/button';
import { Textarea } from 'primeng/textarea';
import { SavingService, UserControllerService } from '../../../api';
import { TokenService } from '../../../services/token.service';
import { SidebarComponent } from '../../sidebar/sidebar.component';

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
    private userId?: number;

    constructor(
        private fb: FormBuilder,
        private savingService: SavingService,
        private userService: UserControllerService,
        private tokenService: TokenService,
        private router: Router,
        private route: ActivatedRoute
    ) {
        this.savingForm = this.fb.group({
            amount: [null, [Validators.required, Validators.min(0.01)]],
            goal: ['', Validators.required],
            date: [null, Validators.required],
            description: ['']
        });
    }

    ngOnInit(): void {
        this.loadCurrentUser();
        this.savingId = Number(this.route.snapshot.paramMap.get('id'));
        if (this.savingId) {
            this.isEditMode = true;
            this.loadSavingForEdit(this.savingId);
        }
    }

    private loadCurrentUser(): void {
        const email = this.tokenService.getEmailFromToken();
        if (email) {
            this.userService.getUserByEmail(email).subscribe({
                next: (user) => {
                    this.userId = user.id;
                },
                error: (err) => console.error('Error loading user:', err)
            });
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

        if (!this.userId) {
            alert('User not loaded yet. Please try again.');
            return;
        }

        if (this.savingId) {
            const saving = {
                id: this.savingId,
                ...this.savingForm.value,
                userId: this.userId
            };

            this.savingService.updateSaving(this.savingId, saving).subscribe({
                next: () => {
                    alert('Saving updated successfully!');
                    this.router.navigate(['/savings']);
                },
                error: (err) => {
                    console.error('Error updating:', err);
                    alert('Error updating saving.');
                }
            });
        } else {
            const saving = {
                ...this.savingForm.value,
                userId: this.userId

            };

            this.savingService.addSaving(saving).subscribe({
                next: () => {
                    alert('Saving added successfully!');
                    this.router.navigate(['/savings']);
                },
                error: (err) => {
                    console.error('Error creating:', err);
                    alert('Error adding saving.');
                }
            });
        }
    }

    onCancel() {
        this.router.navigate(['/savings']);
    }
}
